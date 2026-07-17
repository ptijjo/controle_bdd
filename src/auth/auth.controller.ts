import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthTokensResponseDto,
  InvitationVerifyResponseDto,
} from '../common/dto/auth-responses.dto';
import { UserResponseDto } from '../common/dto/user-response.dto';
import { getClientIp } from '../common/get-client-ip';
import { toUserResponseDto } from '../common/serialize-user';
import type { Request, Response } from 'express';
import { Role } from '../generated/prisma/client.js';
import {
  AUTH_REFRESH_COOKIE,
  AUTH_REFRESH_COOKIE_PATH,
} from './auth.constants';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { AuthDto } from './dto/auth.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterInviteDto } from './dto/register-invite.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginValidationGuard } from './guards/login-validation.guard';
import { RolesGuard } from './guards/roles.guard';
import type { AuthUser } from './types/auth-user.type';

type RequestWithUser = Request & { user: AuthUser };

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private refreshCookieMaxAgeMs(): number {
    const sec = Number(
      this.config.get<string>('REFRESH_TOKEN_EXPIRES_SEC') ?? '604800',
    );
    return (Number.isFinite(sec) ? sec : 604800) * 1000;
  }

  private setRefreshCookie(res: Response, refreshToken: string): void {
    res.cookie(AUTH_REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: AUTH_REFRESH_COOKIE_PATH,
      maxAge: this.refreshCookieMaxAgeMs(),
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie(AUTH_REFRESH_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: AUTH_REFRESH_COOKIE_PATH,
    });
  }

  @Get('invitation/verify/:token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Vérifier un jeton d’invitation' })
  @ApiOkResponse({ type: InvitationVerifyResponseDto })
  @ApiUnauthorizedResponse({ description: 'Jeton invalide ou expiré' })
  async verifyInvitation(@Param('token') token: string) {
    const { email } = await this.authService.verifyInvitationToken(
      decodeURIComponent(token),
    );
    return { data: { email } };
  }

  @Post('register/invite')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Inscription via lien d’invitation',
    description:
      'Le jeton est celui reçu par e-mail ; l’adresse e-mail est extraite côté serveur.',
  })
  @ApiBody({ type: RegisterInviteDto })
  @ApiCreatedResponse({ type: UserResponseDto })
  async registerInvite(@Body() dto: RegisterInviteDto) {
    const user = await this.authService.registerFromInvitation(dto);
    return toUserResponseDto(user);
  }

  @Post('invitation')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.controleur, Role.chef_service)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Envoyer une invitation par e-mail',
    description:
      'Réservé aux rôles **contrôleur** et **chef de service** (utilisateur connecté).',
  })
  @ApiBody({ type: CreateInvitationDto })
  async invitation(@Body() dto: CreateInvitationDto) {
    await this.authService.invitationUser(dto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LoginValidationGuard)
  @ApiOperation({
    summary: 'Connexion',
    description:
      'Access JWT (Bearer) + cookie httpOnly refresh. Le refresh n’est plus renvoyé dans le corps JSON (web).',
  })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({ description: 'Identifiants invalides' })
  async login(
    @Body() userData: AuthDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(userData, getClientIp(req));
    this.setRefreshCookie(res, result.cookie);
    return {
      access_token: result.access_token,
      user: toUserResponseDto(result.findUser),
    };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Rafraîchir les jetons',
    description:
      'Lit le refresh depuis le cookie httpOnly (web) ou le corps `refresh_token` (clients natifs). Rotation + révocation de l’ancien jti.',
  })
  @ApiBody({ type: RefreshDto, required: false })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh manquant ou invalide' })
  async refresh(
    @Req() req: Request,
    @Body() body: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const fromCookie = req.cookies?.[AUTH_REFRESH_COOKIE] as string | undefined;
    const refreshToken = fromCookie ?? body?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Refresh token manquant (cookie ou corps).',
      );
    }
    const tokens = await this.authService.rotateWithRefreshToken(refreshToken);
    this.setRefreshCookie(res, tokens.refresh_token);
    return {
      access_token: tokens.access_token,
      user: toUserResponseDto(tokens.user),
    };
  }

  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Déconnexion',
    description:
      'Révoque le refresh en base et supprime le cookie httpOnly.',
  })
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const fromCookie = req.cookies?.[AUTH_REFRESH_COOKIE] as string | undefined;
    await this.authService.logout(req.user.id, fromCookie);
    this.clearRefreshCookie(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Profil utilisateur (Bearer access token)' })
  @ApiOkResponse({ type: UserResponseDto })
  me(@Req() req: RequestWithUser) {
    return toUserResponseDto(req.user);
  }
}

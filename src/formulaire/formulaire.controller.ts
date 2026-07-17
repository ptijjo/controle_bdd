import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FormulaireCreateResponseDto } from '../common/dto/formulaire-response.dto';
import { getClientIp } from '../common/get-client-ip';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { Role } from '../generated/prisma/client.js';
import { CreateFormDto } from './dto/create-form.dto';
import { FormulaireService } from './formulaire.service';

type RequestWithUser = Request & { user: AuthUser };

@ApiTags('formulaire')
@Controller('formulaire')
export class FormulaireController {
  constructor(private readonly formulaireService: FormulaireService) {}

  @Get(['export', 'telecharger'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.controleur, Role.chef_service)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Télécharger le classeur Excel des contrôles',
    description:
      'Réservé aux rôles **contrôleur** et **chef de service**. Fichier `controle/controle.xlsx`. Alias : `GET /formulaire/export` ou `GET /formulaire/telecharger`.',
  })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiNotFoundResponse({
    description: 'Fichier absent (aucun formulaire enregistré encore)',
  })
  exportExcel() {
    return this.formulaireService.getControleExcelExport();
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer un formulaire de contrôle',
    description:
      'Persiste en base immédiatement ; PDF, e-mails et Excel sont traités en arrière-plan.',
  })
  @ApiBody({ type: CreateFormDto })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiCreatedResponse({ type: FormulaireCreateResponseDto })
  async create(
    @Req() req: RequestWithUser,
    @Body() body: CreateFormDto,
  ): Promise<{
    data: { id: string; status: string };
    message: string;
  }> {
    const data = await this.formulaireService.createForm(
      req.user,
      body,
      getClientIp(req),
    );
    return {
      data,
      message: 'Formulaire crée avec succès',
    };
  }
}

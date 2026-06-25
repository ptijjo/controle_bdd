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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user.type';
import { CreateFormDto } from './dto/create-form.dto';
import { FormulaireService } from './formulaire.service';

type RequestWithUser = Request & { user: AuthUser };

@ApiTags('formulaire')
@Controller('formulaire')
export class FormulaireController {
  constructor(private readonly formulaireService: FormulaireService) {}

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }
    const xReal = req.headers['x-real-ip'];
    if (typeof xReal === 'string' && xReal.length > 0) {
      return xReal.trim();
    }
    return req.socket.remoteAddress ?? 'unknown';
  }

  @Get(['export', 'telecharger'])
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Télécharger le classeur Excel des contrôles',
    description:
      'Fichier enregistré sur le serveur dans le dossier `controle/` sous le nom `controle.xlsx` (mis à jour à chaque formulaire). JWT obligatoire. Alias : `GET /formulaire/export` ou `GET /formulaire/telecharger`.',
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
      'Validation DTO stricte, PDF, e-mail administration (**Marin**) et e-mail séparé au chauffeur si son adresse est renseignée (sans fuite des autres destinataires), enregistrement Excel.',
  })
  @ApiBody({ type: CreateFormDto })
  @ApiUnauthorizedResponse({ description: 'Non authentifié' })
  @ApiCreatedResponse({ type: FormulaireCreateResponseDto })
  async create(
    @Req() req: RequestWithUser,
    @Body() body: CreateFormDto,
  ): Promise<{
    data: { envoiPdf: string; saveExcel: string };
    message: string;
  }> {
    const ipAddress = String(this.getClientIp(req));
    const data = await this.formulaireService.createForm(
      req.user,
      body,
      ipAddress,
    );
    return {
      data,
      message: 'Formulaire crée avec succès',
    };
  }
}

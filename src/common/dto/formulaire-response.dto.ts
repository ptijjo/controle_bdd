import { ApiProperty } from '@nestjs/swagger';

class FormulairePersistResultDto {
  @ApiProperty({ example: 'PDF enregistré' })
  envoiPdf!: string;

  @ApiProperty({ example: 'Excel mis à jour' })
  saveExcel!: string;
}

export class FormulaireCreateResponseDto {
  @ApiProperty({ type: FormulairePersistResultDto })
  data!: FormulairePersistResultDto;

  @ApiProperty({ example: 'Formulaire crée avec succès' })
  message!: string;
}

import { ApiProperty } from '@nestjs/swagger';

class FormulaireAcceptResultDto {
  @ApiProperty({ example: 'clxyz...' })
  id!: string;

  @ApiProperty({ example: 'accepted' })
  status!: string;
}

export class FormulaireCreateResponseDto {
  @ApiProperty({ type: FormulaireAcceptResultDto })
  data!: FormulaireAcceptResultDto;

  @ApiProperty({ example: 'Formulaire crée avec succès' })
  message!: string;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class RefreshDto {
  @ApiPropertyOptional({
    description:
      'Refresh JWT (clients mobiles sans cookie). Optionnel si le cookie `refresh_token` est envoyé.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  refresh_token?: string;
}

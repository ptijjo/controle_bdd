import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/client.js';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'nouveau@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Aa1!nouveau' })
  @IsOptional()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un symbole et au moins 8 caractères.',
    },
  )
  password?: string;

  @ApiPropertyOptional({ example: 'Martin' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  nom?: string;

  @ApiPropertyOptional({ example: 'Paul' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  prenom?: string;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

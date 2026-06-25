import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/** Corps de connexion (identique à LoginDto, nom explicite pour le service). */
export class AuthDto {
  @ApiProperty({ example: 'utilisateur@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'motdepasse' })
  @IsString()
  @MinLength(1, { message: 'Le mot de passe est requis' })
  password!: string;
}

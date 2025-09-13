import { Role } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsStrongPassword, IsIn, IsOptional } from 'class-validator';

export class CreateUserDto {
   @IsOptional()
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un symbole et au moins 8 caractères.',
    },
  )
  public password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(16)
  public nom: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(16)
  public prenom: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un symbole et au moins 8 caractères.',
    },
  )
  public password?: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Role))
  public role?: Role;
}

export class CreateInvitationDto {
  @IsEmail()
  public email: string;
}

export class AuthDto{
    @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre, un symbole et au moins 8 caractères.',
    },
  )
  public password: string;

}

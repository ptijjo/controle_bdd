import { Role } from '@prisma/client';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsStrongPassword, IsIn, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
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
  @IsStrongPassword()
  public password?: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(Role))
  public role?: Role;
}

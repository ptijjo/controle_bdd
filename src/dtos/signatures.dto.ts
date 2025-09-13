import { SignatureType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSignatureDto {
  @IsString()
  @IsNotEmpty()
  public base64: string;

  @IsOptional()
  @IsString()
  public signataireNom?: string;

  @IsIn(Object.values(SignatureType))
  @IsString()
  public type: SignatureType;
}

import { SignatureType } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSignatureDto {
  @IsString()
  @IsNotEmpty()
  public base64: string;

  @IsIn(Object.values(SignatureType))
  @IsString()
  public type: SignatureType;
}

import { TypeLigne } from '@prisma/client';
import { IsBoolean, IsDate, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  public numeroLigne: string;

  @IsString()
  @IsIn(Object.values(TypeLigne))
  public typeLigne: TypeLigne;

  @IsString()
  @IsNotEmpty()
  public lieuControle: string;

  @IsDate()
  public heurePrevue: Date;

  @IsDate()
  public heureReelle: Date;

  @IsString()
  @IsNotEmpty()
  public secteur: string;

  @IsNumber()
  @IsNotEmpty()
  public parc: number;

  @IsString()
  @IsNotEmpty()
  public nom: string;

  @IsString()
  @IsNotEmpty()
  public prenom: string;

  @IsEmail()
  public email: string;

  @IsOptional()
  @IsBoolean()
  public ficheHoraire?: boolean;

  @IsOptional()
  @IsBoolean()
  public respectItineraire?: boolean;

  @IsOptional()
  @IsBoolean()
  public affichageDestination?: boolean;

  @IsOptional()
  @IsBoolean()
  public affichageNumeroLigne?: boolean;

  @IsOptional()
  @IsBoolean()
  public pictoEnfant?: boolean;

  @IsOptional()
  @IsBoolean()
  public tarifAffiche?: boolean;

  @IsOptional()
  @IsBoolean()
  public depliantHoraire?: boolean;

  @IsOptional()
  @IsBoolean()
  public reglement?: boolean;

  @IsOptional()
  @IsBoolean()
  public tenue?: boolean;

  @IsOptional()
  @IsBoolean()
  public carosserie?: boolean;

  @IsOptional()
  @IsBoolean()
  public tableauBord?: boolean;

  @IsOptional()
  @IsBoolean()
  public sol?: boolean;

  @IsOptional()
  @IsBoolean()
  public temperature?: boolean;

  @IsOptional()
  @IsBoolean()
  public luminosite?: boolean;

  @IsNumber()
  @IsNotEmpty()
  public nbreVoyageur: number;

  @IsNumber()
  @IsNotEmpty()
  public nbreVoyageurIrregulier: number;

  @IsString()
  @IsNotEmpty()
  public observation: string;
}

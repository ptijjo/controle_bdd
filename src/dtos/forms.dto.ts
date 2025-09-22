import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateFormDto {
  @IsString()
  @IsNotEmpty()
  public numeroLigne: string;

  @IsString()
  @IsIn(['Lr', 'Sa', 'Sc'])
  public typeLigne: string;

  // @IsString()
  // @IsNotEmpty()
  // public lieuControle: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'L’heure doit être au format HH:mm' })
  @Transform(({ value }) => value?.trim())
  public heurePrevue: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'L’heure doit être au format HH:mm' })
  @Transform(({ value }) => value?.trim())
  public heureReelle: string;

  @IsDate({ message: 'date invalide' })
@Type(() => Date)
  public date: Date;

  // @IsString()
  // @IsNotEmpty()
  // public secteur: string;

  // @IsNumber()
  // @IsNotEmpty()
  // @Transform(({ value }) => Number(value))
  // public parc: number;

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
  @Transform(({ value }) => Number(value))
  public nbreVoyageur: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public nbreVoyageurIrregulier: number;

  @IsString()
  @IsNotEmpty()
  public observation: string;

  @IsString()
  @IsNotEmpty({ message: 'La signature du chauffeur est obligatoire' })
  public chauffeurSignature: string; // Base64

  @IsString()
  @IsNotEmpty({ message: 'La signature du contrôleur est obligatoire' })
  public controllerSignature: string; // Base64
}

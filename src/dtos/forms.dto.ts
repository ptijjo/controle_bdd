import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateFormDto {
  /**-------------------------------------------------------------------- */
  //Date de soumission du formulaire
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "L'heure doit être au format HH:mm" })
  @Transform(({ value }) => value?.trim())
  public heurePrevue: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "L'heure doit être au format HH:mm" })
  @Transform(({ value }) => value?.trim())
  public heureReelle: string;

  @IsDate({ message: 'date invalide' })
  @Type(() => Date)
  public date: Date;

  @IsString()
  @IsNotEmpty()
  public lieuControle: string;
  /**-------------------------------------------------------------------- */

  //Chauffeur info
  @IsString()
  @IsNotEmpty()
  public nom: string;

  @IsString()
  @IsNotEmpty()
  public prenom: string;

  @IsEmail()
  @IsOptional()
  public email?: string;
  /**-------------------------------------------------------------------- */

  //info arret de bus
  @IsOptional()
  @IsBoolean()
  public ficheHoraire?: boolean;

  @IsOptional()
  @IsBoolean()
  public panneauArret?: boolean;

  @IsString()
  @IsNotEmpty()
  public nomArret?: string;
  /**-------------------------------------------------------------------- */

  //info ligne de bus
  @IsString()
  @IsNotEmpty()
  public numeroLigne: string;

  /**-------------------------------------------------------------------- */

  //info client
  @IsString()
  @IsIn(['casas', 'rgeFluo57', 'casc', 'forbus', 'apeiMoselle', 'hombourgHaut', 'autres'])
  public client: string;

  @IsOptional()
  @IsString()
  @IsIn(['transavold', 'transchool'])
  public ligneCasas: string;

  @IsOptional()
  @IsString()
  @IsIn(['Lr', 'Sa', 'Sc'])
  public ligneRge: string;

  @IsOptional()
  @IsString()
  @IsIn(['Lr', 'Sa', 'Sc'])
  public ligneCasc: string;

  @IsOptional()
  @IsString()
  @IsIn(['11',"125"])
  public numLigneCascLr: string;

  @IsOptional()
  @IsString()
  @IsIn(["SA125"])
  public numLigneCascSA: string;

   @IsOptional()
  @IsString()
  @IsIn(["SR02","SR03","ESR01","EDP00","EGB00","EHR00","EKV00","ERI00","EVD00","EZT00","PT01","PT02","PT04","PT06","PT07"])
  public numLigneCascSc: string;

  @IsOptional()
  @IsString()
  @IsIn(['04', '07', '24', '39',"129","138","MS","21","23"])
  public numLigneRgeLr: string;

  @IsOptional()
  @IsString()
  @IsIn(['SA4', 'SA7', 'SA24',"SA129","SA138"])
  public numLigneRgeSa: string;

  @IsOptional()
  @IsString()
  @IsIn(['AV34', 'DZ04', 'DZ11',"ECR00","EDD00","ELB01","ERA00","ETE00","EVA01","EZB00","FQ01","FQ03","FQ04","FQ06","MF07","MH01","MH03","EHV00","ELL00"])
  public numLigneRgeSc: string;

  @IsOptional()
  @IsString()
  @IsIn(['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10'])
  public numLigneTransavold: string;

  @IsOptional()
  @IsString()
  @IsIn(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21', 'T22', 'T23', 'T24', 'T25', 'T26'])
  public numLigneTranschool: string;
  /**-------------------------------------------------------------------- */

  //meteo
  @IsString()
  @IsIn(['beau', 'pluvieux'])
  public meteo: string;
  /**-------------------------------------------------------------------- */

  //info car et trajet
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public parc: number;

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
  /**-------------------------------------------------------------------- */

  //conditions de transport
  @IsOptional()
  @IsBoolean()
  public sol?: boolean;

  @IsOptional()
  @IsBoolean()
  public temperature?: boolean;

  @IsOptional()
  @IsBoolean()
  public luminosite?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public observationConditions?: string;
  /**-------------------------------------------------------------------- */

  //info voyageur
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public nbreVoyageur: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public nbreVoyageurIrregulier: number;
  /**-------------------------------------------------------------------- */

  //signatures
  @IsString()
  @IsNotEmpty({ message: 'La signature du chauffeur est obligatoire' })
  public chauffeurSignature: string; // Base64

  @IsString()
  @IsNotEmpty({ message: 'La signature du contrôleur est obligatoire' })
  public controllerSignature: string; // Base64

  /**-------------------------------------------------------------------- */
}

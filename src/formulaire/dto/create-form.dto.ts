import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateFormDto {
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "L'heure doit être au format HH:mm" })
  @Transform(({ value }) =>
    value == null || value === '' ? '' : String(value).trim(),
  )
  public heurePrevue!: string;

  @Transform(({ value }) =>
    value == null || value === '' ? '' : String(value).trim(),
  )
  @IsString()
  @ValidateIf((o: CreateFormDto) => !o.carNonPasse)
  @Matches(/^\d{2}:\d{2}$/, { message: "L'heure doit être au format HH:mm" })
  public heureReelle?: string;

  @IsDate({ message: 'date invalide' })
  @Type(() => Date)
  public date!: Date;

  @IsString()
  @IsNotEmpty()
  public lieuControle!: string;

  @Transform(
    ({ value }) =>
      value === true || value === 'true' || value === 1 || value === '1',
  )
  @IsBoolean()
  public carNonPasse!: boolean;

  @IsString()
  @IsNotEmpty()
  public nom!: string;

  @IsString()
  @IsNotEmpty()
  public prenom!: string;

  @Transform(({ value }) =>
    value === '' || value === null ? undefined : value,
  )
  @IsOptional()
  @IsEmail({}, { message: 'Email invalide' })
  public email?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public ficheHoraire?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public cadreAffichage?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public etatGeneral?: string;

  @IsString()
  @IsIn(['Abris bus', 'Poteau arrêt', 'Non observable'])
  public typeArret!: string;

  @IsOptional()
  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public zebra?: string;

  @IsOptional()
  @IsString()
  public observationArret?: string;

  @IsString()
  @IsIn([
    'casas',
    'rgeFluo57',
    'casc',
    'forbus',
    'apeiMoselle',
    'hombourgHaut',
    'autres',
  ])
  public client!: string;

  @IsOptional()
  @IsString()
  @IsIn(['Sc'])
  public ligneHH?: string;

  @IsOptional()
  @IsString()
  @IsIn(['transavold', 'transchool'])
  public ligneCasas?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Doublage', 'CSCAF'])
  public ligneForbus?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Lr', 'Sa', 'Sc'])
  public ligneRge?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Lr', 'Sa', 'Sc'])
  public ligneCasc?: string;

  @IsOptional()
  @IsString()
  @IsIn(['HH1', 'HH2', 'HH3'])
  public numLigneHH?: string;

  @IsOptional()
  @IsString()
  @IsIn(['11', '125'])
  public numLigneCascLr?: string;

  @IsOptional()
  @IsString()
  @IsIn(['L2', 'L2 bis', 'L5', 'L9'])
  public numLigneForbusDoublage?: string;

  @IsOptional()
  @IsString()
  @IsIn([
    'CSCAF1',
    'CSCAF2',
    'CSCAF3',
    'CSCAF4',
    'CSCAF5',
    'CSCAF6',
    'CSCAF7',
  ])
  public numLigneForbusCSCAF?: string;

  @IsOptional()
  @IsString()
  @IsIn(['SA125'])
  public numLigneCascSA?: string;

  @IsOptional()
  @IsString()
  @IsIn([
    'SR02',
    'SR03',
    'ESR01',
    'EDP00',
    'EGB00',
    'EHR00',
    'EKV00',
    'ERI00',
    'EVD00',
    'EZT00',
    'PT01',
    'PT02',
    'PT04',
    'PT06',
    'PT07',
  ])
  public numLigneCascSc?: string;

  @IsOptional()
  @IsString()
  @IsIn(['04', '07', '24', '39', '129', '138', 'MS', '21', '23'])
  public numLigneRgeLr?: string;

  @IsOptional()
  @IsString()
  @IsIn(['SA4', 'SA7', 'SA24', 'SA129', 'SA138'])
  public numLigneRgeSa?: string;

  @IsOptional()
  @IsString()
  @IsIn([
    'AV34',
    'DZ04',
    'DZ11',
    'ECR00',
    'EDD00',
    'ELB01',
    'ERA00',
    'ETE00',
    'EVA01',
    'EZB00',
    'FQ01',
    'FQ03',
    'FQ04',
    'FQ06',
    'MF07',
    'MH01',
    'MH03',
    'EHV00',
    'ELL00',
  ])
  public numLigneRgeSc?: string;

  @IsOptional()
  @IsString()
  @IsIn([
    'L1',
    'L2',
    'L3',
    'L4',
    'L5',
    'L6',
    'L7',
    'L8',
    'L9',
    'L10',
    'Express',
    'TransZac',
    'TAD',
  ])
  public numLigneTransavold?: string;

  @IsOptional()
  @IsString()
  @IsIn([
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
    'T13',
    'T14',
    'T15',
    'T16',
    'T17',
    'T18',
    'T19',
    'T20',
    'T21',
    'T22',
    'T23',
    'T24',
    'T25',
    'T26',
  ])
  public numLigneTranschool?: string;

  @IsString()
  @IsIn(['beau', 'pluvieux'])
  public meteo!: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public parc!: number;

  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public affichageDestination!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public affichageNumeroLigne!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public pictoEnfant!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public tarifAffiche!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public depliantHoraire!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme'])
  public reglement!: string;

  @IsString()
  @IsIn(['Propre', 'Moyen', 'Sale'])
  public carosserie!: string;

  @IsString()
  @IsNotEmpty()
  public observationCar!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme', 'Non observable'])
  public billetiqueElectronique!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme', 'Non observable'])
  public billetiqueManuelle!: string;

  @IsString()
  @IsIn(['Conforme', 'Non conforme', 'Non observable'])
  public fondDeCaisse!: string;

  @IsString()
  @IsNotEmpty()
  public observationBilletique!: string;

  @IsString()
  @IsIn(['Propre', 'Moyen', 'Sale'])
  public tableauBord!: string;

  @IsString()
  @IsIn(['Propre', 'Moyen', 'Sale'])
  public sol!: string;

  @IsString()
  @IsIn(['Propre', 'Moyen', 'Sale'])
  public vitres!: string;

  @IsString()
  @IsIn(['Propre', 'Moyen', 'Sale'])
  public sieges!: string;

  @IsOptional()
  @IsString()
  public observationConditionsVehicule?: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public nbreVoyageur!: number;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  public nbreVoyageurIrregulier!: number;

  @ValidateIf((o: CreateFormDto) => !o.carNonPasse)
  @IsString()
  @IsNotEmpty({ message: 'La signature du chauffeur est obligatoire' })
  public chauffeurSignature?: string;

  @ValidateIf((o: CreateFormDto) => !o.carNonPasse)
  @IsString()
  @IsNotEmpty({ message: 'La signature du contrôleur est obligatoire' })
  public controllerSignature?: string;
}

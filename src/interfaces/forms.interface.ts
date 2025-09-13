import { TypeLigne } from '@prisma/client';

export interface Form {
  id: String;
  dateControle: Date;
  controleurId: string;
  numeroLigne: string;
  typeLigne: TypeLigne;
  lieuControle: string;
  heurePrevue: Date;
  heureReelle: Date;
  secteur: string;
  parc: number;
  nom: string;
  prenom: string;
  email: string;

  ficheHoraire?: boolean;
  respectItineraire?: boolean;
  affichageDestination?: boolean;
  affichageNumeroLigne?: boolean;
  pictoEnfant?: boolean;
  tarifAffiche?: boolean;
  depliantHoraire?: boolean;
  reglement?: boolean;
  tenue?: boolean;
  carosserie?: boolean;
  tableauBord?: boolean;
  sol?: boolean;
  temperature?: boolean;
  luminosite?: boolean;
  nbreVoyageur: number;
  nbreVoyageurIrregulier: number;

  observation: string;
  createdAt: Date;
}

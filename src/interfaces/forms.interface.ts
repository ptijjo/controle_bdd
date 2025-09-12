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

  ficheHoraire?: Boolean;
  respectItineraire?: Boolean;
  affichageDestination?: Boolean;
  affichageNumeroLigne?: Boolean;
  pictoEnfant?: Boolean;
  tarifAffiche?: Boolean;
  depliantHoraire?: Boolean;
  reglement?: Boolean;
  tenue?: Boolean;
  carosserie?: Boolean;
  tableauBord?: Boolean;
  sol?: Boolean;
  temperature?: Boolean;
  luminosite?: Boolean;
  nbreVoyageur: number;
  nbreVoyageurIrregulier: number;

  observation: string;
}

import { CreateFormDto } from '@/dtos/forms.dto';
import path from 'path';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// const EXCEL_FILE = path.join(__dirname, 'Controle.xlsx');
const controleDir = path.resolve(process.cwd(), 'controle');
const EXCEL_FILE = path.join(controleDir, 'controle.xlsx');

export async function saveFormToExcel(controleur: { nom: string; prenom: string }, form: CreateFormDto) {
  const workbook = new ExcelJS.Workbook();
  let sheet: ExcelJS.Worksheet;

  // Crée le dossier s'il n'existe pas
  if (!fs.existsSync(controleDir)) {
    fs.mkdirSync(controleDir, { recursive: true });
  }

  //On vérifie si le fichier existe
  if (fs.existsSync(EXCEL_FILE)) {
    //charrger le fichier existant
    await workbook.xlsx.readFile(EXCEL_FILE);
    // Vérifier si la feuille "Controles" existe
    sheet = workbook.getWorksheet('Controles') || workbook.addWorksheet('Controles');
  } else {
    // Si le fichier n'existe pas, on crée le workbook et la feuille
    sheet = workbook.addWorksheet('Controles');
  }
  // Assurer que les colonnes sont toujours définies

  sheet.columns = [
    // { header: 'ID', key: 'id', width: 36 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Heure Prévue', key: 'heurePrevue', width: 12 },
    { header: 'Heure Réelle', key: 'heureReelle', width: 12 },
    { header: 'Lieu de Contrôle', key: 'lieuControle', width: 25 },
    
    // Chauffeur
    { header: 'Nom Chauffeur', key: 'nom', width: 20 },
    // { header: 'Prénom Chauffeur', key: 'prenom', width: 20 },
    // { header: 'Email Chauffeur', key: 'email', width: 30 },
    
    // Arrêt de bus
    { header: 'Fiche Horaire', key: 'ficheHoraire', width: 15 },
    { header: 'Cadre Affichage', key: 'cadreAffichage', width: 15 },
    { header: 'État Général', key: 'etatGeneral', width: 15 },
    { header: 'Type Arrêt', key: 'typeArret', width: 20 },
    { header: 'Zébra', key: 'zebra', width: 15 },
    { header: 'Observation Arrêt', key: 'observationArret', width: 30 },
    
    // Ligne de bus
    // { header: 'N° Ligne', key: 'numeroLigne', width: 15 },
    
    // Client
    { header: 'Client', key: 'client', width: 20 },
    { header: 'Ligne Casas', key: 'ligneCasas', width: 15 },
    { header: 'Ligne RGE', key: 'ligneRge', width: 15 },
    { header: 'Ligne CASC', key: 'ligneCasc', width: 15 },
    { header: 'N° Ligne CASC LR', key: 'numLigneCascLr', width: 15 },
    { header: 'N° Ligne CASC SA', key: 'numLigneCascSA', width: 15 },
    { header: 'N° Ligne CASC SC', key: 'numLigneCascSc', width: 15 },
    { header: 'N° Ligne RGE LR', key: 'numLigneRgeLr', width: 15 },
    { header: 'N° Ligne RGE SA', key: 'numLigneRgeSa', width: 15 },
    { header: 'N° Ligne RGE SC', key: 'numLigneRgeSc', width: 15 },
    { header: 'N° Ligne Transavold', key: 'numLigneTransavold', width: 15 },
    { header: 'N° Ligne Transchool', key: 'numLigneTranschool', width: 15 },
    
    // Météo
    { header: 'Météo', key: 'meteo', width: 15 },
    
    // Car et trajet
    { header: 'Parc', key: 'parc', width: 10 },
    // { header: 'Respect Itinéraire', key: 'respectItineraire', width: 18 },
    { header: 'Affichage Destination', key: 'affichageDestination', width: 22 },
    { header: 'Affichage N° Ligne', key: 'affichageNumeroLigne', width: 20 },
    { header: 'Picto Enfant', key: 'pictoEnfant', width: 15 },
    { header: 'Tarif Affiché', key: 'tarifAffiche', width: 15 },
    { header: 'Dépliant Horaire', key: 'depliantHoraire', width: 17 },
    { header: 'Règlement', key: 'reglement', width: 15 },
    // { header: 'Tenue', key: 'tenue', width: 12 },
    { header: 'Carrosserie', key: 'carosserie', width: 15 },
    { header: 'Observation Car', key: 'observationCar', width: 30 },
    
    // Billetique
    { header: 'Billetique Électronique', key: 'billetiqueElectronique', width: 22 },
    { header: 'Billetique Manuelle', key: 'billetiqueManuelle', width: 20 },
    { header: 'Fond de Caisse', key: 'fondDeCaisse', width: 18 },
    
    // Conditions de transport
    { header: 'Tableau de Bord', key: 'tableauBord', width: 17 },
    { header: 'Sol', key: 'sol', width: 10 },
    { header: 'Vitres', key: 'vitres', width: 12 },
    { header: 'Sièges', key: 'sieges', width: 12 },
    // { header: 'Température', key: 'temperature', width: 15 },
    // { header: 'Luminosité', key: 'luminosite', width: 15 },
    { header: 'Observation Conditions Véhicule', key: 'observationConditionsVehicule', width: 35 },
    
    // Voyageurs
    { header: 'Nombre Voyageurs', key: 'nbreVoyageur', width: 18 },
    { header: 'Nombre Voyageurs Irréguliers', key: 'nbreVoyageurIrregulier', width: 28 },
    
    // Contrôleur
    { header: 'Nom Contrôleur', key: 'nomControleur', width: 20 },
    // { header: 'Prénom Contrôleur', key: 'prenomControleur', width: 20 },
  ];

  // Générer un ID unique pour ce formulaire
  const formId = uuidv4();

  // Ajouter une nouvelle ligne avec toutes les données du formulaire
  sheet.addRow({
    id: formId,
    date: form.date ? new Date(form.date).toLocaleDateString('fr-FR') : '',
    heurePrevue: form.heurePrevue,
    heureReelle: form.heureReelle,
    lieuControle: form.lieuControle,
    
    // Chauffeur
    nom: form.nom,
    // prenom: form.prenom,
    // email: form.email,
    
    
    // Arrêt de bus
    ficheHoraire: form.ficheHoraire,
    cadreAffichage: form.cadreAffichage,
    etatGeneral: form.etatGeneral,
    typeArret: form.typeArret,
    zebra: form.zebra,
    observationArret: form.observationArret,
    
    // // Ligne de bus
    // numeroLigne: form.numeroLigne,
    
    // Client
    client: form.client,
    ligneCasas: form.ligneCasas,
    ligneRge: form.ligneRge,
    ligneCasc: form.ligneCasc,
    numLigneCascLr: form.numLigneCascLr,
    numLigneCascSA: form.numLigneCascSA,
    numLigneCascSc: form.numLigneCascSc,
    numLigneRgeLr: form.numLigneRgeLr,
    numLigneRgeSa: form.numLigneRgeSa,
    numLigneRgeSc: form.numLigneRgeSc,
    numLigneTransavold: form.numLigneTransavold,
    numLigneTranschool: form.numLigneTranschool,
    
    // Météo
    meteo: form.meteo,
    
    // Car et trajet
    parc: form.parc,
    // respectItineraire: form.respectItineraire,
    affichageDestination: form.affichageDestination,
    affichageNumeroLigne: form.affichageNumeroLigne,
    pictoEnfant: form.pictoEnfant,
    tarifAffiche: form.tarifAffiche,
    depliantHoraire: form.depliantHoraire,
    reglement: form.reglement,
    // tenue: form.tenue,
    carosserie: form.carosserie,
    observationCar: form.observationCar,
    
    // Billetique
    billetiqueElectronique: form.billetiqueElectronique,
    billetiqueManuelle: form.billetiqueManuelle,
    fondDeCaisse: form.fondDeCaisse,
    
    // Conditions de transport
    tableauBord: form.tableauBord,
    sol: form.sol,
    vitres: form.vitres,
    sieges: form.sieges,
    // temperature: form.temperature,
    // luminosite: form.luminosite,
    observationConditionsVehicule: form.observationConditionsVehicule,
    
    // Voyageurs
    nbreVoyageur: form.nbreVoyageur,
    nbreVoyageurIrregulier: form.nbreVoyageurIrregulier,
    
    // Contrôleur
    nomControleur: controleur.nom,
    // prenomControleur: controleur.prenom,
  });

  // Sauvegarder le fichier
  await workbook.xlsx.writeFile(EXCEL_FILE);

  return EXCEL_FILE;
}

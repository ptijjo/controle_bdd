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

  // Crée le dossier s’il n’existe pas
  if (!fs.existsSync(controleDir)) {
    fs.mkdirSync(controleDir, { recursive: true });
  }

  //On vérifie si le fichier existe
  if (fs.existsSync(EXCEL_FILE)) {
    //charrger le fichier existant
    console.log('📂 Sauvegarde dans :', EXCEL_FILE);
    await workbook.xlsx.readFile(EXCEL_FILE);
    // Vérifier si la feuille "Controles" existe
    sheet = workbook.getWorksheet('Controles') || workbook.addWorksheet('Controles');
  } else {
    // Si le fichier n'existe pas, on crée le workbook et la feuille
    sheet = workbook.addWorksheet('Controles');
  }
  // Assurer que les colonnes sont toujours définies

  sheet.columns = [
    { header: 'ID', key: 'id', width: 36 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'N° Ligne', key: 'numeroLigne', width: 15 },
    { header: 'Type de Ligne', key: 'typeLigne', width: 20 },
    { header: 'Nom', key: 'nom', width: 20 },
    { header: 'Prénom', key: 'prenom', width: 20 },
    { header: 'Prénom Controleur', key: 'prenomControleur', width: 20 },
    { header: 'Nom Controleur', key: 'nomControleur', width: 20 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Observation', key: 'observation', width: 40 },
    { header: 'Signature Chauffeur', key: 'signatureChauffeur', width: 20 },
    { header: 'Signature Contrôleur', key: 'signatureControleur', width: 20 },
  ];

  console.log('➡️ Nombre de lignes AVANT ajout:', sheet.rowCount);

  // Générer un ID unique pour ce formulaire
  const formId = uuidv4();

  // Ajouter une nouvelle ligne
  sheet.addRow({
    id: formId,
    date: form.date?.toISOString(),
    numeroLigne: form.numeroLigne,
    typeLigne: form.typeLigne,
    // nom: form.nom,
    // prenom: form.prenom,
    email: form.email,
    nomControleur: controleur.nom,
    prenomControleur: controleur.prenom,
    // observation: form.observation,
    signatureChauffeur: form.chauffeurSignature ? 'Oui' : 'Non',
    signatureControleur: form.controllerSignature ? 'Oui' : 'Non',
  });

  console.log('✅ Nombre de lignes APRÈS ajout:', sheet.rowCount);

  // Sauvegarder le fichier
  await workbook.xlsx.writeFile(EXCEL_FILE);

  // Relire le fichier pour vérifier
  const checkWb = new ExcelJS.Workbook();
  await checkWb.xlsx.readFile(EXCEL_FILE);
  const checkSheet = checkWb.getWorksheet('Controles');

  console.log('📊 Nombre de lignes DANS LE FICHIER:', checkSheet?.rowCount);

  checkSheet?.eachRow((row, rowNumber) => {
    console.log(`Row ${rowNumber}:`, row.values);
  });
  return EXCEL_FILE;
}

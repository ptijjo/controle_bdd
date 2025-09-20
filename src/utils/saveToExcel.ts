import { CreateFormDto } from '@/dtos/forms.dto';
import path from 'path';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const EXCEL_FILE = path.join(__dirname, 'Controle.xlsx');

export async function saveFormToExcel(controleur: { nom: string; prenom: string }, form: CreateFormDto) {
  const workbook = new ExcelJS.Workbook();
  let sheet: ExcelJS.Worksheet;

  //On vérifie si le fichier existe
  if (fs.existsSync(EXCEL_FILE)) {
    await workbook.xlsx.readFile(EXCEL_FILE);
    // Vérifier si la feuille "Controles" existe
    sheet = workbook.getWorksheet('Controles');
    if (!sheet) {
      // Si la feuille n'existe pas, on la crée
      sheet = workbook.addWorksheet('Controles');
    }
  } else {
    // Si le fichier n'existe pas, on crée le workbook et la feuille
    sheet = workbook.addWorksheet('Controles');
  }

  // Ajouter les colonnes si la feuille est vide
  if (sheet.rowCount === 0) {
    sheet.columns = [
      { header: 'ID', key: 'id', width: 36 }, // UUID
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
  }
  // Générer un ID unique pour ce formulaire
  const formId = uuidv4();

  // Ajouter une nouvelle ligne
  sheet.addRow({
    id: formId,
    date: form.date?.toISOString(),
    numeroLigne: form.numeroLigne,
    typeLigne: form.typeLigne,
    nom: form.nom,
    prenom: form.prenom,
    email: form.email,
    nomControleur: controleur.nom,
    prenomControleur: controleur.prenom,
    observation: form.observation,
    signatureChauffeur: form.chauffeurSignature ? 'Oui' : 'Non',
    signatureControleur: form.controllerSignature ? 'Oui' : 'Non',
  });

  // Écrire dans le fichier
  await workbook.xlsx.writeFile(EXCEL_FILE);

  return EXCEL_FILE;
}

import { CreateFormDto } from '@/dtos/forms.dto';
import path from 'path';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const controleDir = path.resolve(process.cwd(), 'controle');
const EXCEL_FILE = path.join(controleDir, 'controle.xlsx');

/** Couleurs ARGB (Excel) proches du modèle papier */
const COLORS = {
  enregistrement: 'FFF4B183',
  equipement: 'FFFFFF00',
  securite: 'FFFF6B6B',
  infoVoyageurs: 'FFB4A7D6',
  conducteur: 'FF6FA8DC',
  proprete: 'FFD9D9D9',
  confort: 'FF92D050',
  voyageurs: 'FFF8CBAD',
  detailArret: 'FFE2EFDA',
  clientLignes: 'FFDDEBF7',
  meteoCar: 'FFFFF2CC',
  billetique: 'FFDCE6F1',
  complement: 'FFF2F2F2',
  controleur: 'FFCCCCCC',
} as const;

type GroupKey = keyof typeof COLORS;

type ColDef = {
  key: string;
  width: number;
  subheader: string;
  group: GroupKey;
  groupTitle: string;
  verticalSubheader?: boolean;
};

function conformeShort(v: string | undefined | null): string {
  if (v == null || v === '') return '';
  if (v === 'Conforme') return 'C';
  if (v === 'Non conforme') return 'NC';
  return String(v);
}

function propreteShort(v: string | undefined | null): string {
  if (v == null || v === '') return '';
  if (v === 'Propre') return 'C';
  if (v === 'Moyen') return 'M';
  if (v === 'Sale') return 'S';
  return String(v);
}

function buildNumeroLigne(form: CreateFormDto): string {
  const parts = [
    form.numLigneCascLr,
    form.numLigneCascSA,
    form.numLigneCascSc,
    form.numLigneRgeLr,
    form.numLigneRgeSa,
    form.numLigneRgeSc,
    form.numLigneTransavold,
    form.numLigneTranschool,
    form.numLigneHH,
    form.numLigneForbusDoublage,
    form.numLigneForbusCSCAF,
  ].filter(Boolean);
  return parts.join(' / ');
}

function buildTypeLigne(form: CreateFormDto): string {
  const parts = [form.client, form.ligneCasas, form.ligneRge, form.ligneCasc, form.ligneForbus, form.ligneHH].filter(
    Boolean,
  );
  return parts.join(' — ');
}

/** Ordre des colonnes : blocs type modèle + colonnes détaill du formulaire actuel */
const COLUMN_DEFS: ColDef[] = [
  { key: 'date', width: 11, subheader: 'Date', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'numeroLigne', width: 14, subheader: 'N° Ligne', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'typeLigne', width: 18, subheader: 'Type de ligne', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'lieuControle', width: 22, subheader: 'Lieu du contrôle', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'heurePrevue', width: 12, subheader: 'Heure prévue', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'heureReelle', width: 12, subheader: 'Heure réelle', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'nomConducteur', width: 20, subheader: 'Nom conducteur', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  { key: 'parc', width: 10, subheader: 'N° Parc', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  /** Car non passé : Oui / vide — une seule colonne pour ne pas décaler les classeurs existants */
  { key: 'petitPassage', width: 16, subheader: 'Car non passé', group: 'enregistrement', groupTitle: 'ENVIRONNEMENT DU CONTRÔLE' },
  {
    key: 'ficheHoraire',
    width: 8,
    subheader: "Fiche horaire à l'arrêt",
    group: 'equipement',
    groupTitle: 'EQUIPEMENT',
    verticalSubheader: true,
  },
  { key: 'respectArret', width: 11, subheader: "Respect d'arrêt", group: 'securite', groupTitle: 'SÉCURITÉ' },
  { key: 'affichageDestination', width: 14, subheader: 'Information destination', group: 'securite', groupTitle: 'SÉCURITÉ' },
  { key: 'affichageNumeroLigne', width: 14, subheader: 'Information N° Ligne', group: 'securite', groupTitle: 'SÉCURITÉ' },
  { key: 'pictoEnfant', width: 12, subheader: 'Frein de secours sollicité', group: 'securite', groupTitle: 'SÉCURITÉ' },
  { key: 'tarifAffiche', width: 14, subheader: 'Tarifs disponibles / affichés', group: 'infoVoyageurs', groupTitle: 'INFORMATION VOYAGEURS' },
  { key: 'depliantHoraire', width: 12, subheader: 'Dépliants horaires disponibles', group: 'infoVoyageurs', groupTitle: 'INFORMATION VOYAGEURS' },
  { key: 'reglement', width: 12, subheader: 'Règlement', group: 'infoVoyageurs', groupTitle: 'INFORMATION VOYAGEURS' },
  { key: 'tenue', width: 10, subheader: 'Tenue', group: 'conducteur', groupTitle: 'CONDUCTEUR' },
  { key: 'carosserie', width: 12, subheader: 'Carrosserie', group: 'proprete', groupTitle: 'PROPRETÉ' },
  { key: 'tableauBord', width: 14, subheader: 'Tableau de bord', group: 'proprete', groupTitle: 'PROPRETÉ' },
  { key: 'sol', width: 10, subheader: 'Sol', group: 'proprete', groupTitle: 'PROPRETÉ' },
  { key: 'volumeSonore', width: 12, subheader: 'Volume sonore', group: 'confort', groupTitle: 'CONFORT' },
  { key: 'temperature', width: 12, subheader: 'Température', group: 'confort', groupTitle: 'CONFORT' },
  { key: 'luminosite', width: 12, subheader: 'Luminosité', group: 'confort', groupTitle: 'CONFORT' },
  { key: 'nbreVoyageur', width: 12, subheader: 'Nb voyageurs', group: 'voyageurs', groupTitle: 'VOYAGEURS' },
  { key: 'nbreVoyageurIrregulier', width: 18, subheader: 'Nb voyageurs en situation irrégulière', group: 'voyageurs', groupTitle: 'VOYAGEURS' },
  { key: 'cadreAffichage', width: 14, subheader: 'Cadre affichage', group: 'detailArret', groupTitle: 'DÉTAIL ARRÊT' },
  { key: 'etatGeneral', width: 12, subheader: 'État général', group: 'detailArret', groupTitle: 'DÉTAIL ARRÊT' },
  { key: 'typeArret', width: 16, subheader: "Type d'arrêt", group: 'detailArret', groupTitle: 'DÉTAIL ARRÊT' },
  { key: 'observationArret', width: 28, subheader: 'Observation arrêt', group: 'detailArret', groupTitle: 'DÉTAIL ARRÊT' },
  { key: 'client', width: 14, subheader: 'Client', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'ligneCasas', width: 12, subheader: 'Ligne Casas', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'ligneRge', width: 10, subheader: 'Ligne RGE', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'ligneCasc', width: 12, subheader: 'Ligne CASC', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'ligneForbus', width: 14, subheader: 'Ligne Forbus', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'ligneHH', width: 10, subheader: 'Ligne HH', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'numLigneHH', width: 12, subheader: 'N° HH', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'numLigneForbusDoublage', width: 16, subheader: 'N° Forbus Doublage', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'numLigneForbusCSCAF', width: 16, subheader: 'N° Forbus CSCAF', group: 'clientLignes', groupTitle: 'CLIENT / LIGNES' },
  { key: 'meteo', width: 10, subheader: 'Météo', group: 'meteoCar', groupTitle: 'MÉTÉO & CAR' },
  { key: 'observationCar', width: 28, subheader: 'Observation car', group: 'meteoCar', groupTitle: 'MÉTÉO & CAR' },
  { key: 'billetiqueElectronique', width: 16, subheader: 'Billetique électronique', group: 'billetique', groupTitle: 'BILLETIQUE' },
  { key: 'billetiqueManuelle', width: 14, subheader: 'Billetique manuelle', group: 'billetique', groupTitle: 'BILLETIQUE' },
  { key: 'fondDeCaisse', width: 14, subheader: 'Fond de caisse', group: 'billetique', groupTitle: 'BILLETIQUE' },
  { key: 'observationBilletique', width: 28, subheader: 'Observation billetique', group: 'billetique', groupTitle: 'BILLETIQUE' },
  { key: 'vitres', width: 10, subheader: 'Vitres', group: 'complement', groupTitle: 'AUTRES (VÉHICULE)' },
  { key: 'sieges', width: 10, subheader: 'Sièges', group: 'complement', groupTitle: 'AUTRES (VÉHICULE)' },
  { key: 'observationConditionsVehicule', width: 32, subheader: 'Obs. conditions véhicule', group: 'complement', groupTitle: 'AUTRES (VÉHICULE)' },
  { key: 'nomControleur', width: 20, subheader: 'Nom contrôleur', group: 'controleur', groupTitle: 'CONTRÔLEUR' },
];

/** Ancien et nouveau libellé du 1er groupe fusionné (ligne 1) */
const HEADER_MARKERS = ['ENVIRONNEMENT DU CONTRÔLE', 'ENREGISTREMENT DU CONTRÔLE'] as const;

function colLetter(n: number): string {
  let s = '';
  let c = n;
  while (c > 0) {
    const r = (c - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    c = Math.floor((c - 1) / 26);
  }
  return s;
}

function applyBorder(cell: ExcelJS.Cell) {
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
}

function styleHeaderCell(cell: ExcelJS.Cell, fillArgb: string, opts?: { vertical?: boolean; bold?: boolean }) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillArgb } };
  cell.font = { bold: opts?.bold !== false ? true : false, size: opts?.vertical ? 9 : 10 };
  cell.alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
    textRotation: opts?.vertical ? 90 : 0,
  };
  applyBorder(cell);
}

function hasStyledHeader(sheet: ExcelJS.Worksheet): boolean {
  const a1 = sheet.getCell(1, 1).value;
  if (typeof a1 !== 'string') return false;
  return HEADER_MARKERS.some(m => a1.includes(m));
}

/** Supprime les lignes entièrement vides en tête (ex. ligne 1 vide, données en ligne 2). */
function trimLeadingBlankRows(sheet: ExcelJS.Worksheet, maxStrip: number) {
  const nCols = COLUMN_DEFS.length;
  for (let s = 0; s < maxStrip && sheet.rowCount >= 1; s++) {
    const row = sheet.getRow(1);
    let hasValue = false;
    for (let c = 1; c <= nCols; c++) {
      const v = row.getCell(c).value;
      if (v !== null && v !== undefined && String(v).trim() !== '') {
        hasValue = true;
        break;
      }
    }
    if (!hasValue) {
      sheet.spliceRows(1, 1);
    } else {
      break;
    }
  }
}

/** Fichier « plat » sans en-têtes colorés : insère 2 lignes en tête et les remplit. */
function ensureStyledHeaderRows(sheet: ExcelJS.Worksheet) {
  if (hasStyledHeader(sheet)) return;
  trimLeadingBlankRows(sheet, 5);
  if (sheet.rowCount === 0) {
    writeTwoRowHeaders(sheet);
    return;
  }
  sheet.spliceRows(1, 0, [], []);
  writeTwoRowHeaders(sheet);
}

function ensureColumnWidths(sheet: ExcelJS.Worksheet) {
  COLUMN_DEFS.forEach((def, i) => {
    sheet.getColumn(i + 1).width = def.width;
  });
}

function buildGroupMerges(): { start: number; end: number; title: string; color: string }[] {
  const merges: { start: number; end: number; title: string; color: string }[] = [];
  let i = 0;
  while (i < COLUMN_DEFS.length) {
    const g = COLUMN_DEFS[i].groupTitle;
    const color = COLORS[COLUMN_DEFS[i].group];
    let j = i;
    while (j < COLUMN_DEFS.length && COLUMN_DEFS[j].groupTitle === g) j++;
    merges.push({ start: i + 1, end: j, title: g, color });
    i = j;
  }
  return merges;
}

function writeTwoRowHeaders(sheet: ExcelJS.Worksheet) {
  const merges = buildGroupMerges();
  for (const m of merges) {
    const from = colLetter(m.start);
    const to = colLetter(m.end);
    if (m.start !== m.end) {
      sheet.mergeCells(`${from}1:${to}1`);
    }
    const c = sheet.getCell(1, m.start);
    c.value = m.title;
    styleHeaderCell(c, m.color, { bold: true });
    for (let col = m.start; col <= m.end; col++) {
      if (col !== m.start) {
        const cell = sheet.getCell(1, col);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: m.color } };
        applyBorder(cell);
      }
    }
  }

  COLUMN_DEFS.forEach((def, idx) => {
    const col = idx + 1;
    const cell = sheet.getCell(2, col);
    cell.value = def.subheader;
    styleHeaderCell(cell, COLORS[def.group], { vertical: def.verticalSubheader, bold: false });
  });

  sheet.getRow(1).height = 28;
  sheet.getRow(2).height = 56;
}

function buildRowValues(
  form: CreateFormDto,
  controleur: { nom: string; prenom: string },
  formId: string,
): Record<string, string | number> {
  return {
    id: formId,
    date: form.date ? new Date(form.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '',
    numeroLigne: buildNumeroLigne(form),
    typeLigne: buildTypeLigne(form),
    lieuControle: form.lieuControle,
    heurePrevue: form.heurePrevue,
    heureReelle:
      form.carNonPasse && (!form.heureReelle || form.heureReelle.trim() === '') ? '—' : form.heureReelle,
    nomConducteur: form.carNonPasse
      ? 'Non applicable — car non passé (sans conducteur)'
      : String(form.nom ?? '').trim(),
    parc: form.parc,
    petitPassage: form.carNonPasse ? 'Oui' : '',
    ficheHoraire: conformeShort(form.ficheHoraire),
    respectArret: conformeShort(form.zebra),
    affichageDestination: conformeShort(form.affichageDestination),
    affichageNumeroLigne: conformeShort(form.affichageNumeroLigne),
    pictoEnfant: conformeShort(form.pictoEnfant),
    tarifAffiche: conformeShort(form.tarifAffiche),
    depliantHoraire: conformeShort(form.depliantHoraire),
    reglement: conformeShort(form.reglement),
    tenue: '',
    carosserie: propreteShort(form.carosserie),
    tableauBord: propreteShort(form.tableauBord),
    sol: propreteShort(form.sol),
    volumeSonore: '',
    temperature: '',
    luminosite: '',
    nbreVoyageur: form.nbreVoyageur,
    nbreVoyageurIrregulier: form.nbreVoyageurIrregulier,
    cadreAffichage: conformeShort(form.cadreAffichage),
    etatGeneral: conformeShort(form.etatGeneral),
    typeArret: form.typeArret,
    observationArret: form.observationArret ?? '',
    client: form.client,
    ligneCasas: form.ligneCasas ?? '',
    ligneRge: form.ligneRge ?? '',
    ligneCasc: form.ligneCasc ?? '',
    ligneForbus: form.ligneForbus ?? '',
    ligneHH: form.ligneHH ?? '',
    numLigneHH: form.numLigneHH ?? '',
    numLigneForbusDoublage: form.numLigneForbusDoublage ?? '',
    numLigneForbusCSCAF: form.numLigneForbusCSCAF ?? '',
    meteo: form.meteo,
    observationCar: form.observationCar,
    billetiqueElectronique: conformeShort(form.billetiqueElectronique),
    billetiqueManuelle: conformeShort(form.billetiqueManuelle),
    fondDeCaisse: conformeShort(form.fondDeCaisse),
    observationBilletique: form.observationBilletique,
    vitres: propreteShort(form.vitres),
    sieges: propreteShort(form.sieges),
    observationConditionsVehicule: form.observationConditionsVehicule ?? '',
    nomControleur: controleur.nom,
  };
}

function appendDataRow(sheet: ExcelJS.Worksheet, values: Record<string, string | number>, explicitRow?: number) {
  const rowIndex = explicitRow ?? sheet.rowCount + 1;
  const row = sheet.getRow(rowIndex);
  COLUMN_DEFS.forEach((def, i) => {
    const cell = row.getCell(i + 1);
    const v = values[def.key];
    cell.value = v === '' || v == null ? '' : v;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    applyBorder(cell);
  });
}

export async function saveFormToExcel(controleur: { nom: string; prenom: string }, form: CreateFormDto) {
  const workbook = new ExcelJS.Workbook();
  let sheet: ExcelJS.Worksheet;

  if (!fs.existsSync(controleDir)) {
    fs.mkdirSync(controleDir, { recursive: true });
  }

  if (fs.existsSync(EXCEL_FILE)) {
    await workbook.xlsx.readFile(EXCEL_FILE);
    sheet = workbook.getWorksheet('Controles') || workbook.addWorksheet('Controles');
  } else {
    sheet = workbook.addWorksheet('Controles');
  }

  const formId = uuidv4();
  const rowValues = buildRowValues(form, controleur, formId);

  if (!hasStyledHeader(sheet)) {
    ensureStyledHeaderRows(sheet);
  }
  ensureColumnWidths(sheet);
  appendDataRow(sheet, rowValues);

  await workbook.xlsx.writeFile(EXCEL_FILE);

  return EXCEL_FILE;
}

import ExcelJS from 'exceljs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { CreateFormDto } from '../formulaire/dto/create-form.dto';

const controleDir = path.resolve(process.cwd(), 'controle');
const EXCEL_FILE = path.join(controleDir, 'controle.xlsx');

const SHEET_CONTROLES = 'Controles';
const SHEET_HORAIRE = 'Horaire';

/** Feuilles supprimées du classeur si elles existent encore (anciennes versions). */
const LEGACY_SHEETS_TO_REMOVE = ['Synthèse retards', 'Aide TCD'] as const;

/** Première ligne de données sur « Controles » (lignes 1–2 = en-têtes fusionnés). */
const DATA_START_ROW_CONTROLES = 3;

/** Colonnes feuille Horaire (TCD / filtres Excel sur Client, N° ligne, etc.) */
const HORAIRE_HEADERS = [
  'Date',
  'Client',
  'N° ligne',
  'Type ligne',
  'Lieu',
  'Heure prévue',
  'Heure réelle',
  'Écart (min)',
  'Car non passé',
  'Contrôleur',
] as const;

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
  const parts = [
    form.client,
    form.ligneCasas,
    form.ligneRge,
    form.ligneCasc,
    form.ligneForbus,
    form.ligneHH,
  ].filter(Boolean);
  return parts.join(' — ');
}

/** Minutes depuis minuit pour une chaîne `HH:mm` ou `H:mm`. */
function parseHHmmToMinutes(s: string): number | null {
  const t = s.trim();
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (
    !Number.isFinite(h) ||
    !Number.isFinite(min) ||
    min > 59 ||
    h > 23 ||
    h < 0
  ) {
    return null;
  }
  return h * 60 + min;
}

/**
 * Écart en minutes : heure prévue − heure réelle.
 * Retard (bus plus tard que prévu) → valeur négative (ex. −5 pour 5 min de retard).
 * Avance → positive. Si car non passé ou heure réelle absente → pas de calcul.
 */
function computeEcartFromTimes(
  heurePrevue: string,
  heureReelleBrute: string,
  carNonPasse: boolean,
): number | '' {
  if (carNonPasse) return '';
  const reel = heureReelleBrute.trim();
  if (!reel || reel === '—') return '';
  const p = parseHHmmToMinutes(heurePrevue);
  const r = parseHHmmToMinutes(reel);
  if (p === null || r === null) return '';
  return p - r;
}

type HoraireRowInput = {
  dateStr: string;
  client: string;
  numeroLigne: string;
  typeLigne: string;
  lieu: string;
  heurePrevue: string;
  /** Valeur brute (ex. « — ») pour le calcul d’écart. */
  heureReelleRaw: string;
  carNonPasse: boolean;
  controleurNom: string;
};

function heureReelleAffichee(raw: string, carNonPasse: boolean): string {
  const t = raw.trim();
  if (carNonPasse && (!t || t === '—')) return '';
  return t;
}

function writeHoraireDataRow(
  sheet: ExcelJS.Worksheet,
  rowIndex: number,
  input: HoraireRowInput,
) {
  const heureReelleAff = heureReelleAffichee(
    input.heureReelleRaw,
    input.carNonPasse,
  );
  const ecart = computeEcartFromTimes(
    input.heurePrevue,
    input.heureReelleRaw,
    input.carNonPasse,
  );
  const cells: (string | number)[] = [
    input.dateStr,
    input.client,
    input.numeroLigne,
    input.typeLigne,
    input.lieu,
    input.heurePrevue,
    heureReelleAff,
    ecart === '' ? '' : ecart,
    input.carNonPasse ? 'Oui' : 'Non',
    input.controleurNom,
  ];
  const row = sheet.getRow(rowIndex);
  cells.forEach((v, i) => {
    const cell = row.getCell(i + 1);
    if (v === '' || v === null || v === undefined) {
      cell.value = '';
    } else if (typeof v === 'number') {
      cell.value = v;
    } else {
      cell.value = v;
    }
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    applyBorder(cell);
  });
}

function writeHoraireHeaders(sheet: ExcelJS.Worksheet) {
  const row = sheet.getRow(1);
  HORAIRE_HEADERS.forEach((title, i) => {
    const cell = row.getCell(i + 1);
    cell.value = title;
    cell.font = { bold: true, size: 10 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE7E6E6' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    applyBorder(cell);
  });
  row.height = 22;
}

function horaireHeaderPresent(sheet: ExcelJS.Worksheet): boolean {
  const v = sheet.getRow(1).getCell(1).value;
  return typeof v === 'string' && v === HORAIRE_HEADERS[0];
}

function ensureHoraireSheet(workbook: ExcelJS.Workbook): ExcelJS.Worksheet {
  let sheet = workbook.getWorksheet(SHEET_HORAIRE);
  if (!sheet) {
    sheet = workbook.addWorksheet(SHEET_HORAIRE);
  }
  if (!horaireHeaderPresent(sheet)) {
    const a1 = sheet.getRow(1).getCell(1).value;
    if (typeof a1 === 'string' && a1 === 'ID') {
      sheet.spliceColumns(1, 1);
    }
    if (!horaireHeaderPresent(sheet)) {
      writeHoraireHeaders(sheet);
    }
  }
  return sheet;
}

const HORAIRE_COL_WIDTHS = [12, 14, 16, 28, 22, 12, 12, 12, 14, 18];

function ensureHoraireColumnWidths(sheet: ExcelJS.Worksheet) {
  HORAIRE_COL_WIDTHS.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });
}

/** Ordre des colonnes : blocs type modèle + colonnes détaill du formulaire actuel */
const COLUMN_DEFS: ColDef[] = [
  {
    key: 'date',
    width: 11,
    subheader: 'Date',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'numeroLigne',
    width: 14,
    subheader: 'N° Ligne',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'typeLigne',
    width: 18,
    subheader: 'Type de ligne',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'lieuControle',
    width: 22,
    subheader: 'Lieu du contrôle',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'heurePrevue',
    width: 12,
    subheader: 'Heure prévue',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'heureReelle',
    width: 12,
    subheader: 'Heure réelle',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'nomConducteur',
    width: 20,
    subheader: 'Nom conducteur',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'parc',
    width: 10,
    subheader: 'N° Parc',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  /** Car non passé : Oui / vide — une seule colonne pour ne pas décaler les classeurs existants */
  {
    key: 'petitPassage',
    width: 16,
    subheader: 'Car non passé',
    group: 'enregistrement',
    groupTitle: 'ENVIRONNEMENT DU CONTRÔLE',
  },
  {
    key: 'ficheHoraire',
    width: 8,
    subheader: "Fiche horaire à l'arrêt",
    group: 'equipement',
    groupTitle: 'EQUIPEMENT',
    verticalSubheader: true,
  },
  {
    key: 'respectArret',
    width: 11,
    subheader: "Respect d'arrêt",
    group: 'securite',
    groupTitle: 'SÉCURITÉ',
  },
  {
    key: 'affichageDestination',
    width: 14,
    subheader: 'Information destination',
    group: 'securite',
    groupTitle: 'SÉCURITÉ',
  },
  {
    key: 'affichageNumeroLigne',
    width: 14,
    subheader: 'Information N° Ligne',
    group: 'securite',
    groupTitle: 'SÉCURITÉ',
  },
  {
    key: 'pictoEnfant',
    width: 12,
    subheader: 'Frein de secours sollicité',
    group: 'securite',
    groupTitle: 'SÉCURITÉ',
  },
  {
    key: 'tarifAffiche',
    width: 14,
    subheader: 'Tarifs disponibles / affichés',
    group: 'infoVoyageurs',
    groupTitle: 'INFORMATION VOYAGEURS',
  },
  {
    key: 'depliantHoraire',
    width: 12,
    subheader: 'Dépliants horaires disponibles',
    group: 'infoVoyageurs',
    groupTitle: 'INFORMATION VOYAGEURS',
  },
  {
    key: 'reglement',
    width: 12,
    subheader: 'Règlement',
    group: 'infoVoyageurs',
    groupTitle: 'INFORMATION VOYAGEURS',
  },
  {
    key: 'tenue',
    width: 10,
    subheader: 'Tenue',
    group: 'conducteur',
    groupTitle: 'CONDUCTEUR',
  },
  {
    key: 'carosserie',
    width: 12,
    subheader: 'Carrosserie',
    group: 'proprete',
    groupTitle: 'PROPRETÉ',
  },
  {
    key: 'tableauBord',
    width: 14,
    subheader: 'Tableau de bord',
    group: 'proprete',
    groupTitle: 'PROPRETÉ',
  },
  {
    key: 'sol',
    width: 10,
    subheader: 'Sol',
    group: 'proprete',
    groupTitle: 'PROPRETÉ',
  },
  {
    key: 'volumeSonore',
    width: 12,
    subheader: 'Volume sonore',
    group: 'confort',
    groupTitle: 'CONFORT',
  },
  {
    key: 'temperature',
    width: 12,
    subheader: 'Température',
    group: 'confort',
    groupTitle: 'CONFORT',
  },
  {
    key: 'luminosite',
    width: 12,
    subheader: 'Luminosité',
    group: 'confort',
    groupTitle: 'CONFORT',
  },
  {
    key: 'nbreVoyageur',
    width: 12,
    subheader: 'Nb voyageurs',
    group: 'voyageurs',
    groupTitle: 'VOYAGEURS',
  },
  {
    key: 'nbreVoyageurIrregulier',
    width: 18,
    subheader: 'Nb voyageurs en situation irrégulière',
    group: 'voyageurs',
    groupTitle: 'VOYAGEURS',
  },
  {
    key: 'cadreAffichage',
    width: 14,
    subheader: 'Cadre affichage',
    group: 'detailArret',
    groupTitle: 'DÉTAIL ARRÊT',
  },
  {
    key: 'etatGeneral',
    width: 12,
    subheader: 'État général',
    group: 'detailArret',
    groupTitle: 'DÉTAIL ARRÊT',
  },
  {
    key: 'typeArret',
    width: 16,
    subheader: "Type d'arrêt",
    group: 'detailArret',
    groupTitle: 'DÉTAIL ARRÊT',
  },
  {
    key: 'observationArret',
    width: 28,
    subheader: 'Observation arrêt',
    group: 'detailArret',
    groupTitle: 'DÉTAIL ARRÊT',
  },
  {
    key: 'client',
    width: 14,
    subheader: 'Client',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'ligneCasas',
    width: 12,
    subheader: 'Ligne Casas',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'ligneRge',
    width: 10,
    subheader: 'Ligne RGE',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'ligneCasc',
    width: 12,
    subheader: 'Ligne CASC',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'ligneForbus',
    width: 14,
    subheader: 'Ligne Forbus',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'ligneHH',
    width: 10,
    subheader: 'Ligne HH',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'numLigneHH',
    width: 12,
    subheader: 'N° HH',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'numLigneForbusDoublage',
    width: 16,
    subheader: 'N° Forbus Doublage',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'numLigneForbusCSCAF',
    width: 16,
    subheader: 'N° Forbus CSCAF',
    group: 'clientLignes',
    groupTitle: 'CLIENT / LIGNES',
  },
  {
    key: 'meteo',
    width: 10,
    subheader: 'Météo',
    group: 'meteoCar',
    groupTitle: 'MÉTÉO & CAR',
  },
  {
    key: 'observationCar',
    width: 28,
    subheader: 'Observation car',
    group: 'meteoCar',
    groupTitle: 'MÉTÉO & CAR',
  },
  {
    key: 'billetiqueElectronique',
    width: 16,
    subheader: 'Billetique électronique',
    group: 'billetique',
    groupTitle: 'BILLETIQUE',
  },
  {
    key: 'billetiqueManuelle',
    width: 14,
    subheader: 'Billetique manuelle',
    group: 'billetique',
    groupTitle: 'BILLETIQUE',
  },
  {
    key: 'fondDeCaisse',
    width: 14,
    subheader: 'Fond de caisse',
    group: 'billetique',
    groupTitle: 'BILLETIQUE',
  },
  {
    key: 'observationBilletique',
    width: 28,
    subheader: 'Observation billetique',
    group: 'billetique',
    groupTitle: 'BILLETIQUE',
  },
  {
    key: 'vitres',
    width: 10,
    subheader: 'Vitres',
    group: 'complement',
    groupTitle: 'AUTRES (VÉHICULE)',
  },
  {
    key: 'sieges',
    width: 10,
    subheader: 'Sièges',
    group: 'complement',
    groupTitle: 'AUTRES (VÉHICULE)',
  },
  {
    key: 'observationConditionsVehicule',
    width: 32,
    subheader: 'Obs. conditions véhicule',
    group: 'complement',
    groupTitle: 'AUTRES (VÉHICULE)',
  },
  {
    key: 'nomControleur',
    width: 20,
    subheader: 'Nom contrôleur',
    group: 'controleur',
    groupTitle: 'CONTRÔLEUR',
  },
];

const COL_INDEX_BY_KEY: Record<string, number> = Object.fromEntries(
  COLUMN_DEFS.map((def, i) => [def.key, i + 1]),
);

function cellToTrimmedString(cell: ExcelJS.Cell): string {
  const v = cell.value;
  if (v == null || v === '') return '';
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number') return Number.isFinite(v) ? String(v).trim() : '';
  if (typeof v === 'boolean') return v ? 'VRAI' : 'FAUX';
  if (v instanceof Date) {
    return v.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }
  if (typeof v === 'object' && v !== null) {
    if ('richText' in v && Array.isArray(v.richText)) {
      return v.richText
        .map((x) => x.text)
        .join('')
        .trim();
    }
    if ('formula' in v) {
      const res = (v as { result?: ExcelJS.CellValue }).result;
      if (typeof res === 'string') return res.trim();
      if (typeof res === 'number') return String(res);
    }
    if ('text' in v && typeof (v as { text: string }).text === 'string') {
      return (v as { text: string }).text.trim();
    }
  }
  return '';
}

function clearDataRowsFrom(sheet: ExcelJS.Worksheet, fromRow: number) {
  const last = sheet.lastRow?.number ?? 0;
  if (last >= fromRow) {
    sheet.spliceRows(fromRow, last - fromRow + 1);
  }
}

function readControlesRowAsHoraireInput(
  row: ExcelJS.Row,
): HoraireRowInput | null {
  const date = cellToTrimmedString(row.getCell(COL_INDEX_BY_KEY.date));
  const numeroLigne = cellToTrimmedString(
    row.getCell(COL_INDEX_BY_KEY.numeroLigne),
  );
  if (!date && !numeroLigne) return null;

  const petit = cellToTrimmedString(row.getCell(COL_INDEX_BY_KEY.petitPassage));
  const carNonPasse = petit === 'Oui';

  return {
    dateStr: date,
    client: cellToTrimmedString(row.getCell(COL_INDEX_BY_KEY.client)),
    numeroLigne,
    typeLigne: cellToTrimmedString(row.getCell(COL_INDEX_BY_KEY.typeLigne)),
    lieu: cellToTrimmedString(row.getCell(COL_INDEX_BY_KEY.lieuControle)),
    heurePrevue: cellToTrimmedString(row.getCell(COL_INDEX_BY_KEY.heurePrevue)),
    heureReelleRaw: cellToTrimmedString(
      row.getCell(COL_INDEX_BY_KEY.heureReelle),
    ),
    carNonPasse,
    controleurNom: cellToTrimmedString(
      row.getCell(COL_INDEX_BY_KEY.nomControleur),
    ),
  };
}

function rebuildHoraireFromControles(
  controlesSheet: ExcelJS.Worksheet,
  horaireSheet: ExcelJS.Worksheet,
) {
  clearDataRowsFrom(horaireSheet, 2);
  const last = controlesSheet.lastRow?.number ?? DATA_START_ROW_CONTROLES - 1;
  let outRow = 2;
  for (let r = DATA_START_ROW_CONTROLES; r <= last; r++) {
    const input = readControlesRowAsHoraireInput(controlesSheet.getRow(r));
    if (!input) continue;
    writeHoraireDataRow(horaireSheet, outRow, input);
    outRow++;
  }
  horaireSheet.views = [{ state: 'frozen', ySplit: 1 }];
}

/** Ancien et nouveau libellé du 1er groupe fusionné (ligne 1) */
const HEADER_MARKERS = [
  'ENVIRONNEMENT DU CONTRÔLE',
  'ENREGISTREMENT DU CONTRÔLE',
] as const;

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

function styleHeaderCell(
  cell: ExcelJS.Cell,
  fillArgb: string,
  opts?: { vertical?: boolean; bold?: boolean },
) {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: fillArgb },
  };
  cell.font = {
    bold: opts?.bold !== false ? true : false,
    size: opts?.vertical ? 9 : 10,
  };
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
  return HEADER_MARKERS.some((m) => a1.includes(m));
}

/** Supprime les lignes entièrement vides en tête (ex. ligne 1 vide, données en ligne 2). */
function trimLeadingBlankRows(sheet: ExcelJS.Worksheet, maxStrip: number) {
  const nCols = COLUMN_DEFS.length;
  for (let s = 0; s < maxStrip && sheet.rowCount >= 1; s++) {
    const row = sheet.getRow(1);
    let hasValue = false;
    for (let c = 1; c <= nCols; c++) {
      const v = row.getCell(c).value;
      const s =
        v === null || v === undefined
          ? ''
          : typeof v === 'string'
            ? v
            : typeof v === 'number' || typeof v === 'boolean'
              ? String(v)
              : '';
      if (s.trim() !== '') {
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

function buildGroupMerges(): {
  start: number;
  end: number;
  title: string;
  color: string;
}[] {
  const merges: { start: number; end: number; title: string; color: string }[] =
    [];
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
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: m.color },
        };
        applyBorder(cell);
      }
    }
  }

  COLUMN_DEFS.forEach((def, idx) => {
    const col = idx + 1;
    const cell = sheet.getCell(2, col);
    cell.value = def.subheader;
    styleHeaderCell(cell, COLORS[def.group], {
      vertical: def.verticalSubheader,
      bold: false,
    });
  });

  sheet.getRow(1).height = 28;
  sheet.getRow(2).height = 56;
}

function buildRowValues(
  form: CreateFormDto,
  controleur: { nom: string; prenom: string },
): Record<string, string | number> {
  return {
    date: form.date
      ? new Date(form.date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      : '',
    numeroLigne: buildNumeroLigne(form),
    typeLigne: buildTypeLigne(form),
    lieuControle: form.lieuControle,
    heurePrevue: form.heurePrevue,
    heureReelle:
      form.carNonPasse && (!form.heureReelle || form.heureReelle.trim() === '')
        ? '—'
        : (form.heureReelle ?? ''),
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

function appendDataRow(
  sheet: ExcelJS.Worksheet,
  values: Record<string, string | number>,
  explicitRow?: number,
) {
  const rowIndex = explicitRow ?? sheet.rowCount + 1;
  const row = sheet.getRow(rowIndex);
  COLUMN_DEFS.forEach((def, i) => {
    const cell = row.getCell(i + 1);
    const v = values[def.key];
    cell.value = v === '' || v == null ? '' : v;
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    applyBorder(cell);
  });
}

export async function saveFormToExcel(
  controleur: { nom: string; prenom: string },
  form: CreateFormDto,
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  let sheet: ExcelJS.Worksheet;

  if (!fs.existsSync(controleDir)) {
    fs.mkdirSync(controleDir, { recursive: true });
  }

  if (fs.existsSync(EXCEL_FILE)) {
    await workbook.xlsx.readFile(EXCEL_FILE);
    for (const name of LEGACY_SHEETS_TO_REMOVE) {
      const leg = workbook.getWorksheet(name);
      if (leg) workbook.removeWorksheet(leg.id);
    }
    sheet =
      workbook.getWorksheet(SHEET_CONTROLES) ||
      workbook.addWorksheet(SHEET_CONTROLES);
  } else {
    sheet = workbook.addWorksheet(SHEET_CONTROLES);
  }

  const rowValues = buildRowValues(form, controleur);

  if (!hasStyledHeader(sheet)) {
    ensureStyledHeaderRows(sheet);
  }
  ensureColumnWidths(sheet);
  appendDataRow(sheet, rowValues);

  const horaireSheet = ensureHoraireSheet(workbook);
  rebuildHoraireFromControles(sheet, horaireSheet);
  ensureHoraireColumnWidths(horaireSheet);

  await workbook.xlsx.writeFile(EXCEL_FILE);

  const written = path.resolve(EXCEL_FILE);
  const expectedDir = path.normalize(path.resolve(controleDir));
  if (path.normalize(path.dirname(written)) !== expectedDir) {
    throw new Error(
      `Écriture Excel refusée : le fichier doit rester dans le dossier « controle » (${expectedDir}).`,
    );
  }

  return EXCEL_FILE;
}

/** Dossier absolu des extractions (sous la racine du projet : `controle/`). */
export function getControleDir(): string {
  return controleDir;
}

/** Chemin absolu du classeur agrégé des contrôles (créé au premier enregistrement). */
export function getControleExcelFilePath(): string {
  return EXCEL_FILE;
}

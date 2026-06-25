import puppeteer from 'puppeteer';
import type { CreateFormDto } from '../formulaire/dto/create-form.dto';

function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatCellValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

function formatConformeLike(v: unknown): string {
  const s = formatCellValue(v);
  if (s === 'Conforme' || s === 'Non conforme' || s === 'Non observable') {
    return s;
  }
  return s;
}

function formatMeteo(m: string | undefined): string {
  if (m === 'beau') return 'Beau';
  if (m === 'pluvieux') return 'Pluvieux';
  return formatCellValue(m);
}

function signatureDataUrl(raw?: string): string | null {
  const s = raw?.trim();
  if (!s) {
    return null;
  }
  if (s.startsWith('data:')) {
    return s;
  }
  return `data:image/png;base64,${s}`;
}

function row(label: string, value: string): string {
  return `<tr><td class="lbl">${escapeHtml(label)}</td><td class="val">${escapeHtml(value)}</td></tr>`;
}

function section(title: string, rows: { label: string; value: string }[]): string {
  if (rows.length === 0) {
    return '';
  }
  const body = rows.map((r) => row(r.label, r.value)).join('');
  return `<section class="block">
  <h2 class="sec-title">${escapeHtml(title)}</h2>
  <table class="sec-table"><tbody>${body}</tbody></table>
</section>`;
}

function pushIfValue(
  rows: { label: string; value: string }[],
  label: string,
  v: unknown,
  fmt?: (v: unknown) => string,
) {
  const s = fmt ? fmt(v) : formatCellValue(v);
  if (s !== '' && s != null) {
    rows.push({ label, value: s });
  }
}

function buildLigneBusRows(form: CreateFormDto): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    { label: 'Client', value: formatCellValue(form.client) },
  ];
  const ordered: [string, unknown][] = [
    ['Ligne Casas', form.ligneCasas],
    ['Ligne RGE', form.ligneRge],
    ['Ligne CASC', form.ligneCasc],
    ['Ligne Forbus', form.ligneForbus],
    ['Ligne HH', form.ligneHH],
    ['N° HH', form.numLigneHH],
    ['N° Ligne CASC LR', form.numLigneCascLr],
    ['N° Ligne CASC SA', form.numLigneCascSA],
    ['N° Ligne CASC SC', form.numLigneCascSc],
    ['N° Ligne RGE LR', form.numLigneRgeLr],
    ['N° Ligne RGE SA', form.numLigneRgeSa],
    ['N° Ligne RGE SC', form.numLigneRgeSc],
    ['N° Forbus Doublage', form.numLigneForbusDoublage],
    ['N° Forbus CSCAF', form.numLigneForbusCSCAF],
    ['N° ligne Transavold', form.numLigneTransavold],
    ['N° ligne Transchool', form.numLigneTranschool],
  ];
  for (const [label, v] of ordered) {
    pushIfValue(rows, label, v);
  }
  return rows;
}

function htmlFormulaire(controleur: string, form: CreateFormDto): string {
  const heureReelleVal =
    form.carNonPasse &&
    (!form.heureReelle || String(form.heureReelle).trim() === '')
      ? '—'
      : formatCellValue(form.heureReelle ?? '');

  const envRows: { label: string; value: string }[] = [
    { label: 'Date', value: formatCellValue(form.date) },
    { label: 'Heure prévue', value: formatCellValue(form.heurePrevue) },
    { label: 'Heure réelle', value: heureReelleVal },
    { label: 'Lieu', value: formatCellValue(form.lieuControle) },
    { label: 'Météo', value: formatMeteo(form.meteo) },
  ];
  if (form.carNonPasse) {
    envRows.push({ label: 'Car non passé', value: 'Oui' });
  }

  const chauffeurRows: { label: string; value: string }[] = form.carNonPasse
    ? [
        {
          label: '\u00a0',
          value: 'Non applicable — car non passé au point de contrôle',
        },
      ]
    : [
        { label: 'Nom', value: formatCellValue(form.nom).toUpperCase() },
        { label: 'Prénom', value: formatCellValue(form.prenom) },
      ];

  const arretRows: { label: string; value: string }[] = [
    { label: 'Fiche horaire', value: formatConformeLike(form.ficheHoraire) },
    { label: 'Cadre affichage', value: formatConformeLike(form.cadreAffichage) },
    { label: 'État général', value: formatConformeLike(form.etatGeneral) },
    { label: "Type d'arrêt", value: formatCellValue(form.typeArret) },
    { label: 'Zébra', value: formatConformeLike(form.zebra) },
    {
      label: 'Observation arrêt',
      value: formatCellValue(form.observationArret ?? ''),
    },
  ];

  const vehiculeRows: { label: string; value: string }[] = [
    { label: 'N° Parc', value: formatCellValue(form.parc) },
    {
      label: 'Affichage destination',
      value: formatConformeLike(form.affichageDestination),
    },
    {
      label: 'Affichage N° Ligne',
      value: formatConformeLike(form.affichageNumeroLigne),
    },
    { label: 'Picto enfant', value: formatConformeLike(form.pictoEnfant) },
  ];

  const equipementRows: { label: string; value: string }[] = [
    { label: 'Tarif affiché', value: formatConformeLike(form.tarifAffiche) },
    {
      label: 'Dépliants horaires',
      value: formatConformeLike(form.depliantHoraire),
    },
    { label: 'Règlement', value: formatConformeLike(form.reglement) },
  ];

  const carrosserieRows: { label: string; value: string }[] = [
    { label: 'Carrosserie', value: formatCellValue(form.carosserie) },
    { label: 'Observation car', value: formatCellValue(form.observationCar) },
  ];

  const voyageursRows: { label: string; value: string }[] = [
    { label: 'Nb Voyageurs', value: formatCellValue(form.nbreVoyageur) },
    { label: 'Nb Irréguliers', value: formatCellValue(form.nbreVoyageurIrregulier) },
  ];

  const billetiqueRows: { label: string; value: string }[] = [
    {
      label: 'Billetique électronique',
      value: formatConformeLike(form.billetiqueElectronique),
    },
    {
      label: 'Billetique manuelle',
      value: formatConformeLike(form.billetiqueManuelle),
    },
    { label: 'Fond de caisse', value: formatConformeLike(form.fondDeCaisse) },
    {
      label: 'Observation billetique',
      value: formatCellValue(form.observationBilletique),
    },
  ];

  const conditionsRows: { label: string; value: string }[] = [
    { label: 'Tableau de bord', value: formatCellValue(form.tableauBord) },
    { label: 'Sol', value: formatCellValue(form.sol) },
    { label: 'Vitres', value: formatCellValue(form.vitres) },
    { label: 'Sièges', value: formatCellValue(form.sieges) },
    {
      label: 'Observations véhicule',
      value: formatCellValue(form.observationConditionsVehicule ?? ''),
    },
  ];

  const chauffeurImg = signatureDataUrl(form.chauffeurSignature);
  const controllerImg = signatureDataUrl(form.controllerSignature);
  const escAttr = (s: string) => s.replace(/"/g, '');

  const sigCell = (title: string, img: string | null) => `
  <td class="sig-cell">
    <div class="sig-head">${escapeHtml(title)}</div>
    ${
      img
        ? `<div class="sig-img-wrap"><img src="${escAttr(img)}" alt="" /></div>`
        : '<p class="sig-empty">—</p>'
    }
  </td>`;

  const signaturesBlock =
    form.carNonPasse
      ? '<p class="sig-na"><em>Car non passé : signatures non requises.</em></p>'
      : `<table class="sig-table"><tr>
    ${sigCell('Signature Chauffeur', chauffeurImg)}
    ${sigCell('Signature Contrôleur', controllerImg)}
  </tr></table>`;

  const controleurLine = escapeHtml(controleur.toUpperCase());

  const parts = [
    section('Environnement de contrôle', envRows),
    section('Chauffeur', chauffeurRows),
    section('Équipement arrêt', arretRows),
    section('Ligne de bus', buildLigneBusRows(form)),
    section('Véhicule', vehiculeRows),
    section('Équipement', equipementRows),
    section('Carosserie', carrosserieRows),
    section('Voyageurs', voyageursRows),
    section('Billetique', billetiqueRows),
    section('Conditions de transport', conditionsRows),
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Formulaire de Contrôle</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      color: #111;
      margin: 0;
      padding: 10mm 12mm;
      line-height: 1.35;
    }
    .doc-title {
      font-size: 16pt;
      font-weight: bold;
      text-align: center;
      margin: 0 0 14px;
      letter-spacing: 0.02em;
    }
    .block { margin-bottom: 11px; page-break-inside: avoid; }
    .sec-title {
      font-size: 10pt;
      font-weight: bold;
      margin: 0;
      padding: 5px 8px;
      background: #d9d9d9;
      border: 1px solid #888;
      border-bottom: none;
    }
    .sec-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 2px;
    }
    .sec-table td {
      border: 1px solid #888;
      padding: 4px 8px;
      vertical-align: top;
    }
    .sec-table .lbl {
      width: 38%;
      font-weight: 600;
      background: #f5f5f5;
    }
    .sec-table .val { width: 62%; }
    .controleur-line {
      margin: 14px 0 10px;
      font-weight: bold;
      font-size: 11pt;
    }
    .signatures-block { page-break-inside: avoid; }
    .signatures-block .sec-title { margin-top: 4px; }
    .sig-table { width: 100%; border-collapse: collapse; margin-top: 0; }
    .sig-cell {
      width: 50%;
      border: 1px solid #888;
      padding: 8px;
      vertical-align: top;
      min-height: 90px;
    }
    .sig-head {
      font-weight: bold;
      font-size: 9.5pt;
      text-align: center;
      margin-bottom: 8px;
    }
    .sig-img-wrap { text-align: center; }
    .sig-img-wrap img {
      max-width: 100%;
      max-height: 110px;
      border: 1px solid #ccc;
    }
    .sig-empty { text-align: center; color: #666; margin: 24px 0; }
    .sig-na { font-style: italic; color: #555; margin-top: 8px; }
  </style>
</head>
<body>
  <h1 class="doc-title">Formulaire de Contrôle</h1>
  ${parts.join('\n')}
  <p class="controleur-line">Contrôleur : ${controleurLine}</p>
  <div class="signatures-block">
    <h2 class="sec-title">Signatures</h2>
    ${signaturesBlock}
  </div>
</body>
</html>`;
}

/**
 * Génère un PDF (A4) à partir du nom du contrôleur et des données formulaire.
 */
export async function generatePdf(
  controleur: string,
  formulaire: CreateFormDto,
): Promise<Buffer> {
  const html = htmlFormulaire(controleur, formulaire);
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const pdfBytes = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '12mm', left: '10mm', right: '10mm' },
    });
    return Buffer.from(pdfBytes);
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}

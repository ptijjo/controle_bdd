import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type ExcelJSImport from 'exceljs';
import type { CreateFormDto } from '../formulaire/dto/create-form.dto';
import { validFormBody } from '../test/helpers/valid-form-body';

function minimalForm(overrides: Partial<CreateFormDto> = {}): CreateFormDto {
  const base = validFormBody();
  return {
    ...base,
    date: new Date(base.date as string),
    ...overrides,
  } as CreateFormDto;
}

type SaveToExcelModule = typeof import('./saveToExcel');

describe('saveToExcel', () => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'save-excel-'));
  let cwdSpy: jest.SpiedFunction<typeof process.cwd>;
  let mod: SaveToExcelModule;
  let ExcelJS: typeof ExcelJSImport;

  async function readWorkbookFromDisk(
    filePath: string,
  ): Promise<ExcelJSImport.Workbook> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    return workbook;
  }

  beforeAll(() => {
    cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(tmpRoot);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('./saveToExcel') as SaveToExcelModule;
    // Même instance qu’exceljs utilisée par saveToExcel (évite lecture corrompue sous Jest).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ExcelJS = require('exceljs');
  });

  beforeEach(() => {
    const controleDir = path.join(tmpRoot, 'controle');
    if (fs.existsSync(controleDir)) {
      fs.rmSync(controleDir, { recursive: true, force: true });
    }
  });

  afterAll(() => {
    cwdSpy.mockRestore();
  });

  afterAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('getControleDir and getControleExcelFilePath should resolve under project cwd', () => {
    expect(mod.getControleDir()).toBe(path.join(tmpRoot, 'controle'));
    expect(mod.getControleExcelFilePath()).toBe(
      path.join(tmpRoot, 'controle', 'controle.xlsx'),
    );
  });

  it('saveFormToExcel should create workbook with Controles and Horaire sheets', async () => {
    const filePath = await mod.saveFormToExcel(
      { nom: 'Martin', prenom: 'Paul' },
      minimalForm({ client: 'casas', lieuControle: 'Gare' }),
    );

    expect(fs.existsSync(filePath)).toBe(true);
    const workbook = await readWorkbookFromDisk(filePath);

    const controles = workbook.getWorksheet('Controles');
    const horaire = workbook.getWorksheet('Horaire');
    expect(controles).toBeDefined();
    expect(horaire).toBeDefined();
    expect(controles?.rowCount).toBeGreaterThanOrEqual(3);
    expect(horaire?.getRow(1).getCell(1).value).toBe('Date');
  });

  it('saveFormToExcel should append a second data row on existing file', async () => {
    await mod.saveFormToExcel(
      { nom: 'A', prenom: 'B' },
      minimalForm({ client: 'casas' }),
    );
    await mod.saveFormToExcel(
      { nom: 'C', prenom: 'D' },
      minimalForm({ client: 'forbus', lieuControle: 'Arrêt Nord' }),
    );

    const workbook = await readWorkbookFromDisk(mod.getControleExcelFilePath());
    const sheet = workbook.getWorksheet('Controles');
    expect(sheet?.rowCount).toBeGreaterThanOrEqual(4);
  });

  it('saveFormToExcel should remove legacy sheets when updating existing workbook', async () => {
    const excelPath = mod.getControleExcelFilePath();
    fs.mkdirSync(mod.getControleDir(), { recursive: true });

    const legacy = new ExcelJS.Workbook();
    legacy.addWorksheet('Controles');
    legacy.addWorksheet('Synthèse retards');
    await legacy.xlsx.writeFile(excelPath);

    await mod.saveFormToExcel(
      { nom: 'Martin', prenom: 'Paul' },
      minimalForm(),
    );

    const workbook = await readWorkbookFromDisk(excelPath);
    expect(workbook.getWorksheet('Synthèse retards')).toBeUndefined();
    expect(workbook.getWorksheet('Controles')).toBeDefined();
  });

  it('saveFormToExcel should write horaire row with delay when car passed control', async () => {
    await mod.saveFormToExcel(
      { nom: 'Martin', prenom: 'Paul' },
      minimalForm({
        carNonPasse: false,
        heureReelle: '08:15',
        heurePrevue: '08:00',
        nom: 'Chauffeur',
        prenom: 'Test',
        client: 'casas',
        lieuControle: 'Gare',
      }),
    );

    const workbook = await readWorkbookFromDisk(mod.getControleExcelFilePath());
    const horaire = workbook.getWorksheet('Horaire');
    const dataRow = horaire?.getRow(2);
    expect(dataRow?.getCell(8).value).toBe(-15);
    expect(dataRow?.getCell(9).value).toBe('Non');
  });

  it('saveFormToExcel should persist varied conforme and line fields', async () => {
    await mod.saveFormToExcel(
      { nom: 'Martin', prenom: 'Paul' },
      minimalForm({
        client: 'rgeFluo57',
        ligneRge: 'Lr',
        numLigneRgeLr: '12',
        ficheHoraire: 'Non conforme',
        zebra: 'Non conforme',
        billetiqueElectronique: 'Non observable',
        carosserie: 'Moyen',
        tableauBord: 'Sale',
        cadreAffichage: 'Non conforme',
      }),
    );

    const workbook = await readWorkbookFromDisk(mod.getControleExcelFilePath());
    const sheet = workbook.getWorksheet('Controles');
    expect(sheet?.rowCount).toBeGreaterThanOrEqual(3);
  });

  it('saveFormToExcel should mark car non passé on horaire sheet without ecart', async () => {
    await mod.saveFormToExcel(
      { nom: 'Martin', prenom: 'Paul' },
      minimalForm({ carNonPasse: true, client: 'casc' }),
    );

    const workbook = await readWorkbookFromDisk(mod.getControleExcelFilePath());
    const horaire = workbook.getWorksheet('Horaire');
    const dataRow = horaire?.getRow(2);
    expect(dataRow?.getCell(8).value).toBe('');
    expect(dataRow?.getCell(9).value).toBe('Oui');
  });
});

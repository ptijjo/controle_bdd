import type { CreateFormDto } from '../formulaire/dto/create-form.dto';
import { validFormBody } from '../test/helpers/valid-form-body';

const pagePdf = jest.fn<() => Promise<Uint8Array>>();
const pageSetContent = jest.fn();
const browserNewPage = jest.fn();
const browserClose = jest.fn();
const puppeteerLaunch = jest.fn();

jest.mock('puppeteer', () => ({
  __esModule: true,
  default: {
    launch: (...args: unknown[]) => puppeteerLaunch(...args),
  },
}));

import { generatePdf } from './pdfCreator';

function minimalForm(overrides: Partial<CreateFormDto> = {}): CreateFormDto {
  const base = validFormBody();
  return {
    ...base,
    date: new Date(base.date as string),
    ...overrides,
  } as CreateFormDto;
}

describe('pdfCreator', () => {
  beforeEach(() => {
    pagePdf.mockReset();
    pageSetContent.mockReset();
    browserNewPage.mockReset();
    browserClose.mockReset();
    puppeteerLaunch.mockReset();

    pagePdf.mockResolvedValue(new Uint8Array([37, 80, 68, 70]));
    pageSetContent.mockResolvedValue(undefined);
    browserNewPage.mockResolvedValue({
      setContent: pageSetContent,
      pdf: pagePdf,
    });
    browserClose.mockResolvedValue(undefined);
    puppeteerLaunch.mockResolvedValue({
      newPage: browserNewPage,
      close: browserClose,
    });
  });

  it('should launch puppeteer, render HTML and return a PDF buffer', async () => {
    const form = minimalForm({ client: 'casas', lieuControle: 'Gare Centrale' });

    const buffer = await generatePdf('martin', form);

    expect(puppeteerLaunch).toHaveBeenCalledWith(
      expect.objectContaining({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }),
    );
    expect(browserNewPage).toHaveBeenCalled();
    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('Gare Centrale'),
      { waitUntil: 'load' },
    );
    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('MARTIN'),
      { waitUntil: 'load' },
    );
    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('casas'),
      { waitUntil: 'load' },
    );
    expect(pagePdf).toHaveBeenCalledWith(
      expect.objectContaining({
        format: 'A4',
        printBackground: true,
      }),
    );
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    expect(browserClose).toHaveBeenCalled();
  });

  it('should include car non passé message when signatures are not required', async () => {
    const form = minimalForm({ carNonPasse: true });

    await generatePdf('dupont', form);

    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('Car non passé : signatures non requises'),
      { waitUntil: 'load' },
    );
  });

  it('should embed signature images when car passed control', async () => {
    const form = minimalForm({
      carNonPasse: false,
      heureReelle: '08:10',
      chauffeurSignature: 'YWJj',
      controllerSignature: 'data:image/png;base64,ZZZ',
    });

    await generatePdf('dupont', form);

    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('data:image/png;base64,ZZZ'),
      { waitUntil: 'load' },
    );
    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('data:image/png;base64,YWJj'),
      { waitUntil: 'load' },
    );
    expect(pageSetContent).toHaveBeenCalledWith(
      expect.stringContaining('Signature Chauffeur'),
      { waitUntil: 'load' },
    );
  });

  it('should include chauffeur nom and prénom but not email in HTML', async () => {
    const form = minimalForm({
      carNonPasse: false,
      heureReelle: '08:10',
      nom: 'Martin',
      prenom: 'Paul',
      email: 'chauffeur-confidentiel@test.com',
    });

    await generatePdf('dupont', form);

    const html = pageSetContent.mock.calls[0][0] as string;
    expect(html).toContain('MARTIN');
    expect(html).toContain('Paul');
    expect(html).not.toContain('chauffeur-confidentiel@test.com');
    expect(html).not.toMatch(/<td class="lbl">Email<\/td>/);
  });

  it('should format meteo, booleans and dash heure réelle in HTML', async () => {
    const form = minimalForm({
      meteo: 'pluvieux',
      carNonPasse: true,
      heureReelle: '',
    });

    await generatePdf('dupont', form);

    const html = pageSetContent.mock.calls[0][0] as string;
    expect(html).toContain('Pluvieux');
    expect(html).toContain('Oui');
    expect(html).toContain('—');
  });

  it('should close the browser when pdf generation fails', async () => {
    pagePdf.mockRejectedValue(new Error('pdf failed'));

    await expect(generatePdf('x', minimalForm())).rejects.toThrow('pdf failed');

    expect(browserClose).toHaveBeenCalled();
  });
});

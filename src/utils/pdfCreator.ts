import puppeteer, { Browser } from 'puppeteer';
import { htmlFormulaire } from '@/template/templateFormulaire';
import { CreateFormDto } from '@/dtos/forms.dto';

async function generatePdf(controleur: string, form: CreateFormDto): Promise<Buffer> {
  const html = htmlFormulaire(controleur, form);
  let browser: Browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer: Buffer = Buffer.from(await page.pdf({ format: 'A4' }));
    await browser.close();

    return pdfBuffer;
  } finally {
    if (browser) await browser.close();
  }
}

export default generatePdf;

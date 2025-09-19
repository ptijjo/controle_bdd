import { Form } from "@/interfaces/forms.interface";
import { User } from "@/interfaces/users.interface";
import puppeteer from "puppeteer";
import prisma from "./prisma";

const user = prisma.user;
async function generatePdf(form: Form): Promise<Buffer>{

    const controleur: User = await user.findUnique({ where: { id: form.controleurId } });

      const html = `
    <html>
      <body>
        <h1>Formulaire de contrôle</h1>
        <p>Contrôleur: ${controleur.nom} ${controleur.prenom}</p>
        <h2>Chauffeur</h2>
        <p>Nom - Prenom: ${form.nom} ${form.prenom}</p>
        <p>Email : ${form.email}</p>
        <h2>Signatures:</h2>
      </body>
    </html>
  `;
const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer:Buffer =Buffer.from (await page.pdf({ format: 'A4' }));
  await browser.close();

  return pdfBuffer;

    
}
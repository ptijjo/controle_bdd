import { HttpException } from '@/exceptions/httpException';
import { MailService } from '../../services/mails.service';

const mailservice = new MailService();

export async function sendMailActivation(email: string, link: string): Promise<string> {
  const subject = 'Invitation à rejoindre le groupe de contrôle';

  const content = `
    <p>Bonjour !</p>
    <p> Vous avez été invité à rejoindre  le groupe de contrôle de transdev Saint-Avold </p>
    <p>Pour cela, cliquez sur le lien ci-dessous : </p>
  `;

  const disclaimer = `
  <p>Si vous n'ètes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p>
    `;

  const envoi = await mailservice.sendEmail(email, subject, content, link, disclaimer);
 
  return envoi;
}

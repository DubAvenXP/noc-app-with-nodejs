import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';

interface SendMailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  // TODO: attachments?: {}
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    from: envs.MAILER_EMAIL,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody: html } = options;
    try {
      const sentInformation = await this.transporter.sendMail({ to, subject, html })
      console.log(sentInformation);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

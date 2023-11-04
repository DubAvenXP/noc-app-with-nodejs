import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { emailBodyTemplate } from './email-body';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path: string;
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
    const { to, subject, html, attachments = [] } = options;
    try {
      await this.transporter.sendMail({ to, subject, html, attachments });

      return true;
    } catch (error) {
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = `Logs from ${new Date().toLocaleString()}`;

    const attachments: Attachment[] = [
      { filename: 'all.log', path: 'logs/all.log' },
      { filename: 'high.log', path: 'logs/high.log' },
      { filename: 'medium.log', path: 'logs/medium.log' },
    ];

    this.sendEmail({ to, subject, html: emailBodyTemplate, attachments });
  }
}

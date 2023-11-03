import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';

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
      const sentInformation = await this.transporter.sendMail({ to, subject, html, attachments })
      console.log(sentInformation);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = `Logs from ${new Date().toISOString()}`;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        color: #333;
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        font-size: 24px;
        color: #333;
        text-align: center;
        padding: 10px;
        border-bottom: 1px solid #ddd;
      }
      .content {
        line-height: 1.6;
        color: #555;
        margin-top: 20px;
      }
      .footer {
        font-size: 12px;
        text-align: center;
        color: #999;
        border-top: 1px solid #ddd;
        padding-top: 10px;
        margin-top: 20px;
      }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          Logs from ${new Date().toISOString()}
        </div>
        <div class="content">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, laborum.</p>
          <p>Este es un ejemplo de log generado en el sistema. Por favor, asegúrese de revisarlo y tomar las acciones pertinentes.</p>
        </div>
        <div class="footer">
          Este es un mensaje automatizado, por favor no responda directamente a este correo.
        </div>
      </div>
    </body>
    </html>
    `;
    const attachments: Attachment[] = [
      { filename: 'all.log', path: 'logs/all.log' },
      { filename: 'high.log', path: 'logs/high.log' },
      { filename: 'medium.log', path: 'logs/medium.log'}
    ]

    this.sendEmail({ to, subject, html, attachments });
  }
}

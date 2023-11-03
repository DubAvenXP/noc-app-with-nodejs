import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { LogRepository } from '../../domain/repositories/log.repository';
import { emailBodyTemplate } from './email-body';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

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

  constructor(private readonly logRepository: LogRepository) {}

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, html, attachments = [] } = options;
    try {
      await this.transporter.sendMail({ to, subject, html, attachments });

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `Email sent to ${to}`,
        origin: 'email.service.ts',
      });

      this.logRepository.saveLog(log);
      return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high,
        message: `${error}`,
        origin: 'email.service.ts',
      });
      this.logRepository.saveLog(log);
      return false;
    }
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = `Logs from ${new Date().toISOString()}`;

    const attachments: Attachment[] = [
      { filename: 'all.log', path: 'logs/all.log' },
      { filename: 'high.log', path: 'logs/high.log' },
      { filename: 'medium.log', path: 'logs/medium.log' },
    ];

    this.sendEmail({ to, subject, html: emailBodyTemplate, attachments });
  }
}

import { EmailService } from '../../../presentation/email/email.service';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repositories/log.repository';

interface SendEmailLogsUseCase {
  execute(to: string | string[]): Promise<boolean>;
}

export class SendEmailLogs implements SendEmailLogsUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute(to: string | string[]): Promise<boolean> {
    try {
      const sent = this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) throw new Error('Error sending email');

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `Email sent to ${to}`,
        origin: 'email.service.ts',
      });
      this.logRepository.saveLog(log);

      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `${error}`,
        level: LogSeverityLevel.high,
        origin: 'send-email-logs.ts',
      });

      this.logRepository.saveLog(log);

      return false;
    }
  }
}

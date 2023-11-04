import { CheckService } from '../domain/use-cases/checks/check-service';
import { SendEmailLogs } from '../domain/use-cases/emails/send-email-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log.repository.implementation';
import { CronService } from './cron/cron.service';
import { EmailService } from './email/email.service';

const fileSystemeDatasource = new FileSystemDatasource();
const fileSystemLogRepository = new LogRepositoryImplementation(
  fileSystemeDatasource
);

export class Server {
  public static start(): void {
    console.log('Server started...');

    CronService.createJob('*/5 * * * * *', () => {
      const url = 'https://google.com';

      new CheckService(
        fileSystemLogRepository,
        () => console.log(`${url} is ok`),
        (error) => console.log(error)
      ).execute(url);
    });

    CronService.createJob('59 23 * * *', () => {
      const emailService = new EmailService();
      new SendEmailLogs(emailService, fileSystemLogRepository).execute(
        'example@gmail.com'
      );
    });
  }
}

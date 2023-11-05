import { CheckService } from '../domain/use-cases/checks/check-service';
import { SendEmailLogs } from '../domain/use-cases/emails/send-email-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { MongoDatasource } from '../infrastructure/datasources/mongo.datasource';
import { LogRepositoryImplementation } from '../infrastructure/repositories/log.repository.implementation';
import { CronService } from './cron/cron.service';
import { EmailService } from './email/email.service';

const fileSystemeDatasource = new FileSystemDatasource();
const mongoDatasource = new MongoDatasource();

const fileSystemLogRepository = new LogRepositoryImplementation(
  fileSystemeDatasource
);
const mongoLogRepository = new LogRepositoryImplementation(mongoDatasource);

export class Server {
  public static async start() {
    console.log('Server started');

    CronService.createJob('*/5 * * * * *', () => {
      const url = 'https://google.com';

      new CheckService(
        mongoLogRepository,
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

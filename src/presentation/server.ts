import { LogSeverityLevel } from '../domain/entities/log.entity';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { SendEmailLogs } from '../domain/use-cases/emails/send-email-logs';

import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { MongoDatasource } from '../infrastructure/datasources/mongo.datasource';
import { PostgresDatasource } from '../infrastructure/datasources/postgres.datasource';

import { LogRepositoryImplementation } from '../infrastructure/repositories/log.repository.implementation';

import { CronService } from './cron/cron.service';
import { EmailService } from './email/email.service';

const fileSystemeDatasource = new FileSystemDatasource();
const mongoDatasource = new MongoDatasource();
const postgresDatasource = new PostgresDatasource();

const fileSystemLogRepository = new LogRepositoryImplementation(
  fileSystemeDatasource
);
const mongoLogRepository = new LogRepositoryImplementation(mongoDatasource);
const postgresLogRepository = new LogRepositoryImplementation(postgresDatasource);

export class Server {
  public static async start() {
    CronService.createJob('*/5 * * * * *', () => {
      const url = 'http://localhost:3000';

      new CheckService(
        postgresLogRepository,
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

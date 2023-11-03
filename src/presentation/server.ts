import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImplementation } from "../infrastructure/repositories/log.repository.implementation";
import { CronService } from "./cron/cron-service";

const fileSystemeDatasource = new FileSystemDatasource()
const fileSystemLogRepository = new LogRepositoryImplementation(fileSystemeDatasource);

export class Server {
  public static start(): void {
    console.log('Server started...');
    // CronService.createJob('*/5 * * * * *', () => {
    //   const url = 'https://google.com';
    //   // const url = 'http://localhost:3000';
    //   new CheckService(
    //     fileSystemLogRepository,
    //     () => console.log(`${url} is ok`),
    //     (error) => console.log(error)
    //   ).execute(url)
    // });
  }
}

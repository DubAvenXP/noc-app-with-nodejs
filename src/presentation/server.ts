import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

export class Server {
  public static start(): void {
    console.log('Server started...');
    CronService.createJob('*/5 * * * * *', () => {
      new CheckService().execute('https://google.com')
    });
  }
}

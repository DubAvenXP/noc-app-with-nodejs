import { CronService } from "./cron/cron-service";

export class Server {
  public static start(): void {
    console.log('Server started...');
    CronService.createJob('*/5 * * * * *', () => {
      const date = new Date();
      console.log(`Cron job executed at ${date.toLocaleString()}`);
    });
  }
}

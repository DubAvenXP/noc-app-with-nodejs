import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repositories/log.repository';
interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepositories: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {
    if (!this.logRepositories.length) throw new Error('Log repositories are required.');
  }

  public async execute(url: string): Promise<boolean> {
    try {
      const request = await fetch(url);

      if (!request.ok) throw new Error(`Error on check service ${url}`);

      const newLog = new LogEntity({
        message: `Service ${url} working`,
        level: LogSeverityLevel.low,
        origin: 'check-service.ts',
      });

      this.saveLogs(newLog);
      this.successCallback && this.successCallback();

      return true;
    } catch (error) {
      const errorMessage = `${url} ${error}`;
      const log = new LogEntity({
        message: errorMessage,
        level: LogSeverityLevel.high,
        origin: 'check-service.ts',
      });

      this.saveLogs(log);
      this.errorCallback && this.errorCallback(errorMessage);

      return false;
    }
  }

  private saveLogs = (log: LogEntity) => {
    this.logRepositories.forEach(logRepository => logRepository.saveLog(log));
  }
}

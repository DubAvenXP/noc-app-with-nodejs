import fs from 'fs';

import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class FileSystemDatasource implements LogDataSource {
  private readonly logPath = 'logs/';
  private readonly allLogsPath = `${this.logPath}/all.log`;
  private readonly mediumLogsPath = `${this.logPath}/medium.log`;
  private readonly highLogsPath = `${this.logPath}/high.log`;

  private readonly logFilesPath = [
    this.allLogsPath,
    this.mediumLogsPath,
    this.highLogsPath,
  ];

  constructor() {
    this.createLogsFiles();
  }

  private createLogsFiles = () => {
    if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath);

    this.logFilesPath.forEach((path) => {
      if (!fs.existsSync(path)) fs.writeFileSync(path, '');
    });
  };

  async saveLog(newLog: LogEntity): Promise<void> {
    const newLogAsJson = `${JSON.stringify(newLog)}\n`

    fs.appendFileSync(this.allLogsPath, newLogAsJson);

    this.logFilesPath.forEach((path) => {
      const logLevel = newLog.level.toLocaleLowerCase();

      if (path.includes(logLevel)) fs.appendFileSync(path, newLogAsJson);
    })


  }
  getLogs(severityLevel: LogSeverityLevel): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

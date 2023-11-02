import fs from 'fs';

import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class FileSystemDatasource implements LogDataSource {
  private readonly logPath = 'logs/';
  private readonly logFilesPath = [
    `${this.logPath}/all.log`,
    `${this.logPath}/medium.log`,
    `${this.logPath}/high.log`,
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

  saveLog(log: LogEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getLogs(severityLevel: LogSeverityLevel): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

import fs from 'fs';

import { LogDataSource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

export class FileSystemDatasource implements LogDataSource {
  private readonly logPath = 'logs/';
  private readonly allLogsPath = `${this.logPath}/all.log`;
  private readonly mediumLogsPath = `${this.logPath}/medium.log`;
  private readonly highLogsPath = `${this.logPath}/high.log`;

  private readonly logFilePaths = [
    this.allLogsPath,
    this.mediumLogsPath,
    this.highLogsPath,
  ];

  constructor() {
    this.createLogsFiles();
  }

  async saveLog(newLog: LogEntity): Promise<void> {
    const newLogAsJson = `${JSON.stringify(newLog)}\n`;

    fs.appendFileSync(this.allLogsPath, newLogAsJson);

    this.logFilePaths.forEach((path) => {
      const logLevel = newLog.level.toLocaleLowerCase();

      if (path.includes(logLevel)) fs.appendFileSync(path, newLogAsJson);
    });
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const path = `${this.logPath}/${severityLevel}.log`

    if (LogSeverityLevel.low === severityLevel) return this.getLogsFromFile(this.allLogsPath)

    if (!this.logFilePaths.includes(path)) throw new Error(`${severityLevel} not implemented`);

    return this.getLogsFromFile(path);
  }

  private createLogsFiles = () => {
    if (!fs.existsSync(this.logPath)) fs.mkdirSync(this.logPath);

    this.logFilePaths.forEach((path) => {
      if (!fs.existsSync(path)) fs.writeFileSync(path, '');
    });
  };

  private getLogsFromFile = (path: string): LogEntity[] => {
    const content = fs.readFileSync(path, 'utf-8');

    if (content.trim() === '') return [];

    let stringLogs = content.split('\n');

    stringLogs = stringLogs.filter((stringLog) => stringLog.trim() !== '');

    return stringLogs.map(LogEntity.fromJSON);
  };
}

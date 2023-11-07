import fs from 'fs';
import path from 'path';

import { FileSystemDatasource } from '../../../src/infrastructure/datasources/file-system.datasource';
import {
  LogEntity,
  LogSeverityLevel,
} from '../../../src/domain/entities/log.entity';

describe('file-system.datasource.ts', () => {
  const logPath = path.join(__dirname, './../../../logs');
  const origin = 'file-system.datasource.spec.ts';
  const lowLog = {
    level: LogSeverityLevel.low,
    message: 'test',
    timestamp: new Date(),
    origin,
  };
  const mediumLog = {
    level: LogSeverityLevel.medium,
    message: 'test',
    timestamp: new Date(),
    origin,
  };
  const highLog = {
    level: LogSeverityLevel.high,
    message: 'test',
    timestamp: new Date(),
    origin,
  };

  beforeEach(() => {
    fs.rmSync(logPath, { recursive: true, force: true });
  });

  it('should create log files if they do not exist', () => {
    new FileSystemDatasource();
    const files = fs.readdirSync(logPath);

    expect(files.length).toBe(3);
    expect(files).toEqual(['all.log', 'high.log', 'medium.log']);
  });

  describe('instance methods', () => {
    describe('#saveLog', () => {
      it('should save a log in all.log file', () => {
        const logDatasource = new FileSystemDatasource();
        const logEntity = new LogEntity(lowLog);

        logDatasource.saveLog(logEntity);

        const allLogs = fs.readFileSync(`${logPath}/all.log`, 'utf-8');

        expect(allLogs).toContain(JSON.stringify(logEntity));
      });

      it('should save a log in all.log and medium.log files', () => {
        const logDatasource = new FileSystemDatasource();
        const logEntity = new LogEntity(mediumLog);

        logDatasource.saveLog(logEntity);

        const allLogs = fs.readFileSync(`${logPath}/all.log`, 'utf-8');
        const mediumLogs = fs.readFileSync(`${logPath}/medium.log`, 'utf-8');

        expect(allLogs).toContain(JSON.stringify(logEntity));
        expect(mediumLogs).toContain(JSON.stringify(logEntity));
      });

      it('should save a log in all.log and high.log files', () => {
        const logDatasource = new FileSystemDatasource();
        const logEntity = new LogEntity(highLog);

        logDatasource.saveLog(logEntity);

        const allLogs = fs.readFileSync(`${logPath}/all.log`, 'utf-8');
        const highLogs = fs.readFileSync(`${logPath}/high.log`, 'utf-8');

        expect(allLogs).toContain(JSON.stringify(logEntity));
        expect(highLogs).toContain(JSON.stringify(logEntity));
      });
    });

    describe('#getLogs', () => {
      it('should return all logs when severity level is low', async () => {
        const logDatasource = new FileSystemDatasource();
        const logEntity = new LogEntity(lowLog);

        logDatasource.saveLog(logEntity);

        const logs = await logDatasource.getLogs(LogSeverityLevel.low);

        expect(logs).toEqual([logEntity]);
      });

      it('should return medium logs', async () => {
        const logDatasource = new FileSystemDatasource();
        const logEntity = new LogEntity(mediumLog);

        logDatasource.saveLog(logEntity);

        const logs = await logDatasource.getLogs(LogSeverityLevel.medium);

        expect(logs).toEqual([logEntity]);
      });

      it('should return high logs', async () => {
        const logDatasource = new FileSystemDatasource();
        const logEntity = new LogEntity(highLog);

        logDatasource.saveLog(logEntity);

        const logs = await logDatasource.getLogs(LogSeverityLevel.high);

        expect(logs).toEqual([logEntity]);
      });

      it('should throw an error if log level is not valid', async () => {
        const logDatasource = new FileSystemDatasource();

        try {
          await logDatasource.getLogs('invalid' as LogSeverityLevel);
          expect(false).toBeTruthy();
        } catch (error) {
          expect(`${error}`).toBe('Error: invalid not implemented');
        }
      });

      it('returns empty array when file is empty', async () => {
        const logDatasource = new FileSystemDatasource();

        const logs = await logDatasource.getLogs(LogSeverityLevel.low);

        expect(logs).toEqual([]);
      });
    });
  });
});

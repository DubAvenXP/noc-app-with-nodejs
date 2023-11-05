import { LogEntity, LogSeverityLevel } from "../../../src/domain/entities/log.entity";
import { LogDataSource } from '../../../src/domain/datasources/log.datasource';

describe('log.datasource.ts', () => {
  const newLog = new LogEntity({
    origin: 'log.datasource.spec.ts',
    message: 'test message',
    level: LogSeverityLevel.low,
  })

  class MockLogDatasource implements LogDataSource {
    async saveLog(_log: LogEntity): Promise<void> {
      return;
    }

    async getLogs(_severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return [newLog];
    }
  }


  it('implements correct LogDataSource', async () => {
    const mockLogDatasource = new MockLogDatasource();
    expect(mockLogDatasource).toBeInstanceOf(MockLogDatasource);

    expect(mockLogDatasource).toHaveProperty('saveLog', expect.any(Function));
    expect(mockLogDatasource).toHaveProperty('getLogs', expect.any(Function));

    await mockLogDatasource.saveLog(newLog);
    const logs = await mockLogDatasource.getLogs(LogSeverityLevel.low);

    expect(logs).toEqual([newLog]);
  });
});

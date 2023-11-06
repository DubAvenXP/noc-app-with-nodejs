import { LogEntity, LogSeverityLevel } from "../../../src/domain/entities/log.entity";
import { LogRepository } from "../../../src/domain/repositories/log.repository";

describe('log.datasource.ts', () => {
  const newLog = new LogEntity({
    origin: 'log.datasource.spec.ts',
    message: 'test message',
    level: LogSeverityLevel.low,
  })

  class MockLogRepository implements LogRepository {
    async saveLog(_log: LogEntity): Promise<void> {
      return;
    }

    async getLogs(_severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return [newLog];
    }
  }


  it('implements correct LogRepository', async () => {
    const mockLogRepository = new MockLogRepository();
    expect(mockLogRepository).toBeInstanceOf(MockLogRepository);

    expect(mockLogRepository).toHaveProperty('saveLog', expect.any(Function));
    expect(mockLogRepository).toHaveProperty('getLogs', expect.any(Function));

    await mockLogRepository.saveLog(newLog);
    const logs = await mockLogRepository.getLogs(LogSeverityLevel.low);

    expect(logs).toEqual([newLog]);
  });
});

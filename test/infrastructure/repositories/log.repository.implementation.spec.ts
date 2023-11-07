import { LogRepositoryImplementation } from '../../../src/infrastructure/repositories/log.repository.implementation';
import { LogEntity, LogSeverityLevel } from '../../../src/domain/entities/log.entity';

describe('log.repository.implementation.ts', () => {
  const mockLogDatasource = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  }
  it('saveLog call the datasource method saveLog', () => {
    const logRepositoryImpl = new LogRepositoryImplementation(mockLogDatasource);

    const log = new LogEntity({
      level: LogSeverityLevel.low,
      origin: 'log.repository.implementation.spec.ts',
      message: 'test message',
    })

    logRepositoryImpl.saveLog(log);

    expect(mockLogDatasource.saveLog).toHaveBeenNthCalledWith(1, log);
  })

  it('getLogs call the datasource method getLogs', () => {
    const logRepositoryImpl = new LogRepositoryImplementation(mockLogDatasource);

    logRepositoryImpl.getLogs(LogSeverityLevel.high);

    expect(mockLogDatasource.getLogs).toHaveBeenNthCalledWith(1, LogSeverityLevel.high);
  })
});

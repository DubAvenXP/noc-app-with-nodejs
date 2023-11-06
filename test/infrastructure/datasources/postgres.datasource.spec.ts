import { SeverityLevel, PrismaClient } from '@prisma/client';

import {
  LogEntity,
  LogSeverityLevel,
} from '../../../src/domain/entities/log.entity';
import { PostgresDatasource } from '../../../src/infrastructure/datasources/postgres.datasource';

describe('postgres.datasource.ts', () => {
  let mockedPrismaClient = {
    log: {
      create: jest.fn().mockReturnValueOnce({
        id: 10,
        origin: 'postgres.datasource.spec.ts',
        message: 'test message',
        level: SeverityLevel.LOW,
        createdAt: new Date(),
      }),
      findMany: jest.fn().mockReturnValueOnce([
        {
          id: 33,
          origin: 'postgres.datasource.spec.ts',
          message: 'test message 33',
          level: SeverityLevel.LOW,
          createdAt: new Date(),
        },
      ]),
    },
  } as unknown as PrismaClient;
  let datasource = new PostgresDatasource(mockedPrismaClient);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('instance methods', () => {
    describe('#saveLog', () => {
      it('should be defined', async () => {
        expect(datasource.saveLog).toBeDefined();
      });

      it('should save log', async () => {
        // Arrange
        const logEntity = new LogEntity({
          origin: 'test origin',
          message: 'test message',
          level: LogSeverityLevel.low,
        });
        const consoleLogMock = jest.fn();

        // Act
        global.console.log = consoleLogMock;
        await datasource.saveLog(logEntity);

        // Assert
        expect(mockedPrismaClient.log.create).toHaveBeenCalledWith({
          data: {
            origin: logEntity.origin,
            message: logEntity.message,
            level: SeverityLevel.LOW,
            createdAt: expect.any(Date),
          },
        });
        expect(consoleLogMock).toHaveBeenCalledWith(
          `Log saved with id: 10 on Postgres`
        );
      });
    });

    describe('#getLogs', () => {
      it('should be defined', async () => {
        expect(datasource.getLogs).toBeDefined();
      });

      it('should get logs', async () => {
        // Arrange
        const consoleLogMock = jest.fn();

        // Act
        global.console.log = consoleLogMock;
        const logs = await datasource.getLogs(LogSeverityLevel.low);

        // Assert
        expect(mockedPrismaClient.log.findMany).toHaveBeenCalledWith({
          where: {
            level: SeverityLevel.LOW,
          },
        });
        expect(logs).toHaveLength(1);
        expect(logs[0]).toEqual(
          new LogEntity({
            origin: 'postgres.datasource.spec.ts',
            message: 'test message 33',
            level: LogSeverityLevel.low,
            createdAt: expect.any(Date),
          })
        );
      });
    });
  });
});

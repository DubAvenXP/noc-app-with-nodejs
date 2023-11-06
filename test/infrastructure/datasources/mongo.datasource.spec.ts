import mongoose from 'mongoose';

import { MongoDatabase } from '../../../src/data/mongo/init';
import { envs } from '../../../src/config/plugins/envs.plugin';
import {
  LogEntity,
  LogSeverityLevel,
} from '../../../src/domain/entities/log.entity';
import { MongoDatasource } from '../../../src/infrastructure/datasources/mongo.datasource';
import { logModel } from '../../../src/data/mongo';

describe('mongo.datasource.ts', () => {
  const logData = {
    origin: 'mongo.datasource.spec.ts',
    message: 'test message',
    level: LogSeverityLevel.low,
  };

  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  afterEach(async () => {
    await logModel.deleteMany();
  });

  describe('instance methods', () => {
    describe('#saveLog', () => {
      it('should be defined', async () => {
        const mongoDatasource = new MongoDatasource();

        expect(mongoDatasource.saveLog).toBeDefined();
      });

      it('should save log', async () => {
        const consoleLogMock = jest.fn();

        global.console.log = consoleLogMock;

        const mongoDatasource = new MongoDatasource();

        const newLog = new LogEntity(logData);

        await mongoDatasource.saveLog(newLog);

        expect(consoleLogMock).toHaveBeenCalledWith(
          expect.stringContaining('Log saved with id:')
        );
      });
    });
    describe('#getLogs', () => {
      it('should be defined', async () => {
        const mongoDatasource = new MongoDatasource();

        expect(mongoDatasource.getLogs).toBeDefined();
      });

      it('should get logs', async () => {
        const mongoDatasource = new MongoDatasource();
        const newLog = new LogEntity(logData);

        await mongoDatasource.saveLog(newLog);

        const logs = await mongoDatasource.getLogs(LogSeverityLevel.low);

        expect(logs).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              origin: logData.origin,
              message: logData.message,
              level: logData.level,
              createdAt: expect.any(Date),
            }),
          ])
        );
      });
    });
  });
});

import mongoose from 'mongoose';
import { envs } from '../../../../src/config/plugins/envs.plugin';
import { MongoDatabase } from '../../../../src/data/mongo/init';
import { LogSeverityLevel } from '../../../../src/domain/entities/log.entity';
import { logModel } from '../../../../src/data/mongo/models/log.model';

describe('log.model.ts', () => {
  beforeAll(async () => {
    await MongoDatabase.connect({
      mongoUrl: envs.MONGO_URL,
      dbName: envs.MONGO_DB_NAME,
    });
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it('returns log model', async () => {
    const logData = {
      origin: 'log.model.test.ts',
      message: 'test message',
      level: LogSeverityLevel.low,
    };

    const log = await logModel.create(logData);

    expect(log).toEqual(
      expect.objectContaining({
        _id: expect.any(mongoose.Types.ObjectId),
        origin: logData.origin,
        message: logData.message,
        level: logData.level,
        createdAt: expect.any(Date),
      })
    );

    await logModel.findByIdAndDelete(log._id);
  });

  it('returns schema object', async () => {
    const schema = logModel.schema.obj;

    expect(schema).toEqual(
      expect.objectContaining({
        level: {
          type: expect.any(Function),
          enum: ['low', 'medium', 'high'],
          default: 'info',
        },
        message: {
          type: expect.any(Function),
          required: true,
        },
        origin: {
          type: expect.any(Function),
          required: true,
        },
        createdAt: {
          type: expect.any(Function),
          default: expect.any(Date),
        },
      })
    );
  });
});

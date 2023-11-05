import mongoose from 'mongoose';
import { envs } from '../../../src/config/plugins/envs.plugin';
import { MongoDatabase } from '../../../src/data/mongo/init';
describe('init.ts', () => {
  afterAll(async () => {
    mongoose.connection.close();
  })

  it('has connect method', () => {
    expect(MongoDatabase.connect).toBeDefined();
  });

  it('connects to MongoDB', async () => {
    const connection = await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL
    });

    expect(connection).toBeTruthy();
  });

  it('throws error if not connect to MongoDB', () => {
    const connection = MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: 'mongodb://localhost:27017/?authMechanism=DEFAULT'
    });

    expect(connection).rejects.toThrow();
  });
});

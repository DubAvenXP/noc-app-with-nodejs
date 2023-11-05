import { envs } from '../../../src/config/plugins/envs.plugin';

describe('envs.plugins.ts', () => {
  it('returns env object', () => {
    expect(envs).toEqual({
      PORT: 3000,
      MAILER_SERVICE: 'gmail',
      MAILER_EMAIL: 'test@gmail.com',
      MAILER_SECRET_KEY: 'password',
      PROD: false,
      MONGO_URL: 'mongodb://alejandro:123456789@localhost:27017/?authMechanism=DEFAULT',
      MONGO_DB_NAME: 'NOC-TEST',
      MONGO_USER: 'alejandro',
      MONGO_PASS: '123456789',
      POSTGRES_USER: 'alejandro',
      POSTGRES_PASSWORD: '123456789',
      POSTGRES_DB: 'NOC-TEST',
      POSTGRES_URL: 'postgresql://alejandro:123456789@localhost:5432/NOC?schema=public'
    });
  });

  it('returns an error if not found environment variable', async () => {
    jest.resetModules();
    process.env.PORT = 'ABC'

    try {
      await import('../../../src/config/plugins/envs.plugin');
      expect(true).toBeFalsy();
    } catch (error) {
      expect(`${error}`).toContain('"PORT" should be a valid integer');
    }
  })
});

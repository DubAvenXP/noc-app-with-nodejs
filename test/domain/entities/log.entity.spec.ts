import {
  LogEntity,
  LogSeverityLevel,
} from '../../../src/domain/entities/log.entity';

describe('log.entity.ts', () => {
  const data = {
    origin: 'log.entity.spec.ts',
    message: 'test message',
    level: LogSeverityLevel.low,
  };

  it('creates a log entity instance', () => {
    const log = new LogEntity(data);

    expect(log).toBeInstanceOf(LogEntity);
    expect(log).toEqual(
      expect.objectContaining({
        ...data,
        createdAt: expect.any(Date),
      })
    );
  });

  describe('class methods', () => {
    describe('#fromJSON', () => {
      it('returns a log entity from a JSON string', () => {
        const jsonData = `{
          "message":"http://localhost:3000 TypeError: fetch failed",
          "level":"high",
          "origin":"log.entity.spec.ts",
          "createdAt":"2023-11-02T22:14:00.007Z"
        }`;

        const log = LogEntity.fromJSON(jsonData);

        expect(log).toBeInstanceOf(LogEntity);
        expect(log).toEqual(
          expect.objectContaining({
            message: 'http://localhost:3000 TypeError: fetch failed',
            level: 'high',
            origin: 'log.entity.spec.ts',
            createdAt: expect.any(Date),
          })
        );
      });

      it('throws an error when no JSON string is provided', () => {
        // If we expect an specific error
        expect(() => LogEntity.fromJSON()).toThrow('JSON string is required.');
      });
    });
    describe('#fromObject', () => {
      it('returns a log entity from an object', () => {
        const log = LogEntity.fromObject(data);

        expect(log).toBeInstanceOf(LogEntity);
        expect(log).toEqual(
          expect.objectContaining({
            ...data,
            createdAt: expect.any(Date),
          })
        );
      });
    });
    describe('#buildEntity', () => {
      it('it returns a log entity when level is UPPER', () => {
        const log = LogEntity.fromObject({
          ...data,
          level: LogSeverityLevel.low.toUpperCase(),
        });

        expect(log).toBeInstanceOf(LogEntity);
        expect(log).toEqual(
          expect.objectContaining({
            ...data,
            createdAt: expect.any(Date),
          })
        );
      });

      it('throws an error when message is not a string', () => {
        expect(() => LogEntity.fromObject({ ...data, message: 123 })).toThrow(
          'Message is required and must be a non-empty string.'
        );
      });

      it('throws an error when message is empty', () => {
        expect(() => LogEntity.fromObject({ ...data, message: '' })).toThrow(
          'Message is required and must be a non-empty string.'
        );
      });

      it('throws an error when level is not a valid LogSeverityLevel', () => {
        expect(() =>
          LogEntity.fromObject({ ...data, level: 'invalid' })
        ).toThrow('Level is required and must be a valid LogSeverityLevel.');
      });

      it('throws an error when createdAt is not a valid Date object', () => {
        expect(() =>
          LogEntity.fromObject({ ...data, createdAt: 'invalid' })
        ).toThrow('CreatedAt must be a valid Date object.');
      });
    });
  });
});

import { LogSeverityLevel } from '../../../../src/domain/entities/log.entity';
import { CheckService } from '../../../../src/domain/use-cases/checks/check-service';

describe('check-service.ts', () => {
  const mockLogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };
  const mockSuccessCallback = jest.fn();
  const mockErrorCallback = jest.fn();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('when callbacks are provided', () => {
    const checkcService = new CheckService(
      [mockLogRepository],
      mockSuccessCallback,
      mockErrorCallback
    );

    it('calls successCallback and returns true', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
        } as Response)
      );

      const url = 'http://google.com';
      const ok = await checkcService.execute(url);

      expect(ok).toBeTruthy();
      expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `Service ${url} working`,
          level: LogSeverityLevel.low,
          origin: 'check-service.ts',
          createdAt: expect.any(Date),
        })
      );
      expect(mockSuccessCallback).toHaveBeenCalledTimes(1);
      expect(mockErrorCallback).not.toHaveBeenCalled();
    });

    it('calls errorCallback and returns false', async () => {
      const url = 'http://google.com';
      const errorMessage = `${url} Error: Error on check service ${url}`;
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
        } as Response)
      );

      const ok = await checkcService.execute(url);

      expect(ok).toBeFalsy();
      expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: errorMessage,
          level: LogSeverityLevel.high,
          origin: 'check-service.ts',
          createdAt: expect.any(Date),
        })
      );
      expect(mockSuccessCallback).not.toHaveBeenCalled();
      expect(mockErrorCallback).toHaveBeenNthCalledWith(1, errorMessage);
    });
  });

  describe('when callbacks are not provided', () => {
    const checkcService = new CheckService(
      [mockLogRepository],
      undefined,
      undefined
    );

    it('does not call successCallback and returns true', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: true,
        } as Response)
      );

      const url = 'http://google.com';
      const ok = await checkcService.execute(url);

      expect(ok).toBeTruthy();
      expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: `Service ${url} working`,
          level: LogSeverityLevel.low,
          origin: 'check-service.ts',
          createdAt: expect.any(Date),
        })
      );
      expect(mockSuccessCallback).not.toHaveBeenCalled();
      expect(mockErrorCallback).not.toHaveBeenCalled();
    });

    it('does not call errorCallback and returns false', async () => {
      const url = 'http://google.com';
      const errorMessage = `${url} Error: Error on check service ${url}`;
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          ok: false,
        } as Response)
      );

      const ok = await checkcService.execute(url);

      expect(ok).toBeFalsy();
      expect(mockLogRepository.saveLog).toHaveBeenCalledWith(
        expect.objectContaining({
          message: errorMessage,
          level: LogSeverityLevel.high,
          origin: 'check-service.ts',
          createdAt: expect.any(Date),
        })
      );
      expect(mockSuccessCallback).not.toHaveBeenCalled();
      expect(mockErrorCallback).not.toHaveBeenCalled();
    });
  });

  describe('when repository array is empty', () => {
    it('throws an error', () => {
      expect(() => new CheckService([], undefined, undefined)).toThrow(
        'Log repositories are required.'
      );
    });
  })
});

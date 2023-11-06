import { SendEmailLogs } from '../../../../src/domain/use-cases/emails/send-email-logs';

describe('send-email-logs.ts', () => {
  const mockLogRepository = {
    saveLog: jest.fn(),
    getLogs: jest.fn(),
  };

  const email = 'email@example.com';

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('when email is sent', () => {
    let emailSent: boolean;
    const mockEmailService = {
      sendEmailWithFileSystemLogs: jest.fn().mockReturnValue(true),
    };
    beforeEach(async () => {

      const sendEmailLogs = new SendEmailLogs(
        mockEmailService as any,
        mockLogRepository
      );

      emailSent = await sendEmailLogs.execute(email);
    });

    it('returns true', () => {
      expect(emailSent).toBeTruthy();
    });

    it('calls sendEmailWithFileSystemLogs', () => {
      expect(
        mockEmailService.sendEmailWithFileSystemLogs
      ).toHaveBeenNthCalledWith(1, email);
    });

    it('calls saveLog', () => {
      expect(mockLogRepository.saveLog).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          message: `Email sent to ${email}`,
          level: 'low',
          origin: 'send-email-logs.ts',
          createdAt: expect.any(Date),
        })
      );
    });
  });

  describe('when email is not sent', () => {
    let emailSent: boolean;
    const mockEmailService = {
      sendEmailWithFileSystemLogs: jest.fn().mockReturnValue(false),
    };

    beforeEach(async () => {

      const sendEmailLogs = new SendEmailLogs(
        mockEmailService as any,
        mockLogRepository
      );

      emailSent = await sendEmailLogs.execute(email);
    });

    it('returns false', () => {
      expect(emailSent).toBeFalsy();
    });

    it('calls sendEmailWithFileSystemLogs', () => {
      expect(
        mockEmailService.sendEmailWithFileSystemLogs
      ).toHaveBeenNthCalledWith(1, email);
    });

    it('calls saveLog', () => {
      expect(mockLogRepository.saveLog).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          message: 'Error: Error sending email',
          level: 'high',
          origin: 'send-email-logs.ts',
          createdAt: expect.any(Date),
        })
      );
    });
  });
});

import nodemailer from 'nodemailer';
import {
  EmailService,
  SendMailOptions,
} from '../../../src/presentation/email/email.service';

describe('email.service.ts', () => {
  const mockSendEmail = jest.fn();
  nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: mockSendEmail,
  });

  it('should send email', async () => {
    const emailService = new EmailService();
    const options: SendMailOptions = {
      to: 'test@example.com',
      subject: 'test subject',
      html: '<p>test html</p>',
    };

    await emailService.sendEmail(options);

    expect(mockSendEmail).toHaveBeenCalledWith({
      attachments: [],
      html: '<p>test html</p>',
      subject: 'test subject',
      to: 'test@example.com',
    });
  });

  it('should send email with attachments', async () => {
    const emailService = new EmailService();
    const options: SendMailOptions = {
      to: 'example@mail.com',
      subject: 'test subject',
      html: '<p>test html</p>',
      attachments: [
        { filename: 'test.txt', path: 'test.txt' },
        { filename: 'test2.txt', path: 'test2.txt' },
      ],
    };

    await emailService.sendEmail(options);

    expect(mockSendEmail).toHaveBeenCalledWith({
      attachments: [
        { filename: 'test.txt', path: 'test.txt' },
        { filename: 'test2.txt', path: 'test2.txt' },
      ],
      html: '<p>test html</p>',
      subject: 'test subject',
      to: 'example@mail.com',
    });
  });
});

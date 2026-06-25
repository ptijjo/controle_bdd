import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Mailjet from 'node-mailjet';
import type { CreateFormDto } from '../formulaire/dto/create-form.dto';
import { validFormBody } from '../test/helpers/valid-form-body';
import type { MailjetResponse } from './interface/mail.interface';
import { MailService } from './mail.service';

type MailjetRecipient = { Email: string; Name?: string };
type MailjetSendPayload = {
  Messages: Array<{
    To?: MailjetRecipient[];
    Bcc?: MailjetRecipient[];
    Cc?: MailjetRecipient[];
    ReplyTo?: MailjetRecipient;
    Subject?: string;
    HTMLPart?: string;
    Attachments?: Array<{ Base64Content: string }>;
  }>;
};

const requestMock: jest.MockedFunction<
  (body: MailjetSendPayload) => Promise<{ body: MailjetResponse }>
> = jest.fn();
const postMock = jest.fn(() => ({ request: requestMock }));

jest.mock('node-mailjet', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    post: postMock,
  })),
}));

function firstMessage(): MailjetSendPayload['Messages'][number] {
  const body = requestMock.mock.calls[0]?.[0];
  if (!body?.Messages[0]) {
    throw new Error('Aucun message Mailjet enregistré');
  }
  return body.Messages[0];
}

function successMailjetResponse(): { body: MailjetResponse } {
  return {
    body: {
      Messages: [
        {
          Status: 'success',
          To: [
            {
              Email: 'user@test.com',
              MessageUUID: 'uuid',
              MessageID: 1,
            },
          ],
        },
      ],
    },
  };
}

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.MJ_APIKEY_PUBLIC = 'test-public-key';
    process.env.MJ_APIKEY_PRIVATE = 'test-private-key';
    process.env.EMAIL = 'noreply@example.test';

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should instantiate Mailjet once in the constructor with env keys', () => {
    expect(Mailjet).toHaveBeenCalledWith({
      apiKey: 'test-public-key',
      apiSecret: 'test-private-key',
    });
    expect(Mailjet).toHaveBeenCalledTimes(1);
  });

  describe('sendInvitationEmail', () => {
    it('should send invitation HTML with recipient, link and disclaimer', async () => {
      requestMock.mockResolvedValue(successMailjetResponse());

      const result = await service.sendInvitationEmail(
        'user@test.com',
        'https://example.test/activate',
      );

      expect(result).toBe('success');
      expect(postMock).toHaveBeenCalledWith('send', { version: 'v3.1' });
      expect(requestMock).toHaveBeenCalled();
      const message = firstMessage();
      expect(message.To?.[0]?.Email).toBe('user@test.com');
      expect(message.HTMLPart).toContain('Bonjour');
      expect(message.HTMLPart).toContain('https://example.test/activate');
      expect(message.Subject).toContain('Invitation');
    });

    it('should throw ConflictException when Mailjet status is not success', async () => {
      requestMock.mockResolvedValue({
        body: {
          Messages: [{ Status: 'error', To: [] }],
        },
      });

      await expect(
        service.sendInvitationEmail('u@test.com', 'https://example.test/l'),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('sendResume', () => {
    const form = {
      ...validFormBody(),
      date: new Date('2025-03-10'),
    } as CreateFormDto;

    beforeEach(() => {
      process.env.Marin = 'chef@test.com';
      process.env.EMAIL = 'noreply@example.test';
    });

    const controllerEmail = 'controleur@test.com';

    it('should throw BadRequestException when Marin is missing', async () => {
      delete process.env.Marin;

      await expect(service.sendResume(form, 'cGRm')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when EMAIL is missing', async () => {
      delete process.env.EMAIL;

      await expect(service.sendResume(form, 'cGRm')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should send one PDF email to Marin only when chauffeur has no email', async () => {
      requestMock.mockResolvedValue(successMailjetResponse());

      const result = await service.sendResume(form, 'cGRm', [controllerEmail]);

      expect(result).toBe('success');
      expect(requestMock).toHaveBeenCalledTimes(1);
      const message = firstMessage();
      expect(message.To).toEqual([{ Email: 'chef@test.com', Name: '' }]);
      expect(message.Bcc).toBeUndefined();
      expect(message.Cc).toBeUndefined();
      expect(message.Attachments?.[0]?.Base64Content).toBe('cGRm');
    });

    it('should send separate emails to Marin and chauffeur without exposing admin addresses', async () => {
      process.env.Marin = 'chef@test.com, admin2@test.com';
      requestMock.mockResolvedValue(successMailjetResponse());
      const withEmail = { ...form, email: 'chauffeur@test.com' };

      const result = await service.sendResume(withEmail, 'cGRm', [
        controllerEmail,
      ]);

      expect(result).toBe('success');
      expect(requestMock).toHaveBeenCalledTimes(2);

      const adminBody = requestMock.mock.calls[0][0];
      expect(adminBody.Messages[0].To?.map((t) => t.Email)).toEqual([
        'chef@test.com',
        'admin2@test.com',
      ]);
      expect(adminBody.Messages[0].Bcc).toBeUndefined();

      const driverBody = requestMock.mock.calls[1][0];
      expect(driverBody.Messages[0].To).toEqual([
        { Email: 'chauffeur@test.com', Name: 'Jean Dupont' },
      ]);
      expect(driverBody.Messages[0].Bcc).toBeUndefined();
      expect(driverBody.Messages[0].Cc).toBeUndefined();
      expect(driverBody.Messages[0].ReplyTo).toBeUndefined();
      expect(driverBody.Messages[0].HTMLPart).toContain('envoi automatique');
      expect(driverBody.Messages[0].HTMLPart).not.toContain(
        'répondre directement',
      );
    });

    it('should throw ConflictException when Mailjet fails on admin send', async () => {
      requestMock.mockResolvedValue({
        body: { Messages: [{ Status: 'error', To: [] }] },
      });

      await expect(service.sendResume(form, 'cGRm')).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('should not send chauffeur email when it matches controleur email', async () => {
      requestMock.mockResolvedValue(successMailjetResponse());
      const withControllerAsDriver = {
        ...form,
        email: 'controleur@test.com',
      };

      await service.sendResume(withControllerAsDriver, 'cGRm', [
        controllerEmail,
      ]);

      expect(requestMock).toHaveBeenCalledTimes(1);
      const message = firstMessage();
      expect(message.To?.[0]?.Email).toBe('chef@test.com');
    });

    it('should exclude controleur email from Marin recipients', async () => {
      process.env.Marin = 'chef@test.com, controleur@test.com';
      requestMock.mockResolvedValue(successMailjetResponse());

      await service.sendResume(form, 'cGRm', [controllerEmail]);

      const message = firstMessage();
      expect(message.To?.map((t) => t.Email)).toEqual(['chef@test.com']);
    });

    it('should throw ConflictException when chauffeur send fails after admin success', async () => {
      requestMock
        .mockResolvedValueOnce(successMailjetResponse())
        .mockResolvedValueOnce({
          body: { Messages: [{ Status: 'error', To: [] }] },
        });

      await expect(
        service.sendResume({ ...form, email: 'chauffeur@test.com' }, 'cGRm', [
          controllerEmail,
        ]),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(requestMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('getTemplate', () => {
    it('should embed content, link and disclaimer in the HTML template', () => {
      type MailServiceWithTemplate = {
        getTemplate: (
          content: string,
          subject: string,
          link: string,
          disclaimer: string,
        ) => string;
      };
      const mailWithTemplate = service as unknown as MailServiceWithTemplate;

      const html = mailWithTemplate.getTemplate(
        'Corps du message',
        'Titre email',
        'https://app/callback',
        'Petit disclaimer',
      );

      expect(html).toContain('Corps du message');
      expect(html).toContain('https://app/callback');
      expect(html).toContain('Petit disclaimer');
    });
  });
});

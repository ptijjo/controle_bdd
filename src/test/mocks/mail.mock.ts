import { MailService } from '../../mail/mail.service';

export function createMockMailService(): Pick<
  MailService,
  'sendInvitationEmail' | 'sendResume'
> {
  return {
    sendInvitationEmail: jest.fn().mockResolvedValue('invitation-sent'),
    sendResume: jest.fn().mockResolvedValue('resume-sent'),
  };
}

export function mockMailServiceProvider(
  mock: Pick<MailService, 'sendInvitationEmail' | 'sendResume'> = createMockMailService(),
): {
  provide: typeof MailService;
  useValue: Pick<MailService, 'sendInvitationEmail' | 'sendResume'>;
} {
  return {
    provide: MailService,
    useValue: mock,
  };
}

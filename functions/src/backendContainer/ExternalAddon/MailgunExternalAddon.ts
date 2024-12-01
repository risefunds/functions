import { injectable } from 'inversify';
import { IBaseAddon } from '../IBaseAddon';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

const API_KEY = process.env.MAILGUN_API || '';
const DOMAIN = 'sandboxc7499b3594524717a7e18b6c3e257f07.mailgun.org';
const FROM =
  'Risefunds Team <mailgun@sandboxc7499b3594524717a7e18b6c3e257f07.mailgun.org>';
// const REPLY_TO = 'team@risefunds.com';

const mailgun = new Mailgun(formData);

@injectable()
export class MailgunExternalAddon implements IBaseAddon {
  addonName = 'Mailgun';

  client = mailgun.client({ username: 'api', key: API_KEY! });

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    cc?: string;
    from?: string;
    replyTo?: string;
  }) {
    return this.client.messages.create(DOMAIN, {
      from: params.from ?? FROM,
      to: params.to,
      cc: params.cc,
      subject: params.subject,
      html: params.html,
      // 'h:Reply-To': params.replyTo ?? REPLY_TO,
    });
  }

  async prv(feature: string, data: unknown): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }

  async pub(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }

  async webhook(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }
}

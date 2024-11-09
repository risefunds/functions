import { injectable } from 'inversify';
import { IBaseAddon } from '../IBaseAddon';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
// import dotenv from 'dotenv';
// dotenv.config();

const API_KEY = '214a4344670624460ca490ebbf6b9a84-48c092ba-396f61c9';
const DOMAIN = 'new3plus.afkae.com';
const FROM = 'New3Plus Team <noreply@new3plus.afkae.com>';
const BCC = 'new3plus.cc@yopmail.com';
const REPLY_TO = 'team@new3plus.com';

const mailgun = new Mailgun(formData);

@injectable()
export class MailgunExternalAddon implements IBaseAddon {
  addonName = 'Mailgun';

  client = mailgun.client({ username: 'api', key: API_KEY });

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
      bcc: BCC,
      cc: params.cc,
      subject: params.subject,
      html: params.html,
      'h:Reply-To': params.replyTo ?? REPLY_TO,
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

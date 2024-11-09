import { inject, injectable, named } from 'inversify';
import { MailgunExternalAddon } from './MailgunExternalAddon';

@injectable()
export class ExternalAddonService {
  @inject('externalAddon')
  @named('MailgunExternalAddon')
  MailgunExternalAddon!: MailgunExternalAddon;

  async init(): Promise<void> {
    console.log('Addon Service Init');
  }
}

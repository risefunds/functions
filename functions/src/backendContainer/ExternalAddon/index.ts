import { Container } from 'inversify';
import { BaseService, baseServiceContainer } from '../Base';
import { ExternalAddonService } from './ExternalAddonService';
import { MailgunExternalAddon } from './MailgunExternalAddon';

const externalAddonContainer = new Container();

externalAddonContainer
  .bind('BaseService')
  .toConstantValue(baseServiceContainer.resolve<BaseService>(BaseService));

externalAddonContainer
  .bind<ExternalAddonService>(ExternalAddonService)
  .toSelf()
  .inSingletonScope();

externalAddonContainer
  .bind<MailgunExternalAddon>('externalAddon')
  .to(MailgunExternalAddon)
  .whenTargetNamed('MailgunExternalAddon');

export { externalAddonContainer, ExternalAddonService };

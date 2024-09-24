import { Container } from 'inversify';
import { BaseService, baseServiceContainer } from '../Base';
import { ExternalAddonService } from './ExternalAddonService';

const externalAddonContainer = new Container();

externalAddonContainer
  .bind('BaseService')
  .toConstantValue(baseServiceContainer.resolve<BaseService>(BaseService));

externalAddonContainer
  .bind<ExternalAddonService>(ExternalAddonService)
  .toSelf()
  .inSingletonScope();

export { externalAddonContainer, ExternalAddonService };

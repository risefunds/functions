import { Container } from 'inversify';
import { BaseService, baseServiceContainer } from '../Base';
import { EntityAddonService } from './EntityAddonService';
import { PlatformUserEntityAddon } from './PlatformUserEntityAddon';
import { CreativeUserEntityAddon } from './CreativeUserEntityAddon';
import { externalAddonContainer, ExternalAddonService } from '../ExternalAddon';

const entityAddonContainer = new Container();

entityAddonContainer
  .bind('BaseService')
  .toConstantValue(baseServiceContainer.resolve<BaseService>(BaseService));

entityAddonContainer
  .bind('ExternalAddonService')
  .toConstantValue(
    externalAddonContainer.resolve<ExternalAddonService>(ExternalAddonService)
  );

entityAddonContainer
  .bind<EntityAddonService>('entityAddon')
  .to(EntityAddonService)
  .whenTargetNamed('EntityAddonService');

entityAddonContainer
  .bind<PlatformUserEntityAddon>('entityAddon')
  .to(PlatformUserEntityAddon)
  .whenTargetNamed('PlatformUserEntityAddon');

entityAddonContainer
  .bind<CreativeUserEntityAddon>('entityAddon')
  .to(CreativeUserEntityAddon)
  .whenTargetNamed('CreativeUserEntityAddon');

export { entityAddonContainer, EntityAddonService };

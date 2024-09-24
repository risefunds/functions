import { externalAddonContainer, ExternalAddonService } from '../ExternalAddon';
import { entityAddonContainer, EntityAddonService } from '../EntityAddon';

import { BaseService, baseServiceContainer } from '../Base';
import { IBaseAddon } from '../IBaseAddon';
import { IBaseEntityAddonExtension } from '../EntityAddon/BaseEntityAddon';
import { models } from '@risefunds/sdk';

export class Container {
  BaseService: BaseService;
  ExternalAddonService: ExternalAddonService;
  EntityAddonService: EntityAddonService;

  initialized = false;

  get externalAddons(): IBaseAddon[] {
    return externalAddonContainer.getAll<IBaseAddon>('externalAddon');
  }

  get entityAddons(): IBaseEntityAddonExtension<
    unknown & models.IEntityModelExtension,
    unknown & models.IBaseEntityModel
  >[] {
    return entityAddonContainer.getAll<
      IBaseEntityAddonExtension<
        unknown & models.IEntityModelExtension,
        unknown & models.IBaseEntityModel
      >
    >('entityAddon');
  }

  constructor() {
    this.initialized = false;
    this.BaseService = baseServiceContainer.resolve<BaseService>(BaseService);
    this.ExternalAddonService =
      externalAddonContainer.resolve<ExternalAddonService>(
        ExternalAddonService
      );
    this.EntityAddonService =
      entityAddonContainer.resolve<EntityAddonService>(EntityAddonService);
  }

  async init(): Promise<void> {
    await this.BaseService.init();
    await this.ExternalAddonService.init();
    await this.EntityAddonService.init();

    this.initialized = true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { models, IEntityExtensionService, ISDKServices } from '@risefunds/sdk';
import { inject, injectable } from 'inversify';
import { BaseService } from '../Base';
import { ExternalAddonService } from '../ExternalAddon';
import { IBaseAddon } from '../IBaseAddon';

export interface IBaseEntityAddon {
  BaseService: BaseService;
  SdkServices: ISDKServices;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface IBaseEntityAddonExtension<
  ClassObject extends models.IEntityModelExtension,
  JSONModel extends models.IBaseEntityModel
> extends IBaseEntityAddon,
    IBaseAddon {
  entityService?: IEntityExtensionService<ClassObject, JSONModel>;
  onCreatePostHook?: (entityObject: ClassObject) => Promise<ClassObject>;
}

@injectable()
export class BaseEntityAddon<
  ClassObject extends models.IEntityModelExtension,
  JSONModel extends models.IBaseEntityModel
> implements IBaseEntityAddon
{
  @inject('BaseService')
  BaseService!: BaseService;

  @inject('ExternalAddonService')
  ExternalAddonService!: ExternalAddonService;

  get SdkServices(): ISDKServices {
    return this.BaseService.SDKService.getUnAuthenticatedSDKServices();
  }
}

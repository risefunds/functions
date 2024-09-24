import { models } from '@risefunds/sdk';

export interface IBaseAddon {
  addonName: string;
  webhook(
    feature: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
  pub(
    feature: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
  prv(
    feature: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;

  onCreate?<T extends models.IBaseEntityModel>(modelObject: T): Promise<void>;
  onUpdate?<T extends models.IBaseEntityModel>(
    existingModelObject: T,
    modelObject: T,
  ): Promise<T>;
  onWrite?<T extends models.IBaseEntityModel>(
    existingModelObject: T,
    modelObject: T,
  ): Promise<T>;
}

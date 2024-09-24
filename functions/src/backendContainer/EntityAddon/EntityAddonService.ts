import { inject, injectable, named } from 'inversify';
import { PlatformUserEntityAddon } from './PlatformUserEntityAddon';

@injectable()
export class EntityAddonService {
  @inject('entityAddon')
  @named('PlatformUserEntityAddon')
  PlatformUserEntityAddon!: PlatformUserEntityAddon;

  async init(): Promise<void> {
    console.log('Entity Addon Service Init');
  }
}

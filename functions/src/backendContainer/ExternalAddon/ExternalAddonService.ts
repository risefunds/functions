import { injectable } from 'inversify';

@injectable()
export class ExternalAddonService {
  async init(): Promise<void> {
    console.log('Addon Service Init');
  }
}

import { inject, injectable } from 'inversify';
import { SDKService } from './SDKService';
// import { StripeService } from './StripeService'

@injectable()
export class BaseService {
  @inject(SDKService)
  SDKService!: SDKService;

  //   @inject(StripeService)
  //   StripeService!: StripeService

  async init(): Promise<void> {
    console.log('Base Service Init');
  }
}

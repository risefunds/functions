import { injectable } from 'inversify';
import Stripe from 'stripe';

@injectable()
export class StripeService {
  get stripe(): Stripe {
    return new Stripe(process.env.STRIPE_API || '', {
      apiVersion: '2024-10-28.acacia',
    });
  }
}

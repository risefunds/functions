import { models, DonationEntityService, types } from '@risefunds/sdk';
import { inject, injectable, named } from 'inversify';
import admin from 'firebase-admin';
import { BaseEntityAddon, IBaseEntityAddonExtension } from './BaseEntityAddon';
import { PlatformUserEntityAddon } from './PlatformUserEntityAddon';
import Stripe from 'stripe';
import { env } from '../../utils/config';

@injectable()
export class DonationEntityAddon
  extends BaseEntityAddon<
    models.DonationEntityModel,
    models.IDonationEntityModel
  >
  implements
    IBaseEntityAddonExtension<
      models.DonationEntityModel,
      models.IDonationEntityModel
    >
{
  addonName = models.DonationEntityModel.collection;
  get entityService(): DonationEntityService {
    return this.BaseService.SDKService.getUnAuthenticatedSDKServices().core
      .DonationEntityService;
  }

  @inject('entityAddon')
  @named('PlatformUserEntityAddon')
  PlatformUserEntityAddon!: PlatformUserEntityAddon;

  async pub(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (feature == 'createPaymentLink') {
      const payload = data as { donation: string; jwt: string; amount: number };
      const donation = await this.entityService.get(payload.donation);
      if (!donation) throw new Error('Donation not found.');
      const platformUser = await this.PlatformUserEntityAddon.entityService.get(
        donation?.getSingleParentMandatoryReference(
          models.PlatformUserEntityModel.collection
        )
      );
      if (!platformUser) throw new Error('Platform user not found.');
      const firebaseUser = await admin.auth().getUser(platformUser.id);

      const authenticationLink = `${env.frontend.url}/user/client/donate/${donation.id}?n3Code=autoSignin&jwt=${payload.jwt}&uid=${platformUser.id}`;

      console.log({ amount: payload.amount });

      const checkoutSession =
        await this.BaseService.StripeService.stripe.checkout.sessions.create({
          mode: 'payment',
          line_items: [
            {
              price_data: {
                currency: 'CAD',
                product_data: {
                  name: 'Match Making Service',
                },
                unit_amount: 100 * payload.amount, // Amount is in cents
              },
              quantity: 1,
            },
          ],
          phone_number_collection: { enabled: true },
          cancel_url: authenticationLink,
          success_url: authenticationLink,
          customer_update: {
            name: 'auto',
          },
          customer: platformUser.stripeCustomer?.id,
          billing_address_collection: 'required',
          payment_intent_data: {
            receipt_email: firebaseUser.email,
          },
          submit_type: 'pay',
          metadata: {
            [donation.collection]: donation.id,
          },
        });

      donation.stripeCheckoutSession = {
        id: checkoutSession.id,
      };

      await this.entityService.persist(donation, { noHooks: true });
      return {
        paymentLink: checkoutSession.url,
      };
    }

    if (feature === 'createDonation') {
      const payload = data as types.IDonationInitialValues;
      const { email, displayName } = payload as types.IDonationInitialValues;

      if (payload.campaignId) {
        const campaign = await this.SdkServices.core.CampaignEntityService.get(
          payload.campaignId
        );

        if (campaign) {
          campaign.updateAmount(payload.amount);

          const { platformUser, firebaseUser } =
            await this.PlatformUserEntityAddon.signupPlatformUser({
              email,
              displayName,
            });
          if (platformUser && firebaseUser) {
            if (!(platformUser && platformUser.stripeCustomer)) {
              throw new Error('Customer account cant be processed.');
            }

            const donation = await this.entityService.persist(
              new models.DonationEntityModel(
                {
                  [platformUser.collection]: platformUser.id,
                  [campaign.collection]: campaign.id,
                },
                payload
              )
            );
            if (donation) {
              const customToken = await admin
                .auth()
                .createCustomToken(firebaseUser.uid);
              return {
                customToken,
                donation: donation.id,
                platformUserId: platformUser.id,
              };
            }
          }
        }
      }
    }

    throw new Error('Undefined');
  }

  async prv(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (feature === 'getStripeCheckoutSessionDetails') {
      const payload = data as { donationId: string };
      const booking = await this.entityService.get(payload.donationId, {
        noHooks: true,
      });
      if (!booking?.stripeCheckoutSession?.id) {
        throw new Error('Failed to retrive details.');
      }
      const stripeCheckoutSession =
        await this.BaseService.StripeService.stripe.checkout.sessions.retrieve(
          booking?.stripeCheckoutSession?.id,
          {
            expand: ['payment_intent.invoice'],
          }
        );

      const response: types.IStripeCheckoutSessionDetails = {
        url: stripeCheckoutSession.url ?? '',
        status: stripeCheckoutSession.status ?? 'expired',
        amount: stripeCheckoutSession.amount_total ?? 0,
        invoice:
          (
            (stripeCheckoutSession.payment_intent as Stripe.PaymentIntent)
              ?.invoice as Stripe.Invoice
          )?.hosted_invoice_url ?? '',
      };
      return response as unknown as Record<string, unknown>;
    }
    throw new Error('Undefined');
  }

  async webhook(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }
}

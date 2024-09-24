import { models, PlatformUserEntityService } from '@risefunds/sdk';
import { injectable } from 'inversify';
import admin from 'firebase-admin';
import { BaseEntityAddon, IBaseEntityAddonExtension } from './BaseEntityAddon';

interface IGetPlatformUserPayload {
  email: string;
  displayName: string;
  password?: string;
  inviteId?: string;
}
@injectable()
export class PlatformUserEntityAddon
  extends BaseEntityAddon<
    models.PlatformUserEntityModel,
    models.IPlatformUserEntityModel
  >
  implements
    IBaseEntityAddonExtension<
      models.PlatformUserEntityModel,
      models.IPlatformUserEntityModel
    >
{
  addonName = models.PlatformUserEntityModel.collection;
  get entityService(): PlatformUserEntityService {
    return this.BaseService.SDKService.getUnAuthenticatedSDKServices().core
      .PlatformUserEntityService;
  }

  // this is signup
  async signupPlatformUser(
    data: IGetPlatformUserPayload,
    type: models.IPlatformUserType[] = ['client'],
  ): Promise<{
    firebaseUser: admin.auth.UserRecord;
    platformUser: models.PlatformUserEntityModel;
  }> {
    let firebaseUser: admin.auth.UserRecord | undefined;

    try {
      firebaseUser = await admin.auth().getUserByEmail(data.email);
    } catch (error) {
      console.log('No Firebase User.');
    }
    let platformUser: models.PlatformUserEntityModel | undefined;

    if (!firebaseUser) {
      firebaseUser = await admin.auth().createUser(data);
      const platformUserModel = new models.PlatformUserEntityModel(
        firebaseUser.uid,
        firebaseUser.displayName,
      );
      platformUserModel.details = { ...platformUser?.details, type };
      platformUser = await this.entityService.persist(platformUserModel);
    } else {
      throw new Error('Email already exist');
    }

    // if (platformUser && firebaseUser) {
    //   const stripeCustomerId = platformUser.stripeCustomer?.id
    //   if (!stripeCustomerId) {
    //     const stripeCustomer =
    //       await this.BaseService.StripeService.stripe.customers.create({
    //         email: firebaseUser.email,
    //         name: firebaseUser.displayName,
    //         metadata: {
    //           [platformUser.collection]: platformUser.id,
    //         },
    //       })
    //     platformUser.stripeCustomer = {
    //       id: stripeCustomer.id,
    //     }
    //     const updatedPlatformUser = await this.entityService.persist(
    //       platformUser
    //     )

    //     if (updatedPlatformUser) {
    //       platformUser = updatedPlatformUser
    //     }
    //   }

    //   return { platformUser, firebaseUser }
    // }
    throw new Error('User not resolved');
  }

  async prv(
    feature: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }

  async pub(
    feature: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    if (feature === 'getPlatformUser') {
      const payload = data as {
        user: IGetPlatformUserPayload;
        type: models.IPlatformUserType[];
      };
      const { firebaseUser } = await this.signupPlatformUser(
        payload.user as never as IGetPlatformUserPayload,
        payload.type,
      );
      const customToken = await admin
        .auth()
        .createCustomToken(firebaseUser.uid);
      return {
        customToken,
      };
    }
    return { message: 'Undefined' };
  }

  async webhook(
    feature: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }
}

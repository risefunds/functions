import { models, PlatformUserEntityService } from '@risefunds/sdk';
import { injectable } from 'inversify';
import admin from 'firebase-admin';
import { BaseEntityAddon, IBaseEntityAddonExtension } from './BaseEntityAddon';

interface IGetPlatformUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  password?: string;
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

  // Signup method
  async signupPlatformUser(
    data: IGetPlatformUserPayload,
    type: models.IPlatformUserType[] = ['creative']
  ): Promise<{
    firebaseUser: admin.auth.UserRecord;
    platformUser: models.PlatformUserEntityModel;
  }> {
    let firebaseUser: admin.auth.UserRecord | undefined;

    try {
      // Check if the Firebase user exists
      firebaseUser = await admin.auth().getUserByEmail(data.email);
    } catch (error) {
      console.log('No Firebase User.');
    }

    let platformUser: models.PlatformUserEntityModel | undefined;

    if (!firebaseUser) {
      // Create a new Firebase user if not found
      firebaseUser = await admin.auth().createUser(data);

      // Create a new Platform User entity
      const platformUserModel = new models.PlatformUserEntityModel(
        firebaseUser.uid,
        firebaseUser.displayName
      );

      platformUserModel.details = {
        ...platformUser?.details,
        type,
      };

      platformUser = await this.entityService.persist(platformUserModel);
    } else {
      throw new Error('Email already exists');
    }

    // If both Firebase user and platform user are created successfully, return them
    if (platformUser && firebaseUser) {
      return { platformUser, firebaseUser };
    }

    // Throw error if user is not resolved
    throw new Error('User not resolved');
  }

  async prv(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }

  async pub(
    feature: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    if (feature === 'getPlatformUser') {
      const payload = data as {
        user: IGetPlatformUserPayload;
        type: models.IPlatformUserType[];
      };
      const { firebaseUser } = await this.signupPlatformUser(
        payload.user as never as IGetPlatformUserPayload,
        payload.type
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
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    console.log(feature, data);
    return { message: 'Undefined' };
  }
}

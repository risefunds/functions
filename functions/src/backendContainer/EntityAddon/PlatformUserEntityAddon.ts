import { models, PlatformUserEntityService } from '@risefunds/sdk';
import { injectable } from 'inversify';
import admin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';
import { BaseEntityAddon, IBaseEntityAddonExtension } from './BaseEntityAddon';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface IGetPlatformUserPayload {
  email: string;
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

  // Email & Password Signup method
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
    } catch (error) {}

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
      // const stripeCustomerId = platformUser.stripeCustomer?.id;
      // if (!stripeCustomerId) {
      //   const stripeCustomer =
      //     await this.BaseService.StripeService.stripe.customers.create({
      //       email: firebaseUser.email,
      //       name: firebaseUser.displayName,
      //       metadata: {
      //         [platformUser.collection]: platformUser.id,
      //       },
      //     });
      //   platformUser.stripeCustomer = {
      //     id: stripeCustomer.id,
      //   };
      //   const updatedPlatformUser = await this.entityService.persist(
      //     platformUser
      //   );

      //   if (updatedPlatformUser) {
      //     platformUser = updatedPlatformUser;
      //   }
      // }
      return { platformUser, firebaseUser };
    }

    // Throw error if user is not resolved
    throw new Error('User not resolved');
  }

  async signupWithGoogle(idToken: string): Promise<{
    firebaseUser: admin.auth.UserRecord;
    platformUser: models.PlatformUserEntityModel;
  }> {
    let payload: any;

    // Check if running in emulator
    if (process.env.NODE_ENV !== 'development') {
      console.log('Running in emulator, skipping Google token verification.');
      // Mock payload for emulator
      payload = {
        email: 'madibude@example.com',
        name: 'Madi Bude',
        email_verified: true,
        sub: '1234567890', // Unique user ID
      };
    } else {
      // Verify the Google ID token in production
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });

        if (!ticket) {
          throw new Error('Invalid Google ID Token');
        }

        payload = ticket.getPayload();

        if (!payload || !payload.email) {
          throw new Error('Invalid Google ID Token: Missing email');
        }
      } catch (error) {
        // Handle unknown error type
        if (error instanceof Error) {
          console.error('Error verifying Google ID token:', error.message);
          throw new Error('Failed to verify Google ID token');
        } else {
          console.error('Unknown error during token verification:', error);
          throw new Error('Unknown error occurred during token verification');
        }
      }
    }

    const { email, name } = payload;

    let firebaseUser: admin.auth.UserRecord | undefined;

    try {
      // Check if the Firebase user exists
      firebaseUser = await admin.auth().getUserByEmail(email);
    } catch (error) {}

    let platformUser: models.PlatformUserEntityModel | undefined;

    if (!firebaseUser) {
      // Create Firebase user if not found
      firebaseUser = await admin.auth().createUser({
        email,
        displayName: name,
      });

      // Create Platform User entity
      const platformUserModel = new models.PlatformUserEntityModel(
        firebaseUser.uid,
        firebaseUser.displayName
      );

      platformUserModel.details = {
        type: ['creative'], // Default type
      };

      platformUser = await this.entityService.persist(platformUserModel);
    } else {
      // If Firebase user exists, retrieve the corresponding platform user
      platformUser = await this.entityService.get(firebaseUser.uid);
      if (!platformUser) {
        throw new Error('Platform User not found for Firebase User');
      }
    }

    // Return the created or fetched user
    return { firebaseUser, platformUser };
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

    if (feature === 'signupWithGoogle') {
      const { idToken } = data as { idToken: string };
      const { firebaseUser } = await this.signupWithGoogle(idToken);
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

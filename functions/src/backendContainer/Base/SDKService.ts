import { injectable } from 'inversify';
import admin, { auth } from 'firebase-admin';
import { getSDKServices, ISDKServices } from '@risefunds/sdk';
import { DBService } from '../../utils/DBService';

@injectable()
export class SDKService {
  db = admin.firestore();

  constructor() {
    this.db.settings({
      timestampsInSnapshots: true,
      ignoreUndefinedProperties: true,
    });
  }

  getUnAuthenticatedSDKServices(): ISDKServices {
    const sdkServices = getSDKServices();
    sdkServices.base.referenceService.db = new DBService();
    sdkServices.base.backendService.internalSecret = 'internalsecret';
    sdkServices.base.backendService.noHooks = true;
    return sdkServices;
  }

  async getAuthorizedSDKServices(
    id: string,
  ): Promise<{ firebaseUser: auth.UserRecord; sdkServices: ISDKServices }> {
    if (!process.env?.FIREBASE_CONFIG)
      throw new Error('Firebase Config not defined');
    const sdkServices = this.getUnAuthenticatedSDKServices();
    sdkServices.base.backendService.noHooks = false;
    const firebaseUser = await auth().getUser(id);

    sdkServices.base.backendService.getAuthorization = async () => {
      return {
        uid: firebaseUser.uid,
      };
    };
    return { firebaseUser, sdkServices };
  }
}

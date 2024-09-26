import admin from 'firebase-admin';
import serviceAccount from './utils/serviceAccountKey.json';

// import * as dotenv from 'dotenv';

// dotenv.config();

// const serviceAccount = JSON.parse(
//   process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 as string
// );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as never),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

export * from './api';

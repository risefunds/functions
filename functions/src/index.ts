import admin from 'firebase-admin';
// import serviceAccount from './utils/serviceAccountKey.json';

import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS as string
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

export * from './api';

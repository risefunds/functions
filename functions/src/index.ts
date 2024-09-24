import admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT as string
);

// import serviceAccount from './utils/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

export * from './api';
// export * from './events'
// export * from './cron'

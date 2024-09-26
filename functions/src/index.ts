import admin from 'firebase-admin';
// import serviceAccount from './utils/serviceAccountKey.json';

import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FB_SERVICE_JSON as string);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as never),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

export * from './api';
// export * from './events'
// export * from './cron'

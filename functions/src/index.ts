import admin from 'firebase-admin';
// import serviceAccount from './utils/serviceAccountKey.json';

import * as dotenv from 'dotenv';

dotenv.config();

// const serviceAccount = JSON.parse(
//   process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 as string
// );

const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64 as string,
    'base64'
  ).toString('utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

export * from './api';

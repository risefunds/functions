import admin from 'firebase-admin';
// import serviceAccount from './utils/serviceAccountKey.json';

import * as dotenv from 'dotenv';

dotenv.config();

let serviceAccount: admin.ServiceAccount;

if (process.env.GITHUB_ACTIONS) {
  // GitHub Actions: Decode the Base64-encoded service account credentials
  const decodedCredentials = Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64!,
    'base64'
  ).toString('utf-8');
  serviceAccount = JSON.parse(decodedCredentials);
} else {
  // Local environment: Use JSON directly from the .env file
  serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as never),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

export * from './api';

import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

// Retrieve the environment variable from Firebase config
const serviceAccount = JSON.parse(
  JSON.stringify(functions.config().google.application_credentials)
);

// Initialize Firebase Admin SDK using the serviceAccount credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
});

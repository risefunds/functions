import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

// Check if the environment is production or local
if (process.env.NODE_ENV === 'production') {
  // In production, use the Firebase Functions environment configuration
  const serviceAccount = functions.config().google.application_credentials;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://n3-db-webapp-dev-default-rtdb.firebaseio.com',
  });
} else {
  // In local environment, use the local service account key
  const serviceAccount = require('./utils/serviceAccountKey.json'); // Import the local service account key
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as never),
    databaseURL: 'https://n3-db-webapp-dev-default-rtdb.firebaseio.com',
  });
}

// Export your modules (API, events, cron jobs, etc.)
export * from './api';

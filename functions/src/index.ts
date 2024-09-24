import admin from 'firebase-admin'
import serviceAccount from './utils/serviceAccountKey.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as never),
  databaseURL: 'https://risefunds-default-rtdb.firebaseio.com/',
})

export * from './api'
// export * from './events'
// export * from './cron'

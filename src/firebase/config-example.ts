import {FirebaseApp, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'EXAMPLE_API_KEY',
  authDomain: 'EXAMPLE_AUTH_DOMAIN',
  projectId: 'EXAMPLE_PROJECT_ID',
  storageBucket: 'EXAMPLE_STORAGE_BUCKET',
  messagingSenderId: 'EXAMPLE_MESSAGING_SENDER_ID',
  appId: 'EXAMPLE_APP_ID',
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

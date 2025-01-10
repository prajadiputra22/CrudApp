import {FirebaseApp, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxo80FwPIgOi0qsKnh1581zxS6H6I8FM0",
  authDomain: "appinfonime.firebaseapp.com",
  projectId: "appinfonime",
  storageBucket: "appinfonime.firebasestorage.app",
  messagingSenderId: "973473613031",
  appId: "1:973473613031:web:3dad4bafa539863cac0e42"
};
const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(app);

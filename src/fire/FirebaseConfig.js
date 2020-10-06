import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)

export const db = firebase.firestore();
export const auth = firebase.auth();
export const analytics = firebase.analytics();
// export const storage = firebase.storage();
// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// export const messaging = firebase.messaging();
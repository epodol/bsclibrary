import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/analytics';

const FirebaseContext = React.createContext({});

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseContextState, setFirebaseContextState] = useState({
    firebase: firebase.apps.length
      ? firebase
      : firebase.initializeApp(firebaseConfig),
    analytics:
      process.env.NODE_ENV === 'production' ? firebase.analytics() : null,
    user: null,
    userInfo: null,
    viewBooks: false,
    canCheckout: false,
    canViewCheckouts: false,
    isAdmin: false,
  });

  useEffect(() => {
    firebase.firestore();
    firebase.auth();
    firebase.functions();
    firebase.storage();
    if (process.env.NODE_ENV !== 'production') {
      firebase.firestore().useEmulator('localhost', 8080);
      firebase.functions().useEmulator('localhost', 5001);
      firebase.auth().useEmulator('http://localhost:9099/');
    } else {
      firebase.analytics();
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((claims) => {
          setFirebaseContextState({
            firebase,
            user,
            userInfo: claims,
            viewBooks: claims.claims.role >= 100,
            canCheckout: claims.claims.role >= 300,
            canViewCheckouts: claims.claims.role >= 500,
            isAdmin: claims.claims.role >= 1000,
          });
        });
      } else {
        setFirebaseContextState({
          firebase,
          user: null,
          userInfo: null,
          viewBooks: false,
          canCheckout: false,
          canViewCheckouts: false,
          isAdmin: false,
        });
      }
    });
  }, []);

  return (
    <FirebaseContext.Provider value={firebaseContextState}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;

import React, { useContext, useState, useEffect } from "react";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/analytics';

const FirebaseContext = React.createContext({});
const FirebaseUpdateContext = React.createContext({});

export function useFirebaseContext() {
  return useContext(FirebaseContext)
}

export function useFirebaseUpdateContext() {
  return useContext(FirebaseUpdateContext)
}

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

export function FirebaseProvider({children}) {
  const [firebaseState, setFirebaseState] = useState(
    {
      firebase: firebase.apps.length ? firebase : firebase.initializeApp(firebaseConfig),
      firestore: firebase.firestore(),
      auth: firebase.auth(),
      storage: firebase.storage(),
      functions: firebase.functions(),
      analytics: (process.env.NODE_ENV === 'production' ? firebase.analytics() : null),
      user: null,
      userInfo: null,
      viewBooks: false,
      canCheckout: false,
      canViewCheckouts: false,
      isAdmin: false,
  });

  const firebaseUpdate = () => {
    firebaseState.auth.onAuthStateChanged((user) => {
      if (user) {
          user.getIdTokenResult().then(claims => {
              console.log("claims....", claims.claims)
              setFirebaseState({
                  firebase, 
                  analytics: (process.env.NODE_ENV === 'production' ? firebase.analytics() : null),
                  user: user,
                  userInfo: claims,
                  viewBooks: claims.claims.role >= 100,
                  canCheckout: claims.claims.role >= 300,
                  canViewCheckouts: claims.claims.role >= 500,
                  isAdmin: claims.claims.role >= 1000
              })
          })
      } else {
        setFirebaseState({
              firebase,
              analytics: (process.env.NODE_ENV === 'production' ? firebase.analytics() : null),
              user: null,
              userInfo: null,
              viewBooks: false,
              canCheckout: false,
              canViewCheckouts: false,
              isAdmin: false,
          })
      }
    })
  }

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      firebaseState.firestore.useEmulator("localhost", 8080);
      firebaseState.functions.useEmulator("localhost", 5001);
      firebaseState.auth.useEmulator('http://localhost:9099/');
    }
  }, []);

  return(
    <FirebaseContext.Provider value={firebaseState}>
      <FirebaseUpdateContext.Provider value={firebaseUpdate}>
        {children}
      </FirebaseUpdateContext.Provider>
    </FirebaseContext.Provider>

  )
}

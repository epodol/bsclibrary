import React, { useState, useEffect } from 'react';
import {
  useFirebaseApp,
  useAuth,
  preloadFirestore,
  preloadAuth,
  preloadFunctions,
} from 'reactfire';

const FirebaseContext = React.createContext({});

export const FirebaseProvider = ({ children }) => {
  const firebaseApp = useFirebaseApp();
  const auth = useAuth();
  if (process.env.NODE_ENV !== 'production') {
    auth.useEmulator('http://localhost:9099/');
  }
  const [firebaseContextState, setFirebaseContextState] = useState({
    viewBooks: false,
    canCheckout: false,
    canViewCheckouts: false,
    isAdmin: false,
  });

  Promise.all([
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        if (process.env.NODE_ENV !== 'production') {
          firestore().useEmulator('localhost', 8080);
        }
        return firestore().enablePersistence({ synchronizeTabs: true });
      },
      suspense: true,
    }),
    preloadAuth({
      firebaseApp,
      suspense: true,
    }),
    preloadFunctions({
      firebaseApp,
      setup(functions) {
        if (process.env.NODE_ENV !== 'production') {
          functions().useEmulator('localhost', 5001);
        }
      },
      suspense: true,
    }),
  ])
    .then()
    .catch();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((claims) => {
          setFirebaseContextState({
            user,
            viewBooks: claims.claims.role >= 100,
            canCheckout: claims.claims.role >= 300,
            canViewCheckouts: claims.claims.role >= 500,
            isAdmin: claims.claims.role >= 1000,
          });
        });
      } else {
        setFirebaseContextState({
          user: null,
          viewBooks: false,
          canCheckout: false,
          canViewCheckouts: false,
          isAdmin: false,
        });
      }
    });
  }, [auth]);

  return (
    <FirebaseContext.Provider value={firebaseContextState}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;

import React, { useState, useEffect } from 'react';
import { useAuth } from 'reactfire';

const FirebaseContext = React.createContext({});

export const FirebaseProvider = ({ children }) => {
  const auth = useAuth();

  const [firebaseContextState, setFirebaseContextState] = useState({
    user: null,
    claims: null,
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((claims) => {
          setFirebaseContextState({
            user,
            claims: claims.claims,
          });
        });
        if (!user.emailVerified) {
          const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
          };
          user.sendEmailVerification(actionCodeSettings);
        }
      } else {
        setFirebaseContextState({
          user: null,
          claims: null,
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

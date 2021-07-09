import React, { FC, useState, useEffect, createContext } from 'react';
import { useAuth } from 'reactfire';
import 'firebase/app';
import 'firebase/auth';

const FirebaseContext = createContext<{
  user: firebase.default.User | null;
  claims: claims | null;
}>({
  user: null,
  claims: null,
});

interface claims {
  [key: string]: any;
}

export const FirebaseProvider: FC = ({ children }) => {
  const auth = useAuth();

  const [firebaseContextState, setFirebaseContextState] = useState<{
    user: firebase.default.User | null;
    claims: claims | null;
  }>({
    user: null,
    claims: null,
  });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(({ claims }) => {
          setFirebaseContextState({
            user,
            claims,
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

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from 'react';
import { useAuth, useFirestore } from 'reactfire';
import { sendEmailVerification, User as AuthUser } from 'firebase/auth';
import Loading from 'src/components/Loading';

import NotificationContext from 'src/contexts/NotificationContext';
import User from '@common/types/User';
import { doc, onSnapshot } from 'firebase/firestore';

const FirebaseContext = createContext<{
  user: AuthUser | null;
  userDoc: User | null;
  claims: claims | null;
}>({
  user: null,
  userDoc: null,
  claims: null,
});

interface claims {
  [key: string]: any;
}

export const FirebaseProvider = ({ children }: any) => {
  const auth = useAuth();
  const firestore = useFirestore();

  const NotificationHandler = useContext(NotificationContext);

  const [firebaseContextState, setFirebaseContextState] = useState<{
    user: AuthUser | null;
    userDoc: User | null;
    claims: claims | null;
  }>({
    user: null,
    userDoc: null,
    claims: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoadedRef = useRef(false);
  isLoadedRef.current = isLoaded;

  useEffect(() => {
    let timeout = null as any;
    let authStateUnsubscribe = null as any;
    let docUnsubscribe = null as any;

    authStateUnsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsLoaded(false);
      if (user) {
        // Check if email is verified, and send email verification link if not
        if (!user.emailVerified) {
          const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
          };
          sendEmailVerification(user, actionCodeSettings)
            .then(() => {
              NotificationHandler.addNotification({
                message:
                  'Your email has not been verified. Please check your email and click the verification link.',
                severity: 'warning',
                timeout: 100000,
                position: {
                  horizontal: 'center',
                  vertical: 'top',
                },
              });
            })
            .catch((err) => {
              console.error(err);
              NotificationHandler.addNotification({
                message: `There was a problem verifying your email address: ${err}`,
                severity: 'error',
              });
            });
        }

        // The user's firestore document
        const userDocRef = doc(firestore, 'users', user.uid);

        docUnsubscribe = onSnapshot(userDocRef, async (snapshot) => {
          if (!isLoadedRef.current) {
            setFirebaseContextState({
              userDoc: (snapshot.data() as unknown as User) || null,
              claims: (await user.getIdTokenResult(true)).claims,
              user,
            });
            setIsLoaded(true);
            return;
          }

          // Wait for updateUser function to finish before reloading the user token
          timeout = setTimeout(async () => {
            await user.reload().then(async () => {
              const { claims } = await user.getIdTokenResult(true);
              setFirebaseContextState((state) => ({
                ...state,
                userDoc: (snapshot.data() as unknown as User) || null,
                claims,
              }));
            });
          }, 5000);
        });
      } else {
        setFirebaseContextState({
          user: null,
          userDoc: null,
          claims: null,
        });
        setIsLoaded(true);
      }
    });
    return () => {
      if (docUnsubscribe !== null) docUnsubscribe();
      if (timeout !== null) clearTimeout(timeout);
      if (authStateUnsubscribe !== null) authStateUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, firestore]);

  if (!isLoaded) {
    return <Loading />;
  }
  return (
    <FirebaseContext.Provider value={firebaseContextState}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;

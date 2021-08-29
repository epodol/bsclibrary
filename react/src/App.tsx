import React, { Suspense, useEffect } from 'react';
import {
  useFirebaseApp,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
  AuthProvider,
  useInitFirestore,
  useInitStorage,
  useInitAuth,
  useInitRemoteConfig,
  RemoteConfigProvider,
} from 'reactfire';

import {
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectAuthEmulator, initializeAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';
import { initializePerformance } from 'firebase/performance';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import { FirebaseProvider } from 'src/contexts/FirebaseContext';
import { NotificationProvider } from 'src/contexts/NotificationContext';

import MUITheme from 'src/contexts/MUITheme';
import Routing from 'src/components/Routing';
import Loading from 'src/components/Loading';

import 'bootstrap-css-only/css/bootstrap.min.css';
import 'src/index.css';

const isDev = process.env.NODE_ENV !== 'production';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const AppWithFirebase = () => {
  const app = useFirebaseApp();

  const { status: useInitFirestoreStatus, data: firestore } = useInitFirestore(
    async (firebaseApp) => {
      const firestoreInit = initializeFirestore(firebaseApp, {});
      if (isDev) connectFirestoreEmulator(firestoreInit, 'localhost', 8080);
      // await enableMultiTabIndexedDbPersistence(firestoreInit);
      return firestoreInit;
    }
  );

  const { status: useInitStorageStatus, data: storage } = useInitStorage(
    async (firebaseApp) => {
      const storageInit = getStorage(firebaseApp);
      if (isDev) connectStorageEmulator(storageInit, 'localhost', 9199);
      return storageInit;
    }
  );

  const { status: useInitAuthStatus, data: auth } = useInitAuth(
    async (firebaseApp) => {
      const authInit = initializeAuth(firebaseApp);
      console.log('innit');
      if (isDev) connectAuthEmulator(authInit, 'http://localhost:9099/');
      return authInit;
    }
  );

  const { status: useInitRemoteConfigStatus, data: remoteConfig } =
    useInitRemoteConfig(async (firebaseApp) => {
      const remoteConfigInit = getRemoteConfig(firebaseApp);
      remoteConfigInit.settings = {
        minimumFetchIntervalMillis: 10000,
        fetchTimeoutMillis: 10000,
      };

      remoteConfigInit.defaultConfig = {
        home_banner_enabled: false,
        home_banner_severity: 'success',
        home_banner_title: 'Welcome to the BASIS Scottsdale Library!',
        home_banner_title_enabled: false,
        home_banner_message: 'Coming 2021',
        home_banner_button_enabled: false,
        home_banner_button_text: 'View the Website',
        home_banner_button_href: 'https://bsclibrary.net',
        home_banner_icon_enabled: false,
      } as any;

      if (!isDev) await fetchAndActivate(remoteConfigInit);
      return remoteConfigInit;
    });

  const functions = getFunctions(app, 'us-west2');

  if (isDev) {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }

  useEffect(() => {
    {
      if (!isDev && process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY) {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(
            process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY
          ),
          isTokenAutoRefreshEnabled: true,
        });
        initializePerformance(app, {});
      }
    }
  }, [app]);

  if (
    useInitFirestoreStatus === 'loading' ||
    useInitStorageStatus === 'loading' ||
    useInitAuthStatus === 'loading' ||
    useInitRemoteConfigStatus === 'loading'
  )
    return <Loading />;
  return (
    <ThemeProvider theme={MUITheme}>
      <CssBaseline />
      <NotificationProvider>
        <FirestoreProvider sdk={firestore}>
          <StorageProvider sdk={storage}>
            <AuthProvider sdk={auth}>
              <RemoteConfigProvider sdk={remoteConfig}>
                <FirebaseProvider>
                  <Suspense fallback={<Loading />}>
                    <Routing />
                  </Suspense>
                </FirebaseProvider>
              </RemoteConfigProvider>
            </AuthProvider>
          </StorageProvider>
        </FirestoreProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

const App = () => (
  <Suspense fallback={<Loading />}>
    <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
      <AppWithFirebase />
    </FirebaseAppProvider>
  </Suspense>
);

export default App;

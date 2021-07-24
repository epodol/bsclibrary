import React, { Suspense, useEffect, useState } from 'react';
import {
  useFirebaseApp,
  preloadFirestore,
  preloadAuth,
  preloadFunctions,
  preloadStorage,
  preloadRemoteConfig,
  preloadAnalytics,
  preloadPerformance,
  FirebaseAppProvider,
} from 'reactfire';
import 'firebase/app-check';
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

const preloadSDKs = (firebaseApp: any) => {
  const preloads: any[] = [
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        return isDev ? firestore().useEmulator('localhost', 8080) : undefined;
      },
      suspense: true,
    }),
    preloadStorage({
      firebaseApp,
      setup(storage) {
        if (isDev) storage().useEmulator('localhost', 9199);
        return storage().setMaxUploadRetryTime(10000);
      },
      suspense: true,
    }),
    preloadAuth({
      firebaseApp,
      setup(auth) {
        return isDev ? auth().useEmulator('http://localhost:9099/') : undefined;
      },
      suspense: true,
    }),
    preloadFunctions({
      firebaseApp,
      async setup(functions) {
        if (isDev) return functions('us-west2').useEmulator('localhost', 5001);
        return functions('us-west2');
      },
      suspense: true,
    }),
  ];

  if (!isDev) {
    preloads.push(
      preloadRemoteConfig({
        firebaseApp,
        setup(remoteConfig) {
          // eslint-disable-next-line no-param-reassign
          remoteConfig().settings = {
            minimumFetchIntervalMillis: 10000,
            fetchTimeoutMillis: 10000,
          };
          remoteConfig().fetchAndActivate();
        },
        suspense: true,
      })
    );

    preloads.push(
      preloadAnalytics({
        firebaseApp,
        setup(analytics) {
          analytics();
        },
        suspense: true,
      })
    );

    preloads.push(
      preloadPerformance({
        firebaseApp,
        setup(performance) {
          performance();
        },
        suspense: true,
      })
    );
  }

  return Promise.all(preloads);
};

const AppWithFirebase = () => {
  const [loading, setLoading] = useState(true);
  const firebaseApp = useFirebaseApp();

  const appCheck = !isDev ? firebaseApp.appCheck() : null;

  useEffect(() => {
    if (!isDev && process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY)
      appCheck?.activate(process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY);
  }, [appCheck]);

  preloadSDKs(firebaseApp).then(() => setLoading(false));

  if (loading) return <Loading />;
  return (
    <ThemeProvider theme={MUITheme}>
      <CssBaseline />
      <NotificationProvider>
        <FirebaseProvider>
          <Suspense fallback={<Loading />}>
            <Routing />
          </Suspense>
        </FirebaseProvider>
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

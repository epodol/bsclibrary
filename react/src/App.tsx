import React, { Suspense, useEffect, useState } from 'react';

import {
  useFirebaseApp,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
  AuthProvider,
} from 'reactfire';

import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

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

//     preloadFunctions({
//       firebaseApp,
//       async setup(functions) {
//         if (isDev) functions('us-west2').useEmulator('localhost', 5001);
//         functions('us-west2');
//       },
//       suspense: true,
//     }),
//     preloadRemoteConfig({
//       firebaseApp,
//       setup(remoteConfig) {
//         // eslint-disable-next-line no-param-reassign
//         remoteConfig().settings = {
//           minimumFetchIntervalMillis: 10000,
//           fetchTimeoutMillis: 10000,
//         };
//         if (!isDev) remoteConfig().fetchAndActivate();
//         // eslint-disable-next-line no-param-reassign
//         remoteConfig().defaultConfig = {
//           home_banner_enabled: false,
//           home_banner_severity: 'success',
//           home_banner_title: 'Welcome to the BASIS Scottsdale Library!',
//           home_banner_title_enabled: false,
//           home_banner_message: 'Coming 2021',
//           home_banner_button_enabled: false,
//           home_banner_button_text: 'View the Website',
//           home_banner_button_href: 'https://bsclibrary.net',
//           home_banner_icon_enabled: false,
//         } as any;
//       },
//       suspense: true,
//     }),
//   ];

//   if (!isDev) {
//     preloads.push(
//       preloadAnalytics({
//         firebaseApp,
//         setup(analytics) {
//           analytics();
//         },
//         suspense: true,
//       })
//     );

//     preloads.push(
//       preloadPerformance({
//         firebaseApp,
//         setup(performance) {
//           performance();
//         },
//         suspense: true,
//       })
//     );
//   }

//   return Promise.all(preloads);
// };

const AppWithFirebase = () => {
  const [loading] = useState(true);
  const app = useFirebaseApp();

  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const functions = getFunctions(app, 'us-west2');

  if (isDev) {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectAuthEmulator(auth, 'http://localhost:9099/');
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }

  useEffect(() => {
    if (!isDev && process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY)
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
          process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY
        ),
        isTokenAutoRefreshEnabled: true,
      });
  }, [app]);

  if (loading) return <Loading />;
  return (
    <ThemeProvider theme={MUITheme}>
      <CssBaseline />
      <NotificationProvider>
        <FirestoreProvider sdk={firestore}>
          <StorageProvider sdk={storage}>
            <AuthProvider sdk={auth}>
              <FirebaseProvider>
                <Suspense fallback={<Loading />}>
                  <Routing />
                </Suspense>
              </FirebaseProvider>
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

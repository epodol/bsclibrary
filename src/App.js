import React, { Suspense, useEffect } from 'react';
import {
  useFirebaseApp,
  useAuth,
  preloadFirestore,
  preloadAuth,
  preloadFunctions,
  preloadStorage,
  preloadRemoteConfig,
  preloadAnalytics,
  preloadPerformance,
  preloadUser,
} from 'reactfire';
import 'firebase/app-check';
import Routing from './components/Routing';

import Loading from './components/Loading';
import { FirebaseProvider } from './components/Firebase';

const isDev = process.env.NODE_ENV !== 'production';

const preloadSDKs = (firebaseApp) => {
  const preloads = [
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        if (isDev) firestore().useEmulator('localhost', 8080);
        return firestore().enablePersistence({ synchronizeTabs: true });
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
      suspense: true,
    }),
    preloadFunctions({
      firebaseApp,
      setup(functions) {
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

const App = () => {
  const firebaseApp = useFirebaseApp();

  const auth = useAuth();
  if (isDev) {
    auth.useEmulator('http://localhost:9099/');
  }

  const appCheck = !isDev ? firebaseApp.appCheck() : null;

  useEffect(() => {
    if (!isDev) appCheck.activate(process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY);
  });

  preloadSDKs(firebaseApp);

  preloadUser({ firebaseApp });

  return (
    <FirebaseProvider>
      <Suspense fallback={<Loading />}>
        <Routing />
      </Suspense>
    </FirebaseProvider>
  );
};

export default App;

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
        return null;
        // return firestore().enablePersistence({ synchronizeTabs: true });
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
        return isDev ? functions().useEmulator('localhost', 5001) : null;
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
          return remoteConfig().fetchAndActivate();
        },
        suspense: true,
      })
    );

    preloads.push(preloadAnalytics({ firebaseApp, suspense: true }));

    preloads.push(preloadPerformance({ firebaseApp, suspense: true }));
  }

  return Promise.all(preloads);
};

const App = () => {
  const firebaseApp = useFirebaseApp();

  const auth = useAuth();
  if (isDev) {
    auth.useEmulator('http://localhost:9099/');
  }

  // const appCheck = firebaseApp.appCheck();

  useEffect(() => {
    // appCheck.activate('6LcS7NwaAAAAAP3RJKNPoCgHiF9CjfJC6dWr7D9d');
    // appcheck
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

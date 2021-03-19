import React, { Suspense } from 'react';
import {
  useFirebaseApp,
  useAuth,
  preloadFirestore,
  preloadAuth,
  preloadFunctions,
  preloadUser,
} from 'reactfire';
import Routing from './components/Routing';

import Loading from './components/Loading';
import { FirebaseProvider } from './components/Firebase';

const isDev = process.env.NODE_ENV !== 'production';

const preloadSDKs = (firebaseApp) => {
  return Promise.all([
    preloadFirestore({
      firebaseApp,
      setup(firestore) {
        if (isDev) firestore().useEmulator('localhost', 8080);
        return firestore().enablePersistence({ synchronizeTabs: true });
      },
      suspense: true,
    }),
    // preloadStorage({
    //   firebaseApp,
    //   setup(storage) {
    //     return storage().setMaxUploadRetryTime(10000);
    //   },
    //   suspense: true,
    // }),
    preloadAuth({
      firebaseApp,
      suspense: true,
    }),
    // preloadRemoteConfig({
    //   firebaseApp,
    //   setup(remoteConfig) {
    //     if (!isDev) {
    //       // eslint-disable-next-line no-param-reassign
    //       remoteConfig().settings = {
    //         minimumFetchIntervalMillis: 10000,
    //         fetchTimeoutMillis: 10000,
    //       };
    //       return remoteConfig().fetchAndActivate();
    //     }
    //     return null;
    //   },
    //   suspense: true,
    // }),
    preloadFunctions({
      firebaseApp,
      setup(functions) {
        return isDev ? functions().useEmulator('localhost', 5001) : null;
      },
      suspense: true,
    }),
  ]);
};

const App = () => {
  const firebaseApp = useFirebaseApp();

  const auth = useAuth();
  if (isDev) {
    auth.useEmulator('http://localhost:9099/');
  }

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

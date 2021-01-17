import React, { Suspense } from 'react';
import { FirebaseAppProvider } from 'reactfire';
import Routing from './components/Routing';

import { FirebaseProvider } from './components/Firebase';
import Loading from './components/Loading';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const App = () => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
    <Suspense fallback={<Loading />}>
      <FirebaseProvider>
        <Suspense fallback={<Loading />}>
          <Routing />
        </Suspense>
      </FirebaseProvider>
    </Suspense>
  </FirebaseAppProvider>
);

export default App;

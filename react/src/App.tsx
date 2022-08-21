import React, { Suspense, Component, useEffect, useContext } from 'react';
import {
  useFirebaseApp,
  useInitFirestore,
  useInitFunctions,
  useInitStorage,
  useInitAuth,
  useInitRemoteConfig,
  FirebaseAppProvider,
  FirestoreProvider,
  FunctionsProvider,
  StorageProvider,
  AuthProvider,
  RemoteConfigProvider,
  useSigninCheck,
  useUser,
} from 'reactfire';

import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
} from 'firebase/storage';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  Functions,
  connectFunctionsEmulator,
  getFunctions,
} from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  RemoteConfig,
  fetchAndActivate,
  getRemoteConfig,
} from 'firebase/remote-config';
import { getPerformance } from 'firebase/performance';
import { getAnalytics } from 'firebase/analytics';

import CssBaseline from '@mui/material/CssBaseline';

import { NotificationProvider } from 'src/contexts/NotificationContext';
import ActiveLibraryID, {
  ActiveLibraryIDProvider,
} from 'src/contexts/ActiveLibraryID';

import { ThemeContextProvider } from 'src/contexts/MUITheme';
import Routing from 'src/components/Routing';
import Loading from 'src/components/Loading';

import 'bootstrap-css-only/css/bootstrap.min.css';
import 'src/index.css';

import HomeRouting from 'src/components/Routing/HomeRouting';
import JoinLibrary from './pages/JoinLibrary';

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

const useInitFirebaseSDKs = (): {
  loading: boolean;
  auth: Auth | null;
  firestore: Firestore | null;
  functions: Functions | null;
  storage: FirebaseStorage | null;
  remoteConfig: RemoteConfig | null;
} => {
  const { status: useInitFirestoreStatus, data: firestore } = useInitFirestore(
    async (firebaseApp) => {
      const firestoreInit = getFirestore(firebaseApp);
      if (isDev) connectFirestoreEmulator(firestoreInit, 'localhost', 8080);
      return firestoreInit;
    },
    { suspense: false }
  );

  const { status: useInitFunctionsStatus, data: functions } = useInitFunctions(
    async (firebaseApp) => {
      const functionsInit = getFunctions(firebaseApp, 'us-west2');
      if (isDev) connectFunctionsEmulator(functionsInit, 'localhost', 5001);
      return functionsInit;
    },
    { suspense: false }
  );

  const { status: useInitStorageStatus, data: storage } = useInitStorage(
    async (firebaseApp) => {
      const storageInit = getStorage(firebaseApp);
      if (isDev) connectStorageEmulator(storageInit, 'localhost', 9199);
      return storageInit;
    },
    { suspense: false }
  );

  const { status: useInitAuthStatus, data: auth } = useInitAuth(
    async (firebaseApp) => {
      const authInit = getAuth(firebaseApp);
      if (isDev)
        connectAuthEmulator(authInit, 'http://localhost:9099/', {
          disableWarnings: true,
        });
      return authInit;
    },
    { suspense: false }
  );

  const { status: useInitRemoteConfigStatus, data: remoteConfig } =
    useInitRemoteConfig(
      async (firebaseApp) => {
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

        if (!isDev)
          await fetchAndActivate(remoteConfigInit).catch(console.error);
        return remoteConfigInit;
      },
      { suspense: false }
    );

  const app = useFirebaseApp();

  useEffect(() => {
    if (!isDev) {
      if (process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY)
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(
            process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY
          ),
          isTokenAutoRefreshEnabled: true,
        });
      getAnalytics(app);
      getPerformance(app);
    }
  }, [app]);

  if (
    useInitFirestoreStatus === 'loading' ||
    useInitFunctionsStatus === 'loading' ||
    useInitStorageStatus === 'loading' ||
    useInitAuthStatus === 'loading' ||
    useInitRemoteConfigStatus === 'loading'
  )
    return {
      loading: true,
      auth: null,
      firestore: null,
      functions: null,
      storage: null,
      remoteConfig: null,
    };
  return {
    loading: false,
    auth,
    firestore,
    functions,
    storage,
    remoteConfig,
  };
};

const AppWithFirebase = () => {
  const { auth, firestore, functions, storage, remoteConfig } =
    useInitFirebaseSDKs();

  if (
    auth === null ||
    firestore === null ||
    functions === null ||
    storage === null ||
    remoteConfig === null
  )
    return <Loading />;

  return (
    <ThemeContextProvider>
      <CssBaseline />
      <NotificationProvider>
        <Suspense fallback={<Loading />}>
          <AuthProvider sdk={auth}>
            <FirestoreProvider sdk={firestore}>
              <FunctionsProvider sdk={functions}>
                <StorageProvider sdk={storage}>
                  <RemoteConfigProvider sdk={remoteConfig}>
                    <ActiveLibraryIDProvider>
                      <Suspense fallback={<Loading />}>
                        <HomePageAuthCheck />
                      </Suspense>
                    </ActiveLibraryIDProvider>
                  </RemoteConfigProvider>
                </StorageProvider>
              </FunctionsProvider>
            </FirestoreProvider>
          </AuthProvider>
        </Suspense>
      </NotificationProvider>
    </ThemeContextProvider>
  );
};

const HomePageAuthCheck = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID');
  const user = useUser().data;
  const signInCheckResult = useSigninCheck({
    forceRefresh: true,
    validateCustomClaims: () => ({ hasRequiredClaims: true, errors: {} }),
  }).data;

  // User is signed in
  if (signInCheckResult.signedIn === true) {
    // Workaround for reactfire bug: https://github.com/FirebaseExtended/reactfire/issues/495
    if (!user) return <Loading />;
    if (activeLibraryID)
      return (
        <Suspense fallback={<Loading />}>
          <Routing />
        </Suspense>
      );
    return <JoinLibrary />;
  }

  // User is not signed in
  return <HomeRouting />;
};

// Have to use class because componentDidCatch is not supported in hooks
class ErrorBoundary extends Component {
  constructor(props: {}) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });

    console.error(error);
    console.error(errorInfo);
    // Log error messages to an error reporting service here
  }

  render() {
    const { error, errorInfo } = this.state as any;
    const { children } = this.props as any;

    if (errorInfo) {
      return (
        <div style={{ margin: '4rem' }}>
          <h1
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            Something went wrong.
          </h1>
          <br />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <details style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}>
              <div style={{ cursor: 'auto' }}>
                <h3>{error && error.toString()}</h3>
                <br />
                {errorInfo.componentStack}
              </div>
            </details>
          </div>
          <br />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <a
              href="https://github.com/epodol/bsclibrary/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Think you found a bug? Please open a new issue in our GitHub Repo:
              https://github.com/epodol/bsclibrary
            </a>
          </div>
        </div>
      );
    }
    return children;
  }
}

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<Loading />}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
        <Suspense fallback={<Loading />}>
          <AppWithFirebase />
        </Suspense>
      </FirebaseAppProvider>
    </Suspense>
  </ErrorBoundary>
);

export default App;

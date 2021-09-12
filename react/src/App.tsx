import React, { Suspense, useEffect, Component } from 'react';
import {
  useFirebaseApp,
  useInitFirestore,
  useInitStorage,
  useInitAuth,
  useInitRemoteConfig,
  useInitAppCheck,
  useInitAnalytics,
  useInitPerformance,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
  AuthProvider,
  RemoteConfigProvider,
} from 'reactfire';

import {
  Firestore,
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
} from 'firebase/storage';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  // Functions,
  connectFunctionsEmulator,
  getFunctions,
} from 'firebase/functions';
import {
  AppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from 'firebase/app-check';
import {
  RemoteConfig,
  fetchAndActivate,
  getRemoteConfig,
} from 'firebase/remote-config';
import { FirebasePerformance, getPerformance } from 'firebase/performance';
import { Analytics, getAnalytics } from 'firebase/analytics';

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

const useInitFirebaseSDKs = (): {
  loading: boolean;
  SDKs: {
    analytics: Analytics | null;
    appCheck: AppCheck | null;
    auth: Auth;
    firestore: Firestore;
    // functions: Functions;
    performance: FirebasePerformance | null;
    storage: FirebaseStorage;
    remoteConfig: RemoteConfig;
  } | null;
} => {
  const { status: useInitFirestoreStatus, data: firestore } = useInitFirestore(
    async (firebaseApp) => {
      const firestoreInit = initializeFirestore(firebaseApp, {});
      if (isDev) connectFirestoreEmulator(firestoreInit, 'localhost', 8080);
      return firestoreInit;
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

        if (!isDev) await fetchAndActivate(remoteConfigInit);
        return remoteConfigInit;
      },
      { suspense: false }
    );

  const { status: useInitAppCheckStatus, data: appCheck } = useInitAppCheck(
    async (firebaseApp) => {
      if (isDev || !process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY)
        return null as any;
      const appCheckInit = initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(
          process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY
        ),
        isTokenAutoRefreshEnabled: true,
      });
      return appCheckInit;
    },
    { suspense: false }
  );

  const { status: useInitAnalyticsStatus, data: analytics } = useInitAnalytics(
    async (firebaseApp) => {
      if (isDev) return null as any;
      const analyticsInit = getAnalytics(firebaseApp);
      return analyticsInit;
    },
    { suspense: false }
  );

  const { status: useInitPerformanceStatus, data: performance } =
    useInitPerformance(
      async (firebaseApp) => {
        if (isDev) return null as any;
        const performanceInit = getPerformance(firebaseApp);
        return performanceInit;
      },
      { suspense: false }
    );

  const app = useFirebaseApp();

  useEffect(() => {
    const functions = getFunctions(app, 'us-west2');

    if (isDev) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }
  });

  if (
    useInitFirestoreStatus === 'loading' ||
    useInitStorageStatus === 'loading' ||
    useInitAuthStatus === 'loading' ||
    useInitRemoteConfigStatus === 'loading' ||
    useInitAppCheckStatus === 'loading' ||
    useInitAnalyticsStatus === 'loading' ||
    useInitPerformanceStatus === 'loading'
  )
    return { loading: true, SDKs: null };
  return {
    loading: false,
    SDKs: {
      firestore,
      storage,
      auth,
      remoteConfig,
      appCheck,
      analytics,
      performance,
    },
  };
};

const AppWithFirebase = () => {
  const { loading, SDKs } = useInitFirebaseSDKs();
  if (loading || SDKs === null) return <Loading />;

  return (
    <ThemeProvider theme={MUITheme}>
      <CssBaseline />
      <NotificationProvider>
        <FirestoreProvider sdk={SDKs.firestore}>
          <StorageProvider sdk={SDKs.storage}>
            <AuthProvider sdk={SDKs.auth}>
              <RemoteConfigProvider sdk={SDKs.remoteConfig}>
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

// Have to use class because componentDidCatch is not supported in hooks
class ErrorBoundary extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    console.error(error);
    console.error(errorInfo);
    console.trace();
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            Something went wrong.
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
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
              href="https://github.com/epodol/bsclibrary"
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
    // Normally, just render children
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<Loading />}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense>
        <AppWithFirebase />
      </FirebaseAppProvider>
    </Suspense>
  </ErrorBoundary>
);

export default App;

import React, { lazy, Suspense, useContext, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useFirebaseApp, useSigninCheck } from 'reactfire';
import { getAnalytics, logEvent } from 'firebase/analytics';

import Loading from 'src/components/Loading';

import Navigation from 'src/components/Navigation';
import NotificationContext from 'src/contexts/NotificationContext';

const Home = lazy(() => import('src/pages/Home'));
const Account = lazy(() => import('src/pages/Account'));

const Contribute = lazy(() => import('src/pages/Contribute'));
const About = lazy(() => import('src/pages/About'));

const Footer = lazy(() => import('src/components/Footer'));

const isDev = process.env.NODE_ENV !== 'production';

const DocumentTitle = ({
  title,
  children,
}: {
  title: string;
  children: any;
}) => {
  const app = useFirebaseApp();
  const location = useLocation();
  useEffect(() => {
    if (!isDev) {
      const analytics = getAnalytics(app);
      logEvent(analytics, 'page_view', { page_location: location.pathname });
    }
    document.title = title;
    return () => {
      document.title = 'Modern Library Management System';
    };
  }, [title, app, location.pathname]);
  return children;
};

const HomeRouting = () => {
  const NotificationHandler = useContext(NotificationContext);

  const signinCheck = useSigninCheck().data;

  const UnknownPage = () => {
    useEffect(() => {
      NotificationHandler.addNotification({
        message: 'The page you are looking for does not exist.',
        severity: 'warning',
        timeout: 10000,
        position: {
          horizontal: 'center',
          vertical: 'top',
        },
      });
      console.warn('The page you are looking for does not exist.');
    }, []);
    return <Navigate to="/" />;
  };

  return (
    <div className="page">
      <BrowserRouter>
        <main>
          <div className="content">
            <Navigation />

            <Suspense fallback={<Loading />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <DocumentTitle title="BASIS Scottsdale Library">
                      <Home />
                    </DocumentTitle>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <DocumentTitle title="About – BASIS Scottsdale Library">
                      <About />
                    </DocumentTitle>
                  }
                />
                <Route
                  path="/contribute"
                  element={
                    <DocumentTitle title="Contribute – BASIS Scottsdale Library">
                      <Contribute />
                    </DocumentTitle>
                  }
                />
                {signinCheck.signedIn && (
                  <>
                    <Route
                      path="/account"
                      element={
                        <Suspense fallback={<Loading />}>
                          <DocumentTitle title="Account – BASIS Scottsdale Library">
                            <Account />
                          </DocumentTitle>
                        </Suspense>
                      }
                    />
                  </>
                )}
                <Route element={<UnknownPage />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default HomeRouting;

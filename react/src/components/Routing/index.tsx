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

const Users = lazy(() => import('src/pages/Users'));
const DisplayUser = lazy(() => import('src/pages/Users/DisplayUser'));
const Books = lazy(() => import('src/pages/Books'));
const DisplayBook = lazy(() => import('src/pages/Books/DisplayBook'));
const CheckOut = lazy(() => import('src/pages/CheckOut'));
const CheckIn = lazy(() => import('src/pages/CheckIn'));
const CheckOuts = lazy(() => import('src/pages/CheckOuts'));
const CheckOutDialog = lazy(() => import('src/pages/CheckOuts/CheckoutDialog'));
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
      document.title = 'BASIS Scottsdale Library';
    };
  }, [title, app, location.pathname]);
  return children;
};

const ProtectedRoute = ({
  Component,
  permission,
  title,
}: {
  Component: any;
  permission: string;
  title?: string;
}) => {
  const NotificationHandler = useContext(NotificationContext);

  const signInCheck = useSigninCheck({
    suspense: true,
    validateCustomClaims: (claims: any) => {
      if (claims.permissions[permission] !== true) {
        NotificationHandler.addNotification({
          message: 'You do not have permission to view this page.',
          severity: 'warning',
          timeout: 10000,
          position: {
            horizontal: 'center',
            vertical: 'top',
          },
        });
      }
      return {
        hasRequiredClaims: claims.permissions[permission] === true,
        errors: {},
      };
    },
  }).data;

  if (!signInCheck.hasRequiredClaims) return <Navigate to="/" />;

  return title ? (
    <DocumentTitle title={title}>
      <Component />
    </DocumentTitle>
  ) : (
    <Component />
  );
};

const Routing = () => {
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
                    <Route
                      path="/books"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={Books}
                            permission="VIEW_BOOKS"
                            title="Books – BASIS Scottsdale Library"
                          />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/books/:id"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={DisplayBook}
                            permission="VIEW_BOOKS"
                            title="View Book – BASIS Scottsdale Library"
                          />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={CheckOut}
                            permission="CHECK_OUT"
                            title="Check Out – BASIS Scottsdale Library"
                          />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/checkin"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={CheckIn}
                            permission="CHECK_IN"
                            title="Check In – BASIS Scottsdale Library"
                          />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/checkouts"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={CheckOuts}
                            permission="MANAGE_CHECKOUTS"
                            title="Manage Checkouts – BASIS Scottsdale Library"
                          />
                        </Suspense>
                      }
                    >
                      <Route
                        path="/checkouts/:id"
                        element={
                          <Suspense fallback={<Loading />}>
                            <ProtectedRoute
                              Component={CheckOutDialog}
                              permission="MANAGE_CHECKOUTS"
                              title="Manage Checkouts – BASIS Scottsdale Library"
                            />
                          </Suspense>
                        }
                      />
                    </Route>
                    <Route
                      path="/users"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={Users}
                            permission="MANAGE_USERS"
                            title="Users – BASIS Scottsdale Library"
                          />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/users/:id"
                      element={
                        <Suspense fallback={<Loading />}>
                          <ProtectedRoute
                            Component={DisplayUser}
                            permission="MANAGE_USERS"
                            title="Display User – BASIS Scottsdale Library"
                          />
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

export default Routing;

import React, { lazy, Suspense, useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useSigninCheck } from 'reactfire';

import Loading from 'src/components/Loading';

import Navigation from 'src/components/Navigation';
import NotificationContext from 'src/contexts/NotificationContext';

const Home = lazy(() => import('src/components/Home'));
const Account = lazy(() => import('src/components/Account'));

const Contribute = lazy(() => import('src/components/Contribute'));
const About = lazy(() => import('src/components/About'));

const Users = lazy(() => import('src/components/Users'));
const DisplayUser = lazy(() => import('src/components/Users/DisplayUser'));
const Books = lazy(() => import('src/components/Books'));
const DisplayBook = lazy(() => import('src/components/Books/DisplayBook'));
const CheckOut = lazy(() => import('src/components/CheckOut'));
const CheckIn = lazy(() => import('src/components/CheckIn'));
const CheckOuts = lazy(() => import('src/components/CheckOuts'));
const Footer = lazy(() => import('src/components/Footer'));

const ProtectedRoute = ({
  Component,
  permission,
}: {
  Component: any;
  permission: string;
}) => {
  const NotificationHandler = useContext(NotificationContext);

  const signInCheck = useSigninCheck({
    suspense: true,
    validateCustomClaims: (claims) => {
      if (claims.data.claims.permissions[permission] !== true) {
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
        hasRequiredClaims: claims.data.claims.permissions[permission] === true,
        errors: {},
      };
    },
  }).data;

  return signInCheck.hasRequiredClaims ? <Component /> : <Redirect to="/" />;
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
    return <Redirect to="/" exact />;
  };

  return (
    <div className="page">
      <Router>
        <main>
          <div className="content">
            <Navigation />

            <Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path="/">
                  {signinCheck.signedIn && <Account />}
                  {!signinCheck.signedIn && <Home />}
                </Route>
                <Route exact path="/about">
                  <About />
                </Route>
                <Route exact path="/contribute">
                  <Contribute />
                </Route>
                {signinCheck.signedIn && (
                  <Switch>
                    <Route path="/books" exact>
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={Books}
                          permission="VIEW_BOOKS"
                        />
                      </Suspense>
                    </Route>
                    <Route path="/books/:id">
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={DisplayBook}
                          permission="VIEW_BOOKS"
                        />
                      </Suspense>
                    </Route>
                    <Route path="/checkout">
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={CheckOut}
                          permission="CHECK_OUT"
                        />
                      </Suspense>
                    </Route>
                    <Route path="/checkin">
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={CheckIn}
                          permission="CHECK_IN"
                        />
                      </Suspense>
                    </Route>
                    <Route path="/checkouts/:id?">
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={CheckOuts}
                          permission="MANAGE_CHECKOUTS"
                        />
                      </Suspense>
                    </Route>
                    <Route path="/users" exact>
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={Users}
                          permission="MANAGE_USERS"
                        />
                      </Suspense>
                    </Route>
                    <Route path="/users/:id">
                      <Suspense fallback={<Loading />}>
                        <ProtectedRoute
                          Component={DisplayUser}
                          permission="MANAGE_USERS"
                        />
                      </Suspense>
                    </Route>
                    <UnknownPage />
                  </Switch>
                )}
                {!signinCheck.signedIn && <UnknownPage />}
              </Switch>
            </Suspense>
          </div>
        </main>
        <div className="mt-auto py-3">
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default Routing;

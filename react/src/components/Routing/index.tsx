import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { AuthCheck, useIdTokenResult, useUser } from 'reactfire';

import Loading from 'src/components/Loading';
import Contribute from 'src/components/Contribute';
import About from 'src/components/About';

import Navigation from 'src/components/Navigation';
import Home from 'src/components/Home';
import Account from 'src/components/Account';
import Users from 'src/components/Users';
import DisplayUser from 'src/components/Users/DisplayUser';
import Books from 'src/components/Books';
import DisplayBook from 'src/components/Books/DisplayBook';
import CheckOut from 'src/components/CheckOut';
import CheckIn from 'src/components/CheckIn';
import CheckOuts from 'src/components/CheckOuts';
import Footer from 'src/components/Footer';

import { NotificationProvider } from 'src/contexts/NotificationContext';

const Routing = () => {
  const user = useUser().data;

  const ProtectedRoute = ({
    Component,
    permission,
  }: {
    Component: any;
    permission: string;
  }) => {
    const claims = useIdTokenResult(user, true);
    return claims.data.claims.permissions[permission] === true ? (
      <Component />
    ) : (
      <Redirect to="/" />
    );
  };

  return (
    <div className="page">
      <Router>
        <main>
          <div className="content">
            <Navigation />

            <Switch>
              <Route exact path="/">
                <AuthCheck fallback={<Home />}>
                  <Account />
                </AuthCheck>
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/contribute">
                <Contribute />
              </Route>
              <NotificationProvider>
                <AuthCheck fallback={<Redirect to="/" exact />}>
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
                    <Route path="/checkouts">
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
                    <Redirect to="/" exact />
                  </Switch>
                </AuthCheck>
              </NotificationProvider>
            </Switch>
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

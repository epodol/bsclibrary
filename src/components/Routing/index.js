import React, { Suspense } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { AuthCheck, useIdTokenResult, useUser } from 'reactfire';

import Loading from '../Loading';
import Contribute from '../Contribute';
import About from '../About';

import Navigation from '../Navigation';
import Home from '../Home';
import Account from '../Account';
import Users from '../Users';
import DisplayUser from '../Users/DisplayUser';
import Books from '../Books';
import DisplayBook from '../Books/DisplayBook';
import CheckOut from '../CheckOut';
import CheckIn from '../CheckIn';
import CheckOuts from '../CheckOuts';
import Footer from '../Footer';

import './routing.css';

const Routing = () => {
  const user = useUser().data;

  const ProtectedRoute = ({ Component, permission }) => {
    const claims = useIdTokenResult(user, true);
    return claims.data.claims.permissions[permission] === true ? (
      <Component />
    ) : (
      <Redirect to="/" />
    );
  };

  return (
    <div className="page cloudy-knoxville-gradient">
      <Router>
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

            <AuthCheck fallback={<Redirect to="/" exact />}>
              <Switch>
                <Route path="/books" exact>
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute Component={Books} permission="VIEW_BOOKS" />
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
                    <ProtectedRoute Component={CheckIn} permission="CHECK_IN" />
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
          </Switch>
        </div>

        <div className="mt-auto py-3">
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default Routing;

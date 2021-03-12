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
import MyAccount from '../MyAccount';
import Admin from '../Admin';
import Books from '../Books';
import DisplayBook from '../Books/DisplayBook';
import CheckOut from '../CheckOut';
import CheckIn from '../CheckIn';
import CheckOuts from '../CheckOuts';
import Footer from '../Footer';

import './routing.css';

const Routing = () => {
  const user = useUser().data;

  const ProtectedRoute = ({ Component, minRole }) => {
    const claims = useIdTokenResult(user, true);
    return claims.data.claims.role >= minRole ? (
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
                <MyAccount />
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
                    <ProtectedRoute Component={Books} minRole="100" />
                  </Suspense>
                </Route>
                <Route path="/books/:id">
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute Component={DisplayBook} minRole="100" />
                  </Suspense>
                </Route>
                <Route path="/checkout">
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute Component={CheckOut} minRole="300" />
                  </Suspense>
                </Route>
                <Route path="/checkin">
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute Component={CheckIn} minRole="300" />
                  </Suspense>
                </Route>
                <Route path="/checkouts">
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute Component={CheckOuts} minRole="500" />
                  </Suspense>
                </Route>
                <Route path="/admin">
                  <Suspense fallback={<Loading />}>
                    <ProtectedRoute Component={Admin} minRole="1000" />
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

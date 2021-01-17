import React, { Suspense } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { AuthCheck, useIdTokenResult, useUser } from 'reactfire';

import Loading from '../Loading';

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
                <Route path="/checkout" minrole="300">
                  <CheckOut />
                </Route>
                <Route path="/checkin" minrole="300">
                  <CheckIn />
                </Route>
                <Route path="/checkouts" minrole="500">
                  <CheckOuts />
                </Route>
                <Route path="/admin" minrole="1000">
                  <Admin />
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

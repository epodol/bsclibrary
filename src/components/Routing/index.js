import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Navigation from '../Navigation';
import Home from '../Home';
import MyAccount from '../Account';
import SchoolAdmin from '../SchoolAdmin';
import LibraryAdmin from '../LibraryAdmin';
import Books from '../Books'
import CheckOut from '../CheckOut';
import CheckIn from '../CheckIn';
import CheckOuts from '../CheckOuts';
import Error404 from '../Errors';
import Footer from "../Footer";

const Routing = () => (
    <Router>
        <div>
            <Navigation/>

            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/myaccount">
                    <MyAccount />
                </Route>
                <Route path="/school-admin">
                    <SchoolAdmin />
                </Route>
                <Route path="/library-admin">
                    <LibraryAdmin />
                </Route>
                <Route path="/books">
                    <Books />
                </Route>
                <Route path="/checkout">
                    <CheckOut />
                </Route>
                <Route path="/checkin">
                    <CheckIn />
                </Route>
                <Route path="/checkouts">
                    <CheckOuts />
                </Route>
                <Route path="*">
                    <Error404/>
                </Route>
            </Switch>

            <Footer />
        </div>
    </Router>
);

export default Routing;
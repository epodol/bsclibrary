import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import Navigation from '../Navigation';
import Home from '../Home';
import MyAccount from '../MyAccount';
import Admin from '../Admin';
import Books from '../Books'
import CheckOut from '../CheckOut';
import CheckIn from '../CheckIn';
import CheckOuts from '../CheckOuts';
import Footer from "../Footer";

import './routing.css'
import { useFirebaseContext } from "../../Firebase/FirebaseContext"

const Routing = () => {

    const firebaseState = useFirebaseContext()

    console.log('routing......', firebaseState.userInfo)

    const DetermineHomePage = ({component: Component, ...rest}) => {
        return (
            <Route
                {...rest}
                render={location =>
                    !firebaseState.user ? (
                        <Home {...location}/>
                    ) : (
                        <MyAccount {...location}/>
                    )
                }
            />
        );
    }

    const ProtectedRoute = ({component: Component, minrole, ...rest}) => {
        let canViewPage = false;
        if (firebaseState.userInfo) {
            canViewPage = firebaseState.userInfo.claims.role >= minrole;
        }
        return (
            <Route
                {...rest}
                render={location =>
                    canViewPage ? (
                        <Component {...location} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/",
                                // state: {
                                //     error: {
                                //         type: "auth-required"
                                //     }
                                // },
                            }}
                        />

                    )
                }
            />
        );
    }

    return (
        <div className='page cloudy-knoxville-gradient'>

            <Router>

                {firebaseState &&
                <div className='content'>

                    <Navigation/>

                    <Switch>
                        <DetermineHomePage exact path="/"/>

                        <ProtectedRoute path="/books" minrole="100" component={Books}/>
                        <ProtectedRoute path="/checkout" minrole="300" component={CheckOut}/>
                        <ProtectedRoute path="/checkin" minrole="300" component={CheckIn}/>
                        <ProtectedRoute path="/checkouts" minrole="500" component={CheckOuts}/>
                        <ProtectedRoute path="/admin" minrole="1000" component={Admin}/>

                        <Redirect to="/" exact/>
                    </Switch>

                </div>
                }
                {!firebaseState &&
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                }

                <div className='mt-auto py-3'>
                    <Footer/>
                </div>
            </Router>

        </div>
    )
};

export default Routing;
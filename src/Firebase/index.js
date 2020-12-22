/* eslint-disable */
/* ^Remove when hooks complete^*/

import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
import 'firebase/analytics';
import FirebaseContext from './FirebaseContext';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firebase: firebase.apps.length
        ? firebase
        : firebase.initializeApp(firebaseConfig),
      firestore: firebase.firestore(),
      auth: firebase.auth(),
      storage: firebase.storage(),
      functions: firebase.functions(),
      analytics:
        process.env.NODE_ENV === 'production' ? firebase.analytics() : null,
      user: null,
      userInfo: null,
      viewBooks: false,
      canCheckout: false,
      canViewCheckouts: false,
      isAdmin: false,
    };

    if (window.location.hostname === 'localhost') {
      this.state.firestore.useEmulator('localhost', 8080);
      this.state.functions.useEmulator('localhost', 5001);
      this.state.auth.useEmulator('http://localhost:9099/');
    }

    this.state.auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then((claims) => {
          console.log(claims.claims);
          this.setState({
            user: user,
            userInfo: claims,
            viewBooks: claims.claims.role >= 100,
            canCheckout: claims.claims.role >= 300,
            canViewCheckouts: claims.claims.role >= 500,
            isAdmin: claims.claims.role >= 1000,
          });
        });
      } else {
        this.setState({
          user: null,
          userInfo: null,
          viewBooks: false,
          canCheckout: false,
          canViewCheckouts: false,
          isAdmin: false,
        });
      }
    });
  }

  signOut() {
    this.state.auth.signOut();
  }

  render() {
    return (
      <FirebaseContext.Provider value={this.state}>
        {this.props.children}
      </FirebaseContext.Provider>
    );
  }
}

export default Firebase;

export { FirebaseContext };

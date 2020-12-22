import React from 'react';
import Routing from './components/Routing';
import Firebase, { FirebaseContext } from './Firebase';

const App = () => (
  <Firebase>
    <FirebaseContext.Consumer>
      {(firebase) => <Routing firebase={firebase} />}
    </FirebaseContext.Consumer>
  </Firebase>
);

export default App;

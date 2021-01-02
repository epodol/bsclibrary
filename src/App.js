import React from 'react';
import Routing from './components/Routing';

import { FirebaseProvider } from './Firebase';

const App = () => (
  <FirebaseProvider>
    <Routing />
  </FirebaseProvider>
);

export default App;

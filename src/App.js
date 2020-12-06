import React from 'react';
import Routing from "./components/Routing";

import { FirebaseProvider } from './Firebase/FirebaseContext'

const App = () => {    
    return (
        <FirebaseProvider>
            <Routing />
        </FirebaseProvider>
    )
}

export default App;
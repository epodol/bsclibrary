import React, {Component} from 'react';
import Routing from "./components/Routing";
import Firebase, {FirebaseContext} from "./Firebase";

class App extends Component {
    render() {
        return (
            <Firebase>
                <FirebaseContext.Consumer>
                    {firebase => <Routing firebase={firebase}/>}
                </FirebaseContext.Consumer>
            </Firebase>
        );
    }
}

export default App;
import React, {Component} from 'react';
import {
    MDBNavbarNav,
    MDBContainer,
    MDBBtn,
} from 'mdbreact';
import {auth} from "../../../../fire/FirebaseConfig";


class UnverifiedNavbar extends Component {
    render() {
        function signOut() {
            auth.signOut().then(() => {
                console.log('Signed out')
            }).catch((error) => {
                console.log('Error signing out:', error)
            })
        }
        return (
            <MDBNavbarNav right>
                <MDBContainer>
                    <MDBBtn color="pink" onClick={signOut}>Sign Out</MDBBtn>
                </MDBContainer>
            </MDBNavbarNav>
        );
    }
}

export default UnverifiedNavbar;
import React, {Component} from "react";
import {MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavLink } from "mdbreact";
import AdminNavbar from "./StudentNavbar";
import LibraryStaffNavbar from "./StudentNavbar";
import LibrarianNavbar from "./StudentNavbar";
import LibraryVolunteerNavbar from "./StudentNavbar";
import SchoolStaffNavbar from "./StudentNavbar";
import StudentNavbar from "./StudentNavbar";
import UnverifiedNavbar from "./StudentNavbar";

import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {auth, db, storage} from "../../fire/FirebaseConfig";
import SignedOutNavbar from "./NavBar/SignedOutNavbar";

class Navigation extends Component {
    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {

        var navbar = <SignedOutNavbar />;

        auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                this.userFirebaseRef = db.collection('users').doc(currentUser.uid);
                this.userStorageRef = storage.ref('/user-files').child(currentUser.uid);
                auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                    console.log("GETTING")
                    if (!!idTokenResult.claims.administrator) {
                        navbar = <AdminNavbar />;
                    } else if (!!idTokenResult.claims.library_staff) {
                        navbar = <LibraryStaffNavbar />;
                    } else if (!!idTokenResult.claims.librarian) {
                        navbar = <LibrarianNavbar />;
                    } else if (!!idTokenResult.claims.library_volunteer) {
                        navbar = <LibraryVolunteerNavbar />;
                    } else if (!!idTokenResult.claims.school_staff) {
                        navbar = <SchoolStaffNavbar />;
                    } else if (!!idTokenResult.claims.student) {
                        navbar = <StudentNavbar />;
                    } else {
                        console.log("UnverifiedNavbar")

                        navbar = <UnverifiedNavbar />;
                    }
                })
            } else {
                console.log("SignedOutNavbar")
                navbar = <SignedOutNavbar />
            }
        });




        return (
            <MDBNavbar color="green" dark expand="md">
                <MDBNavLink as={Link} to={ROUTES.HOME}>
                    <MDBNavbarBrand>
                        <img
                            src="https://cdn.discordapp.com/attachments/743524646497943702/760190005074591804/BS_Bulldogs_OL.svg"
                            height="30" alt="BASIS Scottsdale Library"/>
                        <strong className="white-text"> BASIS Scottsdale Library</strong>
                    </MDBNavbarBrand>
                </MDBNavLink>
                <MDBNavbarToggler onClick={this.toggleCollapse}/>
                <MDBCollapse id="navbar" isOpen={this.state.isOpen} navbar>
                    {navbar}
                </MDBCollapse>
            </MDBNavbar>
        )
    }
}


export default Navigation;
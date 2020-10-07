import React, {useEffect, useState} from "react";
import {MDBNavbar, MDBNavbarBrand, MDBNavbarToggler, MDBCollapse, MDBNavLink} from "mdbreact";
import AdminNavbar from "./NavBar/AdminNavbar";
import LibraryStaffNavbar from "./NavBar/LibraryStaffNavbar";
import LibrarianNavbar from "./NavBar/LibrarianNavbar";
import LibraryVolunteerNavbar from "./NavBar/LibraryVolunteerNavbar";
import SchoolStaffNavbar from "./NavBar/SchoolStaffNavbar";
import StudentNavbar from "./NavBar/StudentNavbar";
import UnverifiedNavbar from "./NavBar/UnverifiedNavbar";
import SignedOutNavbar from "./NavBar/SignedOutNavbar";

import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {auth, db, storage} from "../../fire/FirebaseConfig";


// const getNavbar = () => {
//     let navbar = null
//     auth.onAuthStateChanged((user) => {
//         console.log("onAuthStateChanged: ", user)
//
//         // if (user) {
//         user.getIdTokenResult()
//             .then((idTokenResult) => {
//                 console.log("GETTING", idTokenResult.claims)
//                 // if (idTokenResult.claims.administrator) {
//                 //     navbar = <AdminNavbar/>;
//                 //     console.log("AdminNavbar")
//                 //
//                 //     // setNavbar(<AdminNavbar/>)
//                 //     // } else if (idTokenResult.claims.library_staff) {
//                 //     //     navbar = <LibraryStaffNavbar/>;
//                 //     // } else if (idTokenResult.claims.librarian) {
//                 //     //     navbar = <LibrarianNavbar/>;
//                 //     // } else if (idTokenResult.claims.library_volunteer) {
//                 //     //     navbar = <LibraryVolunteerNavbar/>;
//                 //     // } else if (idTokenResult.claims.school_staff) {
//                 //     //     navbar = <SchoolStaffNavbar/>;
//                 // } else if (idTokenResult.claims.student) {
//                 //     navbar = <StudentNavbar/>;
//                 //     // setNavbar(<StudentNavbar/>)
//                 //     console.log("StudentNavbar", navbar)
//                 //     return <StudentNavbar/>
//                 //
//                 // } else {
//                 //     navbar = <UnverifiedNavbar/>;
//                 //     // setNavbar(<UnverifiedNavbar/>)
//                 //     console.log("UnverifiedNavbar")
//                 //
//                 // }
//                 //     return navbar
//                 // })
//                 // } else {
//                 //     navbar = <SignedOutNavbar/>;
//                 // }
//
//                 console.log({navbar})
//                 // setIsNavbar(navbar)
//
//             })
//     })
//             return navbar
//
// }

const Navigation = () => {

    const [isOpen, setIsOpen] = useState(false);
    // const [isNavbar, setIsNavbar] = useState(null)
    // const [user, setUser] = useState(false);

    const [claim, setClaim] = useState(false);

    let navbar = null

    // let navbar = getNavbar()

    useEffect(() => {

        auth.onAuthStateChanged((user) => {
            console.log("onAuthStateChanged: ", user)

            // if (user) {
            user.getIdTokenResult()
                .then((idTokenResult) => {
                    // setUser(user)
                    console.log("GETTING", idTokenResult.claims)
                    setClaim(idTokenResult.claims)


        })
    }, [claim])



    // if (navbar) {
    //     setIsNavbar({navbar})
    // }
    // console.log("isNavbar: ", isNavbar)=
    if (claim.administrator) {
        navbar = <AdminNavbar/>;
        console.log("AdminNavbar")

        // setNavbar(<AdminNavbar/>)
        // } else if (idTokenResult.claims.library_staff) {
        //     navbar = <LibraryStaffNavbar/>;
        // } else if (idTokenResult.claims.librarian) {
        //     navbar = <LibrarianNavbar/>;
        // } else if (idTokenResult.claims.library_volunteer) {
        //     navbar = <LibraryVolunteerNavbar/>;
        // } else if (idTokenResult.claims.school_staff) {
        //     navbar = <SchoolStaffNavbar/>;
    } else if (claim.student) {
        navbar = <StudentNavbar/>;
        // setNavbar(<StudentNavbar/>)
        console.log("StudentNavbar", navbar)
        return <StudentNavbar/>

    } else {
        navbar = <UnverifiedNavbar/>;
        // setNavbar(<UnverifiedNavbar/>)
        console.log("UnverifiedNavbar")

    }
    //     return navbar
    // })
    // } else {
    //     navbar = <SignedOutNavbar/>;
    // }

    console.log({navbar})
    // setIsNavbar(navbar)

})

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
            <MDBNavbarToggler onClick={() => setIsOpen(!isOpen)}/>
            <MDBCollapse id="navbar" isOpen={isOpen} navbar>
                {navbar}
            </MDBCollapse>
        </MDBNavbar>
    )
}

export default Navigation;
import React, { useEffect, useState } from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavLink,
} from "mdbreact";
import AdminNavbar from "./NavBar/AdminNavbar";
import LibraryStaffNavbar from "./NavBar/LibraryStaffNavbar";
import LibrarianNavbar from "./NavBar/LibrarianNavbar";
import LibraryVolunteerNavbar from "./NavBar/LibraryVolunteerNavbar";
import SchoolStaffNavbar from "./NavBar/SchoolStaffNavbar";
import StudentNavbar from "./NavBar/StudentNavbar";
import UnverifiedNavbar from "./NavBar/UnverifiedNavbar";
import SignedOutNavbar from "./NavBar/SignedOutNavbar";

import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { auth } from "../../fire/FirebaseConfig";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(false);
  const [claims, setClaims] = useState(false);
//   const [navBar, setNavBar] = useState(null);
  
  useEffect(() => {
    auth.onAuthStateChanged((authuser) => {
      setUser(authuser);
      console.log("useEffect - USERRRR: ", authuser);
    });
  }, []);

  useEffect(() => {
    if (user) {
        user.getIdTokenResult()
            .then((idTokenResult) => {
                setClaims(idTokenResult.claims);
        });
    } else {
        setClaims(false)
    }
  }, [user, setUser]);

//   useEffect(() => {
//     let useNavBar = null
//     if (user) {
//         if (claims) {
//             useNavBar = claims.admin
//                 ? <AdminNavbar /> : claims.library_staff
//                 ? <LibraryStaffNavbar/> : claims.librarian
//                 ? <LibrarianNavbar/> : claims.library_volunteer
//                 ? <LibraryVolunteerNavbar/> : claims.school_staff
//                 ? <SchoolStaffNavbar/> : claims.student
//                 ? <StudentNavbar /> : <UnverifiedNavbar/>
//             } else {
//                 useNavBar = <SignedOutNavbar/>
//             }
//             setNavBar(useNavBar)
//             console.log("navBar - claims: ", claims);
//             console.log("NAVBAR....: ", navBar);

//     } else {
//         setNavBar(null)
//     }
//   }, [user, claims]);


  let useNavBar = null
  if (claims) {
   useNavBar = claims.admin
    ? <AdminNavbar /> : claims.library_staff
    ? <LibraryStaffNavbar/> : claims.librarian
    ? <LibrarianNavbar/> : claims.library_volunteer
    ? <LibraryVolunteerNavbar/> : claims.school_staff
    ? <SchoolStaffNavbar/> : claims.student
    ? <StudentNavbar /> : <UnverifiedNavbar/>
  } else {
    useNavBar = <SignedOutNavbar/>
  }

  return (
    <MDBNavbar color="green" dark expand="md">
      <MDBNavLink as={Link} to={ROUTES.HOME}>
        <MDBNavbarBrand>
          <img
            src="https://cdn.discordapp.com/attachments/743524646497943702/760190005074591804/BS_Bulldogs_OL.svg"
            height="30"
            alt="BASIS Scottsdale Library"
          />
          <strong className="white-text"> BASIS Scottsdale Library </strong>
        </MDBNavbarBrand>
      </MDBNavLink>
      <MDBNavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <MDBCollapse id="navbar" isOpen={isOpen} navbar>
        {useNavBar}
      </MDBCollapse>
    </MDBNavbar>
  );
};

export default Navigation;

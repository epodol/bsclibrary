import React from 'react'
import {
    MDBNavbarNav,
    MDBNavItem,
    MDBNavLink
} from "mdbreact";
import { Link } from "react-router-dom";
import * as ROUTES from "../../../../constants/routes";

import { NavBarAccount } from "../../NavBarComponents";


const NavBarMenu = () => (
    <MDBNavbarNav left>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.SCHOOLADMIN}>School Admin</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.BOOKS}>Books</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.LIBRARYADMIN}>Library Admin</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.CHECKOUT}>Check Out</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.CHECKIN}>Check In</MDBNavLink>
        </MDBNavItem>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.CHECKOUTS}>Checkouts</MDBNavLink>
        </MDBNavItem>
    </MDBNavbarNav>
)

const AdminNavbar = () => {
    return (
        <>
            <NavBarMenu />
            <NavBarAccount />
        </>
    )

    // return (
    //         <NavBarMenu />
    // )
}

export default AdminNavbar;
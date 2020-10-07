import React from 'react'
import {
    MDBNavbarNav,
    MDBNavItem,
    MDBNavLink,
} from "mdbreact";
import { Link } from "react-router-dom";
import * as ROUTES from "../../../../constants/routes";
import { NavBarAccount } from "../../NavBarComponents";

const NavBarMenu = () => (
    <MDBNavbarNav left>
        <MDBNavItem>
            <MDBNavLink as={Link} to={ROUTES.BOOKS}>Books</MDBNavLink>
        </MDBNavItem>
    </MDBNavbarNav>
)

const StudentNavbar = () => (
    <>
    <NavBarMenu />
    <NavBarAccount />
    </>
)

export default StudentNavbar;
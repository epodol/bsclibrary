import React from 'react'
import {
    MDBNavbarNav,
    MDBNavItem,
    MDBNavLink,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,
} from "mdbreact";
import {Link} from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const StudentNavbar = () => {
    return (
        <>
            <MDBNavbarNav left>
                <MDBNavItem active>
                    <MDBNavLink to="#!">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="#!">Features</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink to="#!">Pricing</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink as={Link} to={ROUTES.MYACCOUNT}>About</MDBNavLink>
                </MDBNavItem>
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
            <MDBNavbarNav right>
                <MDBNavItem>
                    <MDBDropdown>
                        <MDBDropdownToggle className="dopdown-toggle" nav>
                            <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg"
                                 className="rounded-circle z-depth-0"
                                 style={{height: "35px", padding: 0}} alt=""/>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default" right basic>
                            <MDBDropdownItem href="#!"><MDBIcon icon="home" /> My Account</MDBDropdownItem>
                            <MDBDropdownItem href="#!"><MDBIcon icon="book" /> My Checkouts</MDBDropdownItem>
                            <MDBDropdownItem divider />
                            <MDBDropdownItem href="#!"><MDBIcon icon="sign-out-alt" /> Sign out</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
            </>
    )
}

export default StudentNavbar;
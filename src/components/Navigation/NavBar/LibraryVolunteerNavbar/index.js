import React, {Component} from 'react'
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
import * as ROUTES from "../../../../constants/routes";

class LibraryVolunteerNavbar extends Component {
    render() {
        return (
            <>
                <MDBNavbarNav left>
                    <MDBNavItem>
                        <MDBNavLink as={Link} to={ROUTES.BOOKS}>Books</MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink as={Link} to={ROUTES.CHECKOUT}>Check Out</MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink as={Link} to={ROUTES.CHECKIN}>Check In</MDBNavLink>
                    </MDBNavItem>
                </MDBNavbarNav>
                <MDBNavbarNav right>
                    <MDBNavItem>
                        <MDBDropdown>
                            <MDBDropdownToggle nav caret>
                                <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-4.jpg"
                                     className="rounded-circle z-depth-0"
                                     style={{height: "35px", padding: 0}} alt=""/>
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="dropdown-default" right>
                                <MDBDropdownItem>
                                    <MDBNavLink link to={ROUTES.MYACCOUNT} className='text-dark p-1'>
                                        <MDBIcon icon="home"/> My Account
                                    </MDBNavLink>
                                </MDBDropdownItem>
                                <MDBDropdownItem>
                                    <MDBNavLink link to={ROUTES.MYCHECKOUTS} className='text-dark p-1'>
                                        <MDBIcon icon="book"/> My Checkouts
                                    </MDBNavLink>
                                </MDBDropdownItem>
                                <MDBDropdownItem divider/>
                                <MDBDropdownItem>
                                    <MDBNavLink link to={ROUTES.HOME} className='text-dark p-1'>
                                        <MDBIcon icon="sign-out-alt"/> Sign out
                                    </MDBNavLink>
                                </MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBNavItem>
                </MDBNavbarNav>
            </>
        )
    }
}

export default LibraryVolunteerNavbar;
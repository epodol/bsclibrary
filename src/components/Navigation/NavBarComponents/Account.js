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
import * as ROUTES from "../../../constants/routes";
import { auth } from "../../../fire/FirebaseConfig"

function signOut() {
    console.log("Signing out")
    auth.signOut().then(() => {
        console.log('Signed Out')
    }).catch((error) => {
        console.log('Error signing out: ', error)
    })
}

export const NavBarAccount = () => (
    <MDBNavbarNav right>
        <MDBNavItem>
            <MDBDropdown>
                <MDBDropdownToggle nav caret>
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/avatar-4.jpg"
                        className="rounded-circle z-depth-0"
                        style={{ height: "35px", padding: 0 }} alt="" />
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default" right>
                    <MDBDropdownItem>
                        <MDBNavLink link to={ROUTES.MYACCOUNT} className='text-dark p-1'>
                            <MDBIcon icon="home" /> My Account
                    </MDBNavLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                        <MDBNavLink link to={ROUTES.MYCHECKOUTS} className='text-dark p-1'>
                            <MDBIcon icon="book" /> My Checkouts
                    </MDBNavLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem divider />
                    <MDBDropdownItem onClick={signOut} className='text-dark p-1'>
                        <MDBIcon icon="sign-out-alt"/> Sign out
                    </MDBDropdownItem>
                </MDBDropdownMenu>
            </MDBDropdown>
        </MDBNavItem>
    </MDBNavbarNav>
)



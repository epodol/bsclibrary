import React from 'react'
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavItem,
    MDBNavLink,
    MDBNavbarToggler,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,
    MDBBtn,
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter, MDBContainer
} from "mdbreact";

const SignedOutNavbar = () => {
    return (
    <MDBNavbarNav right>
        <MDBNavItem>
            <MDBBtn onClick={this.toggle}>Modal</MDBBtn>
            <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                <MDBModalHeader toggle={this.toggle}>MDBModal title</MDBModalHeader>
                <MDBModalBody>
                    (...)
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                    <MDBBtn color="primary">Save changes</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        </MDBNavItem>
    </MDBNavbarNav>
    )
}

export default SignedOutNavbar;
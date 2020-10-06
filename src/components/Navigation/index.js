import React, {Component} from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";import {BrowserRouter as Router} from 'react-router-dom';
import StudentNavbar from "./StudentNavbar";

class Navigation extends Component {
    state = {
        isOpen: false
    };

    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        return (
            <Router>
                <MDBNavbar color="green" dark expand="md">
                    <MDBNavbarBrand>
                        <img src="https://cdn.discordapp.com/attachments/743524646497943702/760190005074591804/BS_Bulldogs_OL.svg" height="30" alt="BASIS Scottsdale Library"/>
                        <strong className="white-text"> BASIS Scottsdale Library</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse}/>
                    <MDBCollapse id="navbar" isOpen={this.state.isOpen} navbar>
                        <StudentNavbar />
                    </MDBCollapse>
                </MDBNavbar>
            </Router>
        )
    }
}


export default Navigation;
import React, { useState, useContext } from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavLink,
  MDBNavbarNav,
  MDBNavItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
} from 'mdbreact';

import { NavLink, useLocation } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import FirebaseContext from '../../Firebase';

const NavBarItems = () => {
  const firebase = useContext(FirebaseContext);

  function signOut() {
    firebase.firebase.auth().signOut();
  }

  const location = useLocation();

  return (
    <>
      <MDBNavbarNav left>
        {firebase.viewBooks && (
          <MDBNavItem active={location.pathname === ROUTES.BOOKS}>
            <MDBNavLink as={NavLink} to={ROUTES.BOOKS}>
              Books
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebase.canCheckout && (
          <>
            <MDBNavItem active={location.pathname === ROUTES.CHECKOUT}>
              <MDBNavLink as={NavLink} to={ROUTES.CHECKOUT}>
                Check Out
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem active={location.pathname === ROUTES.CHECKIN}>
              <MDBNavLink as={NavLink} to={ROUTES.CHECKIN}>
                Check In
              </MDBNavLink>
            </MDBNavItem>
          </>
        )}
        {firebase.canViewCheckouts && (
          <MDBNavItem active={location.pathname === ROUTES.CHECKOUTS}>
            <MDBNavLink as={NavLink} to={ROUTES.CHECKOUTS}>
              Checkouts
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebase.isAdmin && (
          <MDBNavItem active={location.pathname === ROUTES.ADMIN}>
            <MDBNavLink as={NavLink} to={ROUTES.ADMIN}>
              Admin
            </MDBNavLink>
          </MDBNavItem>
        )}
      </MDBNavbarNav>
      {firebase.user && (
        <MDBNavbarNav right>
          <MDBNavItem>
            <MDBDropdown>
              <MDBDropdownToggle nav caret>
                <img
                  src="https://mdbootstrap.com/img/Photos/Avatars/avatar-4.jpg"
                  className="rounded-circle z-depth-0"
                  style={{ height: '35px', padding: 0 }}
                  alt=""
                />
              </MDBDropdownToggle>
              <MDBDropdownMenu className="dropdown-default" right>
                <MDBDropdownItem>
                  <MDBNavLink to="/myaccount" className="text-dark p-1">
                    <MDBIcon icon="home" /> My Account
                  </MDBNavLink>
                </MDBDropdownItem>
                <MDBDropdownItem>
                  <MDBNavLink to="/checkouts" className="text-dark p-1">
                    <MDBIcon icon="book" /> My Checkouts
                  </MDBNavLink>
                </MDBDropdownItem>
                <MDBDropdownItem divider />
                <MDBDropdownItem onClick={signOut}>
                  <MDBNavLink to="/" className="text-dark p-1">
                    <MDBIcon icon="sign-out-alt" /> Sign out
                  </MDBNavLink>
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
      )}
    </>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MDBNavbar color="rgba-green-strong" dark expand="md">
      <MDBNavLink as={NavLink} to={ROUTES.HOME}>
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
        <NavBarItems />
      </MDBCollapse>
    </MDBNavbar>
  );
};

export default Navigation;

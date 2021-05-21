import React, { useState, useContext, Suspense } from 'react';
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
import Avatar from '@material-ui/core/Avatar';

import { AuthCheck, useAuth } from 'reactfire';

import { NavLink, useLocation } from 'react-router-dom';

import FirebaseContext from '../Firebase';

const NavBarItems = () => {
  const firebaseContext = useContext(FirebaseContext);
  const auth = useAuth();
  const location = useLocation();

  return (
    <>
      <MDBNavbarNav left>
        <MDBNavItem active={location.pathname === '/about'}>
          <MDBNavLink as={NavLink} to="/about">
            About
          </MDBNavLink>
        </MDBNavItem>
        <MDBNavItem active={location.pathname === '/contribute'}>
          <MDBNavLink as={NavLink} to="/contribute">
            Contribute
          </MDBNavLink>
        </MDBNavItem>
        {firebaseContext.claims?.permissions?.VIEW_BOOKS && (
          <MDBNavItem active={location.pathname.startsWith('/books')}>
            <MDBNavLink as={NavLink} to="/books">
              Books
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebaseContext.claims?.permissions?.CHECK_OUT && (
          <MDBNavItem active={location.pathname === '/checkout'}>
            <MDBNavLink as={NavLink} to="/checkout">
              Check Out
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebaseContext.claims?.permissions?.CHECK_IN && (
          <MDBNavItem active={location.pathname === '/checkin'}>
            <MDBNavLink as={NavLink} to="/checkin">
              Check In
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebaseContext.claims?.permissions?.MANAGE_CHECKOUTS && (
          <MDBNavItem active={location.pathname.startsWith('/checkouts')}>
            <MDBNavLink as={NavLink} to="/checkouts">
              Checkouts
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebaseContext.claims?.permissions?.MANAGE_USERS && (
          <MDBNavItem active={location.pathname.startsWith('/users')}>
            <MDBNavLink as={NavLink} to="/users">
              Users
            </MDBNavLink>
          </MDBNavItem>
        )}
      </MDBNavbarNav>
      <Suspense fallback="loading...">
        <AuthCheck fallback={<></>}>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav className="">
                  <Avatar
                    alt={`${firebaseContext?.claims?.firstName || ''} ${
                      firebaseContext?.claims?.lastName || ''
                    }`}
                    src={firebaseContext?.claims?.picture}
                  >
                    {`${firebaseContext?.claims?.firstName?.slice(
                      0,
                      1
                    )}${firebaseContext?.claims?.lastName?.slice(0, 1)}`}
                  </Avatar>
                </MDBDropdownToggle>
                <MDBDropdownMenu className="dropdown-default" right>
                  <MDBDropdownItem>
                    <MDBNavLink to="/" className="text-dark p-1">
                      <MDBIcon icon="home" /> My Account
                    </MDBNavLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBNavLink to="/checkouts" className="text-dark p-1">
                      <MDBIcon icon="book" /> My Checkouts
                    </MDBNavLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem divider />
                  <MDBDropdownItem onClick={() => auth.signOut()}>
                    <MDBNavLink to="/" className="text-dark p-1">
                      <MDBIcon icon="sign-out-alt" /> Sign out
                    </MDBNavLink>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </AuthCheck>
      </Suspense>
    </>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MDBNavbar color="rgba-green-strong" dark expand="md">
      <MDBNavLink as={NavLink} to="/">
        <MDBNavbarBrand>
          <img
            src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo - v0.1.1.svg`}
            height="50"
            alt="BASIS Scottsdale Library Logo"
          />
          <strong className="white-text"> BASIS Scottsdale Library</strong>
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

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
        {firebaseContext.viewBooks && (
          <MDBNavItem active={location.pathname === '/books'}>
            <MDBNavLink as={NavLink} to="/books">
              Books
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebaseContext.canCheckout && (
          <>
            <MDBNavItem active={location.pathname === '/checkout'}>
              <MDBNavLink as={NavLink} to="/checkout">
                Check Out
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem active={location.pathname === '/checkin'}>
              <MDBNavLink as={NavLink} to="/checkin">
                Check In
              </MDBNavLink>
            </MDBNavItem>
          </>
        )}
        {firebaseContext.canViewCheckouts && (
          <MDBNavItem active={location.pathname === '/checkouts'}>
            <MDBNavLink as={NavLink} to="/checkouts">
              Checkouts
            </MDBNavLink>
          </MDBNavItem>
        )}
        {firebaseContext.isAdmin && (
          <MDBNavItem active={location.pathname === '/admin'}>
            <MDBNavLink as={NavLink} to="/admin">
              Admin
            </MDBNavLink>
          </MDBNavItem>
        )}
      </MDBNavbarNav>
      <Suspense fallback="loading...">
        <AuthCheck fallback={<></>}>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret className="py-0 pt-3">
                  <MDBIcon
                    icon="user"
                    // size="2x"
                    className="rounded-circle z-depth-0 mr-2"
                    style={{ height: '35px', padding: 0, color: 'white' }}
                  />
                  {firebaseContext?.user?.displayName || ''}
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

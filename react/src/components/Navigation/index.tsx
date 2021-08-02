import React, { useContext } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { ExitToApp, Home } from '@material-ui/icons';

import { useAuth, useSigninCheck } from 'reactfire';

import { Link, useHistory, useLocation } from 'react-router-dom';

import FirebaseContext from 'src/contexts/FirebaseContext';
import SignIn from 'src/components/Navigation/SignIn';

const NavBarItems = () => {
  const firebaseContext = useContext(FirebaseContext);
  const location = useLocation();
  return (
    <div style={{ marginLeft: 5 }}>
      <Link to="/about" className="white-text">
        <Button
          color="inherit"
          disabled={location.pathname.startsWith('/about')}
        >
          About
        </Button>
      </Link>
      <Link to="/contribute" className="white-text">
        <Button
          color="inherit"
          disabled={location.pathname.startsWith('/contribute')}
        >
          Contribute
        </Button>
      </Link>
      {firebaseContext.claims?.permissions?.VIEW_BOOKS && (
        <Link to="/books" className="white-text">
          <Button
            color="inherit"
            disabled={location.pathname.startsWith('/books')}
          >
            Books
          </Button>
        </Link>
      )}
      {firebaseContext.claims?.permissions?.CHECK_OUT && (
        <Link to="/checkout" className="white-text">
          <Button color="inherit" disabled={location.pathname === '/checkout'}>
            Check Out
          </Button>
        </Link>
      )}
      {firebaseContext.claims?.permissions?.CHECK_IN && (
        <Link to="/checkin" className="white-text">
          <Button
            color="inherit"
            disabled={location.pathname.startsWith('/checkin')}
            // variant={
            //   location.pathname.startsWith('/checkin') ? 'contained' : 'text'
            // }
          >
            Check In
          </Button>
        </Link>
      )}
      {firebaseContext.claims?.permissions?.MANAGE_CHECKOUTS && (
        <Link to="/checkouts" className="white-text">
          <Button
            color="inherit"
            disabled={location.pathname.startsWith('/checkouts')}
          >
            Manage Checkouts
          </Button>
        </Link>
      )}
      {firebaseContext.claims?.permissions?.MANAGE_USERS && (
        <Link to="/users" className="white-text">
          <Button
            color="inherit"
            disabled={location.pathname.startsWith('/users')}
          >
            Users
          </Button>
        </Link>
      )}
    </div>
  );
};

const Navigation = () => {
  const firebaseContext = useContext(FirebaseContext);
  const auth = useAuth();
  const history = useHistory();

  const signinCheck = useSigninCheck().data;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="regular">
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo - v0.1.1.svg`}
              height="50"
              width="50"
              alt="BASIS Scottsdale Library Logo"
            />
            <strong className="white-text"> BASIS Scottsdale Library</strong>
          </Link>
          <NavBarItems />
          <div style={{ marginLeft: 'auto', marginRight: 0 }}>
            {signinCheck.signedIn && (
              <div>
                <IconButton onClick={handleMenu} color="inherit">
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
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      history.push('/');
                      setAnchorEl(null);
                    }}
                  >
                    <Home /> My Account
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      auth.signOut().then(() => {
                        history.push('.');
                        window.location.reload();
                      });
                    }}
                  >
                    <ExitToApp /> Sign out
                  </MenuItem>
                </Menu>
              </div>
            )}
            {!signinCheck.signedIn && <SignIn />}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;

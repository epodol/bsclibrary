import React, { useContext } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Brightness7, ExitToApp, Home, ModeNight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { useAuth, useSigninCheck } from 'reactfire';

import { Link, useNavigate, useLocation } from 'react-router-dom';

import SignIn from 'src/components/Navigation/SignIn';
import ChooseLibrary from 'src/components/Navigation/ChooseLibrary';

import FirebaseContext from 'src/contexts/FirebaseContext';
import ThemeContext from 'src/contexts/MUITheme';

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
  const navigate = useNavigate();

  const theme = useTheme();
  const toggleTheme = useContext(ThemeContext);

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
          <ChooseLibrary />
          <NavBarItems />
          <div style={{ marginLeft: 'auto', marginRight: 0 }}>
            <IconButton
              style={{ marginInline: 10 }}
              onClick={() => toggleTheme()}
            >
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <ModeNight />}
            </IconButton>
            {signinCheck.signedIn && (
              <>
                <IconButton onClick={handleMenu} color="inherit" size="large">
                  <Avatar
                    alt={`${firebaseContext?.claims?.firstName || ''} ${
                      firebaseContext?.claims?.lastName || ''
                    }`}
                    src={firebaseContext?.claims?.picture}
                    variant="rounded"
                  >
                    {`${firebaseContext?.claims?.firstName?.slice(
                      0,
                      1
                    )}${firebaseContext?.claims?.lastName?.slice(0, 1)}`}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      navigate('/account');
                      setAnchorEl(null);
                    }}
                  >
                    <Home /> My Account
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      navigate('.');
                      auth.signOut().then(() => {
                        window.location.reload();
                      });
                    }}
                  >
                    <ExitToApp /> Sign out
                  </MenuItem>
                </Menu>
              </>
            )}
            {!signinCheck.signedIn && <SignIn />}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;

import React, { useContext, useState } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ButtonBase,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  Home,
  LocalLibrary,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import Library from '@common/types/Library';

import {
  useAuth,
  useFirestore,
  useFirestoreDocData,
  useSigninCheck,
  useUser,
} from 'reactfire';

import { useNavigate, useLocation } from 'react-router-dom';

// import ChooseLibrary from 'src/components/LibraryNavigation/ChooseLibrary';

import ThemeContext from 'src/contexts/MUITheme';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import { doc } from 'firebase/firestore';

const AuthNavBarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const user = useUser().data;
  if (!user) throw new Error('No user!');

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const signInCheck = useSigninCheck({
    validateCustomClaims: (claims) => ({
      errors: {},
      hasRequiredClaims: (claims?.librariesJoined as string[])?.includes(
        activeLibraryID
      ),
    }),
  }).data;

  if (!signInCheck.hasRequiredClaims) return <></>;

  return (
    <>
      <Button
        color="inherit"
        disabled={location.pathname === '/books'}
        onClick={() => navigate('/books')}
      >
        Books
      </Button>
      {(libraryDoc.userPermissions.CHECK_OUT.includes(user.uid) ||
        libraryDoc.ownerUserID === user.uid) && (
        <Button
          color="inherit"
          disabled={location.pathname === '/checkout'}
          onClick={() => navigate('/checkout')}
        >
          Check Out
        </Button>
      )}
      {(libraryDoc.userPermissions.CHECK_IN.includes(user.uid) ||
        libraryDoc.ownerUserID === user.uid) && (
        <Button
          color="inherit"
          disabled={location.pathname === '/checkin'}
          onClick={() => navigate('/checkin')}
        >
          Check In
        </Button>
      )}
      {(libraryDoc.userPermissions.MANAGE_CHECKOUTS.includes(user.uid) ||
        libraryDoc.ownerUserID === user.uid) && (
        <Button
          color="inherit"
          disabled={location.pathname === '/checkouts'}
          onClick={() => navigate('/checkouts')}
        >
          Manage Checkouts
        </Button>
      )}
      {(libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
        libraryDoc.ownerUserID === user.uid) && (
        <Button
          color="inherit"
          disabled={location.pathname === '/users'}
          onClick={() => navigate('/users')}
        >
          Users
        </Button>
      )}
    </>
  );
};

const NavBarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useUser().data;

  return (
    <div style={{ marginLeft: 5 }}>
      <Button
        color="inherit"
        disabled={location.pathname === '/about'}
        onClick={() => navigate('/about')}
      >
        About
      </Button>
      <Button
        color="inherit"
        disabled={location.pathname === '/contribute'}
        onClick={() => navigate('/contribute')}
      >
        Contribute
      </Button>

      {user && <AuthNavBarItems />}
    </div>
  );
};

const AuthMenuItems = () => {
  const auth = useAuth();

  const navigate = useNavigate();

  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [, /* chooseLibraryOpen */ setChooseLibraryOpen] = useState(false);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* <ChooseLibrary open={chooseLibraryOpen} setOpen={setChooseLibraryOpen} /> */}
      <IconButton onClick={handleMenu} color="inherit" size="large">
        {/* <Avatar
          alt={`${userDoc.firstName || ''} ${userDoc.lastName || ''}`}
          src={user?.photoURL ?? ''}
          variant="rounded"
        >
          {`${userDoc.firstName?.slice(0, 1)}${userDoc.lastName?.slice(0, 1)}`}
        </Avatar> */}
        <AccountCircle />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
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
            setChooseLibraryOpen(
              (oldChooseLibraryOpen) => !oldChooseLibraryOpen
            );
            setAnchorEl(null);
          }}
          disabled
        >
          <LocalLibrary /> Libraries
        </MenuItem>
        <Divider />
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
  );
};

const Navigation = () => {
  const user = useUser().data;

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const toggleTheme = useContext(ThemeContext);

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ButtonBase onClick={() => navigate('/')}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/logos/BASIS Scottsdale Library Logo.svg`}
              height="50"
              width="50"
              alt="BASIS Scottsdale Library Logo"
            />
            <strong> BASIS Scottsdale Library</strong>
          </ButtonBase>
          <NavBarItems />
          <div style={{ marginLeft: 'auto', marginRight: 0 }}>
            <IconButton
              style={{ marginInline: 10 }}
              onClick={() => toggleTheme()}
            >
              {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
            {user && <AuthMenuItems />}
            {!user && (
              <Button
                size="large"
                variant="outlined"
                onClick={() => navigate('/signin')}
                disabled={location.pathname.startsWith('/signin')}
                color="inherit"
              >
                Sign In
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;

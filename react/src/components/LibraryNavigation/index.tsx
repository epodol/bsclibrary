import React, { useContext, useState } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ButtonBase,
} from '@mui/material';
import {
  Brightness7,
  ExitToApp,
  Home,
  LocalLibrary,
  ModeNight,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import Library from '@common/types/Library';

import { useAuth, useFirestore, useFirestoreDocData, useUser } from 'reactfire';

import { useNavigate, useLocation } from 'react-router-dom';

// import ChooseLibrary from 'src/components/LibraryNavigation/ChooseLibrary';

import ThemeContext from 'src/contexts/MUITheme';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import { doc } from 'firebase/firestore';
import User from '@common/types/User';

const NavBarItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const user = useUser().data;

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;
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

      {user && (
        <>
          <Button
            color="inherit"
            disabled={location.pathname === '/books'}
            onClick={() => navigate('/books')}
          >
            Books
          </Button>
          {libraryDoc.userPermissions.CHECK_OUT.includes(user.uid) ||
            (libraryDoc.ownerUserID === user.uid && (
              <Button
                color="inherit"
                disabled={location.pathname === '/checkout'}
                onClick={() => navigate('/checkout')}
              >
                Check Out
              </Button>
            ))}
          {libraryDoc.userPermissions.CHECK_IN.includes(user.uid) ||
            (libraryDoc.ownerUserID === user.uid && (
              <Button
                color="inherit"
                disabled={location.pathname === '/checkin'}
                onClick={() => navigate('/checkin')}
              >
                Check In
              </Button>
            ))}
          {libraryDoc.userPermissions.MANAGE_CHECKOUTS.includes(user.uid) ||
            (libraryDoc.ownerUserID === user.uid && (
              <Button
                color="inherit"
                disabled={location.pathname === '/checkouts'}
                onClick={() => navigate('/checkouts')}
              >
                Manage Checkouts
              </Button>
            ))}
          {libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
            (libraryDoc.ownerUserID === user.uid && (
              <Button
                color="inherit"
                disabled={location.pathname === '/users'}
                onClick={() => navigate('/users')}
              >
                Users
              </Button>
            ))}
        </>
      )}
    </div>
  );
};

const AuthMenuItems = () => {
  const auth = useAuth();
  const user = useUser().data;

  const navigate = useNavigate();

  const firestore = useFirestore();
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const userDoc = useFirestoreDocData(
    doc(firestore, `libraries/${activeLibraryID}/users/${user?.uid}`)
  ).data as unknown as User;

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
        <Avatar
          alt={`${userDoc.firstName || ''} ${userDoc.lastName || ''}`}
          src={user?.photoURL ?? ''}
          variant="rounded"
        >
          {`${userDoc.firstName?.slice(0, 1)}${userDoc.lastName?.slice(0, 1)}`}
        </Avatar>
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
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <ModeNight />}
            </IconButton>
            {user && <AuthMenuItems />}
            {!user && (
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate('/signin')}
                disabled={location.pathname.startsWith('/signin')}
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

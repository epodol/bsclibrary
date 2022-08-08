import React, { useContext, useState } from 'react';
import { Paper, Button, Box, TextField } from '@mui/material';
import { useAuth, useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import JoinRequest from '@common/types/JoinRequest';
import { sendEmailVerification } from 'firebase/auth';
import NotificationContext from 'src/contexts/NotificationContext';

const JoinLibrary = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');
  const NotificationHandler = useContext(NotificationContext);

  const auth = useAuth();
  const firestore = useFirestore();

  const user = useUser().data;
  if (!user) throw new Error('No user signed in!');

  const joinRequestDocRef = doc(
    firestore,
    'libraries',
    activeLibraryID,
    'joinRequests',
    user.uid
  );

  const joinRequestDoc = useFirestoreDocData(joinRequestDocRef).data;

  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
  }>({ firstName: '', lastName: '' });

  if (!user.email) throw new Error('No email found!');

  if (!user.emailVerified)
    return (
      <Paper
        sx={{
          marginTop: {
            xs: '1rem',
            sm: '1rem',
            md: '2rem',
            lg: '4rem',
            xl: '7rem',
          },
          marginLeft: {
            xs: '1rem',
            sm: '2rem',
            md: '15rem',
            lg: '25rem',
            xl: '35rem',
          },
          marginRight: {
            xs: '1rem',
            sm: '2rem',
            md: '15rem',
            lg: '25rem',
            xl: '35rem',
          },
          padding: {
            xs: '1rem',
            sm: '1rem',
            md: '1rem',
            lg: '2rem',
            xl: '3rem',
          },
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Join Library</h1>
        <div style={{ textAlign: 'center' }}>
          <h3>Please confirm your email address.</h3>
          <p>Check your inbox to confirm your email address.</p>
          <br />
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => {
              if (!user.email) throw new Error('No email found!');
              const actionCodeSettings = {
                url: window.location.href,
                handleCodeInApp: true,
              };
              sendEmailVerification(user, actionCodeSettings)
                .then(() => {
                  NotificationHandler.addNotification({
                    message: 'Email verification sent!',
                    severity: 'success',
                  });
                })
                .catch((error) => {
                  NotificationHandler.addNotification({
                    message: error.message,
                    severity: 'error',
                  });
                });
            }}
          >
            Resend Verification Email
          </Button>
        </div>
      </Paper>
    );

  if (joinRequestDoc)
    return (
      <Paper
        sx={{
          marginTop: {
            xs: '1rem',
            sm: '1rem',
            md: '2rem',
            lg: '4rem',
            xl: '7rem',
          },
          marginLeft: {
            xs: '1rem',
            sm: '2rem',
            md: '15rem',
            lg: '25rem',
            xl: '35rem',
          },
          marginRight: {
            xs: '1rem',
            sm: '2rem',
            md: '15rem',
            lg: '25rem',
            xl: '35rem',
          },
          padding: {
            xs: '1rem',
            sm: '1rem',
            md: '1rem',
            lg: '2rem',
            xl: '3rem',
          },
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Join Library</h1>
        <div style={{ textAlign: 'center' }}>
          <h3>
            We have received your request to join the BASIS Scottsdale Library!
          </h3>
          <p>Visit the BASIS Scottsdale Library to activate your account.</p>
        </div>
      </Paper>
    );

  return (
    <Paper
      sx={{
        marginTop: {
          xs: '1rem',
          sm: '1rem',
          md: '2rem',
          lg: '4rem',
          xl: '7rem',
        },
        marginLeft: {
          xs: '1rem',
          sm: '2rem',
          md: '15rem',
          lg: '25rem',
          xl: '35rem',
        },
        marginRight: {
          xs: '1rem',
          sm: '2rem',
          md: '15rem',
          lg: '25rem',
          xl: '35rem',
        },
        padding: {
          xs: '1rem',
          sm: '1rem',
          md: '1rem',
          lg: '2rem',
          xl: '3rem',
        },
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Join Library</h1>
      <div style={{ textAlign: 'center' }}>
        <Button
          size="small"
          onClick={() => {
            auth.signOut().then(() => {
              window.location.reload();
            });
          }}
        >
          Cancel and Sign Out
        </Button>
      </div>
      <br />
      <p style={{ textAlign: 'center' }}>
        Enter your information here to join the BASIS Scottsdale Library!
      </p>
      <div style={{ textAlign: 'center' }}>
        <form>
          <Box
            component="div"
            // sx={{
            //   '& > :not(style)': { m: 1, width: '25%' },
            // }}
          >
            <TextField
              // fullWidth
              sx={{ m: 1 }}
              id="firstName"
              label="First Name"
              value={userInfo.firstName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, firstName: e.target.value });
              }}
            />
            <TextField
              // fullWidth
              sx={{ m: 1 }}
              id="lastName"
              label="Last Name"
              value={userInfo.lastName}
              onChange={(e) => {
                setUserInfo({ ...userInfo, lastName: e.target.value });
              }}
            />
          </Box>
          <br />
          <br />
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={() => {
              if (!user.email) throw new Error('No email found!');
              const joinRequestData: JoinRequest = {
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: user.email,
                uid: user.uid,
                createdAt: serverTimestamp() as Timestamp,
                updatedAt: serverTimestamp() as Timestamp,
                approved: false,
              };
              setDoc(joinRequestDocRef, joinRequestData);
            }}
          >
            Join Library
          </Button>
        </form>
      </div>
    </Paper>
  );
};

export default JoinLibrary;

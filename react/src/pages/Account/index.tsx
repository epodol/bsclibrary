import React, { useContext, useState } from 'react';

import { Button, Grid, Paper, Collapse, Chip } from '@mui/material';

import Checkouts from 'src/pages/Account/Checkouts';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';
import { doc } from 'firebase/firestore';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import User from '@common/types/User';

const Account = () => {
  const [viewCheckouts, setViewCheckouts] = useState(false);
  const activeLibraryID = useContext(ActiveLibraryID);

  const firestore = useFirestore();
  const user = useUser().data;
  if (!user) throw new Error('No user signed in!');
  const userDoc = useFirestoreDocData(
    doc(firestore, `libraries/${activeLibraryID}/users/${user?.uid}`)
  ).data as unknown as User;

  return (
    <div className="lead m-5">
      <h1 className="text-center">Account</h1>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper style={{ padding: '5%' }} className="text-center">
            Welcome, {`${userDoc.firstName} ${userDoc.lastName}`}
          </Paper>
          <Paper style={{ padding: '5%', marginTop: '5%' }}>
            <ul>
              <li>
                {user.email ?? 'No email set.'}{' '}
                {user.emailVerified && <Chip label="Verified" />}
                {!user.emailVerified && (
                  <Chip label="Not Verified" color="secondary" />
                )}
              </li>
              <li>{user.phoneNumber ?? 'No phone number set.'}</li>
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper style={{ padding: '5%' }} className="text-center">
            You have {userDoc.activeCheckouts.length ?? 0} active checkouts.
            <br />
            <Button
              style={{ marginTop: '1em' }}
              color="primary"
              disabled={(userDoc.activeCheckouts.length ?? 0) === 0}
              onClick={() => setViewCheckouts(!viewCheckouts)}
            >
              {viewCheckouts ? 'Hide My Checkouts' : 'Show My Checkouts'}
            </Button>
            <Collapse in={viewCheckouts}>
              {viewCheckouts && (
                <Checkouts userCheckoutIDs={userDoc.activeCheckouts ?? []} />
              )}
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Account;

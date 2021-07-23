import React, { useContext, useState } from 'react';

import { Button, Grid, Paper, Collapse, Chip } from '@material-ui/core';

import FirebaseContext from 'src/contexts/FirebaseContext';
import Checkouts from 'src/components/Account/Checkouts';

const Account = () => {
  const firebaseContext = useContext(FirebaseContext);
  const [viewCheckouts, setViewCheckouts] = useState(false);

  return (
    <div className="lead m-5">
      <h1 className="text-center">Account</h1>
      <p className="text-center font-italic">
        This page is still a work in progress.
      </p>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Paper style={{ padding: '5%' }} className="text-center">
            Welcome,{' '}
            {`${firebaseContext?.claims?.firstName} ${firebaseContext?.claims?.lastName}`}
          </Paper>
          <Paper style={{ padding: '5%', marginTop: '5%' }}>
            <ul>
              <li>
                {firebaseContext?.user?.email ?? 'No email set.'}{' '}
                {firebaseContext?.user?.emailVerified && (
                  <Chip label="Verified" />
                )}
                {!firebaseContext?.user?.emailVerified && (
                  <Chip label="Not Verified" color="secondary" />
                )}
              </li>
              <li>
                {firebaseContext?.user?.phoneNumber ?? 'No phone number set.'}
              </li>
            </ul>
            <p className="text-center font-italic">
              The ability to change this information will be available soon.
            </p>
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper style={{ padding: '5%' }} className="text-center">
            You have{' '}
            {firebaseContext.userDoc?.checkoutInfo?.activeCheckouts?.length ??
              0}{' '}
            active checkouts.
            <br />
            <Button
              style={{ marginTop: '1em' }}
              color="primary"
              variant="outlined"
              disabled={
                (firebaseContext.userDoc?.checkoutInfo?.activeCheckouts
                  ?.length ?? 0) === 0
              }
              onClick={() => setViewCheckouts(!viewCheckouts)}
            >
              {viewCheckouts ? 'Hide My Checkouts' : 'Show My Checkouts'}
            </Button>
            <Collapse in={viewCheckouts}>
              {viewCheckouts && (
                <Checkouts
                  userCheckoutIDs={
                    firebaseContext.userDoc?.checkoutInfo?.activeCheckouts ?? []
                  }
                />
              )}
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
export default Account;

import React, { useContext, useState } from 'react';

import { Button, Grid, Paper, Collapse } from '@material-ui/core';

import FirebaseContext from 'src/contexts/FirebaseContext';
import Checkouts from 'src/components/Account/Checkouts';

const Account = () => {
  const firebaseContext = useContext(FirebaseContext);
  const [viewCheckouts, setViewCheckouts] = useState(false);

  return (
    <div className="text-center lead m-5">
      <h1>Account</h1>
      <p className="font-italic">This page is still a work in progress.</p>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper style={{ padding: '5%' }}>
            Welcome,{' '}
            {`${firebaseContext?.claims?.firstName} ${firebaseContext?.claims?.lastName}`}
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Paper style={{ padding: '5%' }}>
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

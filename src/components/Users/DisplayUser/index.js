import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { useParams } from 'react-router';

import '../users.css';
import UserInfo from './UserInfo';
import UserCheckouts from './UserCheckouts';

const DisplayUser = () => {
  const firestore = useFirestore();
  const { id } = useParams();
  const ref = firestore.collection('users').doc(id);
  const user = useFirestoreDocData(ref, {
    idField: 'id',
  }).data;

  if (typeof user.userInfo === 'undefined') {
    return (
      <h1 className="text-center">Uh oh! I couldn&apos;t find that user!</h1>
    );
  }
  return (
    <div className="div-margin">
      <Paper className="paper-margin">
        <div
          className="paper-margin"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UserInfo user={user} />
        </div>
      </Paper>
      <br />
      <Paper className="paper-margin">
        <div
          className="paper-margin"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UserCheckouts user={user} />
        </div>
      </Paper>
    </div>
  );
};

export default DisplayUser;

import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { useParams } from 'react-router';

import 'src/components/Users/users.css';
import UserInfo from 'src/components/Users/DisplayUser/UserInfo';
import UserCheckouts from 'src/components/Users/DisplayUser/UserCheckouts';

import UserInterface from '@common/types/User';

interface UserInterfaceWithID extends UserInterface {
  id?: string;
}
const DisplayUser = () => {
  const firestore = useFirestore();
  const { id }: { id: string } = useParams();
  const ref = firestore.collection('users').doc(id);
  const { data }: { data: UserInterfaceWithID } = useFirestoreDocData(ref, {
    idField: 'id',
  });

  if (typeof data.userInfo === 'undefined') {
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
          <UserInfo userInfo={data.userInfo} />
        </div>
        <div
          className=""
          style={{
            paddingTop: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UserCheckouts checkouts={data.checkoutInfo} />
        </div>
      </Paper>
    </div>
  );
};

export default DisplayUser;

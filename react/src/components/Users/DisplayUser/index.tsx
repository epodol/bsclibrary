import React from 'react';
import Paper from '@material-ui/core/Paper';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { useParams } from 'react-router';

import 'src/components/Users/users.css';
import UserInfo from 'src/components/Users/DisplayUser/UserInfo';
import UserCheckouts from 'src/components/Users/DisplayUser/UserCheckouts';

import UserInterface from '@common/types/User';
import { doc } from 'firebase/firestore';

interface UserInterfaceWithID extends UserInterface {
  id?: string;
}
const DisplayUser = () => {
  const firestore = useFirestore();
  const { id }: { id: string } = useParams();
  const ref = doc(firestore, 'users', id);
  const data = useFirestoreDocData(ref, {
    idField: 'id',
  }).data as unknown as UserInterfaceWithID;

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

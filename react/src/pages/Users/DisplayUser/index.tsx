import React, { useContext } from 'react';
import Paper from '@mui/material/Paper';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { useParams } from 'react-router-dom';

import 'src/pages/Users/users.css';
import UserInfo from 'src/pages/Users/DisplayUser/UserInfo';
import UserCheckouts from 'src/pages/Users/DisplayUser/UserCheckouts';

import UserInterface from '@common/types/User';
import { doc } from 'firebase/firestore';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';

interface UserInterfaceWithID extends UserInterface {
  id?: string;
}
const DisplayUser = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const firestore = useFirestore();

  const { id } = useParams();
  if (id === undefined) throw new Error('No user defined.');

  const ref = doc(firestore, 'libraries', activeLibraryID, 'users', id);
  const data = useFirestoreDocData(ref, {
    idField: 'id',
  }).data as unknown as UserInterfaceWithID;

  if (!data)
    return (
      <div style={{ margin: '4rem', textAlign: 'center' }}>
        <h1>User not found.</h1>
      </div>
    );

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
          <UserInfo user={data} />
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
          <UserCheckouts user={data} />
        </div>
      </Paper>
    </div>
  );
};

export default DisplayUser;

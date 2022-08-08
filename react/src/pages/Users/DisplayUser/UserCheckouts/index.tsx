import React, { useContext } from 'react';
import { useUser } from 'reactfire';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

import User from '@common/types/User';

import ActiveLibraryID from 'src/contexts/ActiveLibraryID';

const UserCheckouts = ({ user }: { user: User }) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');

  const currentUser = useUser().data;
  if (currentUser === null) throw new Error('User does not exist.');

  const { id } = useParams<any>();
  if (id === undefined) throw new Error('No user defined.');

  return (
    <div className="text-center">
      <h3>Checkouts</h3>
      <h5>
        {user?.activeCheckouts?.length ?? 0} active checkout
        {(user?.activeCheckouts?.length ?? 0) === 1 ? '' : 's'}
      </h5>
      <br />

      <Button
        variant="contained"
        color="primary"
        type="button"
        size="large"
        disabled
      >
        View User&apos;s Checkouts{' '}
      </Button>
    </div>
  );
};

export default UserCheckouts;

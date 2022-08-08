import React, { useState, useContext, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { useFunctions } from 'reactfire';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

import approveUserData from '@common/functions/approveUser';
import JoinRequest from '@common/types/JoinRequest';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import NotificationContext from 'src/contexts/NotificationContext';

const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    (txt) => `${txt.charAt(0).toUpperCase()}${txt.substring(1).toLowerCase()}`
  );

const ApproveUserDialog = ({
  joinRequest,
  closeDialog,
}: {
  joinRequest: JoinRequest | null;
  closeDialog: () => void;
}) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID');

  const NotificationHandler = useContext(NotificationContext);

  const functions = useFunctions();
  const approveUser = httpsCallable(functions, 'approveUser');

  const [firstName, setFirstName] = useState(
    toTitleCase(joinRequest?.firstName || '')
  );
  const [lastName, setLastName] = useState(
    toTitleCase(joinRequest?.lastName || '')
  );
  const [email, setEmail] = useState(joinRequest?.email || '');
  const [expiration, setExpiration] = useState(new Date('5/26/2023').valueOf());

  useEffect(() => {
    if (joinRequest) {
      setFirstName(toTitleCase(joinRequest?.firstName || ''));
      setLastName(toTitleCase(joinRequest?.lastName || ''));
      setEmail(joinRequest.email);
      setExpiration(new Date('5/27/2023').valueOf());
    }
  }, [joinRequest]);

  return (
    <Dialog open={!!joinRequest} onClose={closeDialog}>
      <DialogTitle>Approve User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Before review the following information and adjust capitalization and
          spelling as needed.
        </DialogContentText>
        <br />
        <TextField
          id="firstName"
          label="First Name"
          type="text"
          fullWidth
          variant="standard"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
        <br />
        <br />
        <TextField
          id="lastName"
          label="Last Name"
          type="text"
          fullWidth
          variant="standard"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
        <br />
        <br />
        <TextField
          id="email"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />
        <br />
        <TextField
          id="expiration"
          label="Expiration"
          type="date"
          fullWidth
          variant="standard"
          value={new Date(expiration).toISOString().split('T')[0]}
          onChange={(e: any) => {
            setExpiration(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          onClick={async () => {
            if (joinRequest) {
              const functionParams: approveUserData = {
                uid: joinRequest.uid,
                email,
                firstName,
                lastName,
                libraryID: activeLibraryID,
                expiration,
              };
              const result = await approveUser(functionParams).catch((err) => {
                console.error(err);
                NotificationHandler.addNotification({
                  message: `An error occured while trying to approve a user: ${err.message}`,
                  severity: 'error',
                });
              });

              if (result) {
                NotificationHandler.addNotification({
                  message: `User Approved`,
                  severity: 'success',
                });
                closeDialog();
              }
            }
          }}
        >
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveUserDialog;

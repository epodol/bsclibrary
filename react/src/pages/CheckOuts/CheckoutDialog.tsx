import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useFirestore, useFirestoreDocData } from 'reactfire';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';

import CheckoutType, { checkoutStatus } from '@common/types/Checkout';
import Copy, { condition } from '@common/types/Copy';

import Book from '@common/types/Book';
import User from '@common/types/User';
import WithID from '@common/types/util/WithID';
import NotificationContext from 'src/contexts/NotificationContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router';

function determineCondition(conditionArg: condition | null) {
  switch (conditionArg) {
    case 1:
      return 'New';
    case 2:
      return 'Good';
    case 3:
      return 'Fair';
    case 4:
      return 'Poor';
    case 5:
      return 'Bad';
    case null:
      return '';
    default:
      return 'Unknown Condition';
  }
}

function determineStatus(checkoutStatusArg: checkoutStatus) {
  switch (checkoutStatusArg) {
    case 0:
      return 'Active';
    case 1:
      return 'Returned';
    case 2:
      return 'Returned Overdue';
    case 3:
      return 'Missing';
    default:
      return 'Unknown Condition';
  }
}

const CheckoutDialog = () => {
  const params = useParams() as any;

  if (params === null) throw new Error('No checkout specified.');

  const firebaseContext = useContext(FirebaseContext);
  const NotificationHandler = useContext(NotificationContext);

  const navigate = useNavigate();
  const firestore = useFirestore();

  const checkout = useFirestoreDocData(doc(firestore, 'checkouts', params.id), {
    idField: 'ID',
  }).data as unknown as WithID<CheckoutType>;

  const user = useFirestoreDocData(doc(firestore, 'users', checkout.userID), {
    idField: 'ID',
  }).data as unknown as WithID<User>;

  const book = useFirestoreDocData(doc(firestore, 'books', checkout.bookID), {
    idField: 'ID',
  }).data as unknown as WithID<Book>;

  const copy = useFirestoreDocData(
    doc(firestore, 'books', checkout.bookID, 'copies', checkout.copyID),
    { idField: 'ID' }
  ).data as unknown as WithID<Copy>;

  const [open, setOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dueDate, setDueDate] = useState(
    new Date(
      checkout.dueDate.toMillis() -
        new Date(checkout.dueDate.toMillis()).getTimezoneOffset() * 60000
    )
      .toISOString()
      .split('T')[0]
  );

  return (
    <Dialog
      open={open}
      TransitionProps={{
        onExited: () => {
          navigate(`/checkouts`);
        },
      }}
      onClose={() => setOpen(false)}
      scroll="body"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>
        Checkout Info <Chip label={determineStatus(checkout.checkoutStatus)} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          User:{' '}
          {firebaseContext?.claims?.permissions?.MANAGE_USERS && (
            <Link to={`/users/${user.ID}`}>
              {user.userInfo.firstName} {user.userInfo.lastName}
            </Link>
          )}
          {!firebaseContext?.claims?.permissions?.MANAGE_USERS && (
            <>
              {user.userInfo.firstName} {user.userInfo.lastName}
            </>
          )}
          <br />
          Book:{' '}
          <Link to={`/books/${book.ID}`}>
            {book.volumeInfo.title} <i>{book.volumeInfo.subtitle}</i>
          </Link>
          <br />
          Copy: #{copy.identifier}
        </DialogContentText>
        <hr />
        <div>
          <ul>
            <li>
              <b>Time Out:</b>{' '}
              {firebaseContext?.claims?.permissions?.MANAGE_USERS && (
                <Link to={`/users/${checkout.checkedOutBy}`}>
                  {checkout?.timeOut?.toDate()?.toLocaleString() || ''}
                </Link>
              )}
              {!firebaseContext?.claims?.permissions?.MANAGE_USERS && (
                <>{checkout?.timeOut?.toDate()?.toLocaleString() || ''}</>
              )}
            </li>
            <li>
              <b>Time In:</b>{' '}
              {firebaseContext?.claims?.permissions?.MANAGE_USERS && (
                <Link to={`/users/${checkout.checkedInBy}`}>
                  {checkout?.timeIn?.toDate()?.toLocaleString() || ''}
                </Link>
              )}
              {!firebaseContext?.claims?.permissions?.MANAGE_USERS && (
                <>{checkout?.timeIn?.toDate()?.toLocaleString() || ''}</>
              )}
            </li>
            <br />
            <li>
              <b>Condition Out:</b> {determineCondition(checkout.conditionOut)}
            </li>
            <li>
              <b>Condition In:</b> {determineCondition(checkout.conditionIn)}
            </li>
            <br />
            <li>
              <b>Renews Used:</b> {checkout.renewsUsed} /{' '}
              {user.checkoutInfo.maxRenews ?? 0}
            </li>
          </ul>
        </div>
        <hr />
        <div>
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(event: any) => {
              setDueDate(event.target.value);
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsSubmitting(true);
            const newData = {
              dueDate: Timestamp.fromDate(
                new Date(new Date(dueDate).setHours(41, 0, 0, 0))
              ),
            } as Partial<CheckoutType>;

            setDoc(doc(firestore, 'checkouts', checkout.ID), newData, {
              merge: true,
            })
              .then(() => {
                NotificationHandler.addNotification({
                  message: 'The due date has been updated.',
                  severity: 'success',
                });
              })
              .catch(() => {
                NotificationHandler.addNotification({
                  message: 'There was an error updating the due date.',
                  severity: 'error',
                });
              })
              .finally(() => {
                setOpen(false);
              });
          }}
        >
          {!isSubmitting && <>Update Due Date</>}
          {isSubmitting && (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </Button>
        <Button
          onClick={() => setOpen(false)}
          color="primary"
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;

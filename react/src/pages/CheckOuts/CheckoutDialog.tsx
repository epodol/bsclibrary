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

import CheckoutType from '@common/types/Checkout';
import Copy from '@common/types/Copy';

import Book from '@common/types/Book';
import User from '@common/types/User';
import WithID from '@common/types/util/WithID';
import NotificationContext from 'src/contexts/NotificationContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { useParams } from 'react-router';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Library from '@common/types/Library';

const CheckoutDialog = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');

  const params = useParams() as any;

  if (params === null) throw new Error('No checkout specified.');

  const NotificationHandler = useContext(NotificationContext);

  const navigate = useNavigate();
  const firestore = useFirestore();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const checkout = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'checkouts', params.id),
    {
      idField: 'ID',
    }
  ).data as unknown as WithID<CheckoutType>;

  const user = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'users', checkout.userID),
    {
      idField: 'ID',
    }
  ).data as unknown as WithID<User>;

  const book = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'books', checkout.bookID),
    {
      idField: 'ID',
    }
  ).data as unknown as WithID<Book>;

  const copy = useFirestoreDocData(
    doc(
      firestore,
      'libraries',
      activeLibraryID,
      'books',
      checkout.bookID,
      'copies',
      checkout.copyID
    ),
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
        Checkout Info <Chip label={checkout.timeIn ? 'Returned' : 'Active'} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          User:{' '}
          {(libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
            libraryDoc.ownerUserID === user.uid) && (
            <Link to={`/users/${user.ID}`}>
              {user.firstName} {user.lastName}
            </Link>
          )}
          {!(
            libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
            libraryDoc.ownerUserID === user.uid
          ) && (
            <>
              {user.firstName} {user.lastName}
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
              {(libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid) && (
                <Link to={`/users/${checkout.checkedOutBy}`}>
                  {checkout?.timeOut?.toDate()?.toLocaleString() || ''}
                </Link>
              )}
              {!(
                libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid
              ) && <>{checkout?.timeOut?.toDate()?.toLocaleString() || ''}</>}
            </li>
            <li>
              <b>Time In:</b>{' '}
              {(libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid) && (
                <Link to={`/users/${checkout.checkedInBy}`}>
                  {checkout?.timeIn?.toDate()?.toLocaleString() || ''}
                </Link>
              )}
              {!(
                libraryDoc.userPermissions.MANAGE_USERS.includes(user.uid) ||
                libraryDoc.ownerUserID === user.uid
              ) && <>{checkout?.timeIn?.toDate()?.toLocaleString() || ''}</>}
            </li>
            <br />
            <li>
              <b>Condition Out:</b>{' '}
              {libraryDoc.conditionOptions[checkout.conditionOut]}
            </li>
            <li>
              <b>Condition In:</b>{' '}
              {checkout.conditionIn &&
                libraryDoc.conditionOptions[checkout.conditionIn]}
            </li>
            <br />
            <li>
              <b>Renews Used:</b> {checkout.renewsUsed} /{' '}
              {libraryDoc.checkoutGroups[user.checkoutGroup].maxRenews}
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
            disabled={checkout.timeIn !== null}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={checkout.timeIn !== null}
          onClick={() => {
            setIsSubmitting(true);
            const newData = {
              dueDate: Timestamp.fromDate(
                new Date(new Date(dueDate).setHours(41, 0, 0, 0))
              ),
            } as Partial<CheckoutType>;

            setDoc(
              doc(
                firestore,
                'libraries',
                activeLibraryID,
                'checkouts',
                checkout.ID
              ),
              newData,
              {
                merge: true,
              }
            )
              .then(() => {
                NotificationHandler.addNotification({
                  message: 'The due date has been updated.',
                  severity: 'success',
                });
              })
              .catch((err) => {
                console.error(err);
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

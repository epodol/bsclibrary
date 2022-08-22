import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';

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

  const activeUser = useUser().data;
  if (!activeUser) throw new Error('No active user!');

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
        Checkout Info{' '}
        <Chip
          color={checkout.timeIn ? 'default' : 'primary'}
          label={checkout.timeIn ? 'Returned' : 'Active'}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {(libraryDoc.userPermissions.MANAGE_USERS.includes(activeUser.uid) ||
            libraryDoc.ownerUserID === user.uid) && (
            <Link to={`/users/${user.ID}`}>User: </Link>
          )}
          {!(
            libraryDoc.userPermissions.MANAGE_USERS.includes(activeUser.uid) ||
            libraryDoc.ownerUserID === user.uid
          ) && <>User: </>}
          <Chip
            sx={{
              marginInline: 1,
            }}
            onClick={() => {
              navigator.clipboard
                .writeText(`${user.firstName} ${user.lastName}`)
                .then(() => {
                  NotificationHandler.addNotification({
                    message: 'Name copied to clipboard!',
                    severity: 'success',
                    timeout: 1000,
                  });
                });
            }}
            label={`${user.firstName} ${user.lastName}`}
          />
          <Chip
            sx={{
              marginInline: 1,
            }}
            onClick={() => {
              navigator.clipboard.writeText(user.email).then(() => {
                NotificationHandler.addNotification({
                  message: 'Email copied to clipboard!',
                  severity: 'success',
                  timeout: 1000,
                });
              });
            }}
            label={user.email}
          />
          <br />
          <br />
          <Link to={`/books/${book.ID}`}>Book: </Link>
          <Chip
            sx={{
              marginInline: 1,
            }}
            onClick={() => {
              navigator.clipboard.writeText(book.volumeInfo.title).then(() => {
                NotificationHandler.addNotification({
                  message: 'Title copied to clipboard!',
                  severity: 'success',
                  timeout: 1000,
                });
              });
            }}
            label={book.volumeInfo.title}
          />
          <Chip
            sx={{
              marginInline: 1,
            }}
            onClick={() => {
              navigator.clipboard
                .writeText(book.volumeInfo.subtitle)
                .then(() => {
                  NotificationHandler.addNotification({
                    message: 'Subtitle copied to clipboard!',
                    severity: 'success',
                    timeout: 1000,
                  });
                });
            }}
            label={book.volumeInfo.subtitle}
          />
          <br />
          <br />
          Copy:{' '}
          <Chip
            sx={{
              marginInline: 1,
            }}
            onClick={() => {
              navigator.clipboard.writeText(copy.identifier).then(() => {
                NotificationHandler.addNotification({
                  message: 'Copy identifier copied to clipboard!',
                  severity: 'success',
                  timeout: 1000,
                });
              });
            }}
            label={copy.identifier}
          />
        </DialogContentText>
        <hr />
        <div>
          <ul>
            <li>
              <b>Time Out:</b>{' '}
              {(libraryDoc.userPermissions.MANAGE_USERS.includes(
                activeUser.uid
              ) ||
                libraryDoc.ownerUserID === user.uid) && (
                <Link to={`/users/${checkout.checkedOutBy}`}>
                  {checkout?.timeOut?.toDate()?.toLocaleString() || ''}
                </Link>
              )}
              {!(
                libraryDoc.userPermissions.MANAGE_USERS.includes(
                  activeUser.uid
                ) || libraryDoc.ownerUserID === user.uid
              ) && <>{checkout?.timeOut?.toDate()?.toLocaleString() || ''}</>}
            </li>
            <li>
              <b>Time In:</b>{' '}
              {(libraryDoc.userPermissions.MANAGE_USERS.includes(
                activeUser.uid
              ) ||
                libraryDoc.ownerUserID === user.uid) && (
                <Link to={`/users/${checkout.checkedInBy}`}>
                  {checkout?.timeIn?.toDate()?.toLocaleString() || ''}
                </Link>
              )}
              {!(
                libraryDoc.userPermissions.MANAGE_USERS.includes(
                  activeUser.uid
                ) || libraryDoc.ownerUserID === user.uid
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
        {!checkout.timeIn && (
          <Button
            onClick={() => {
              window.open(
                `mailto:${user.email}?subject=Your book, ${book.volumeInfo.title}, will be due soon!&body=Hello ${user.firstName} ${user.lastName},%0D%0A%0D%0AThis is a reminder that your book, ${book.volumeInfo.title} (https://bsclibrary.net/books/${book.ID}), is due soon.%0D%0A%0D%0APlease return it or renew it on our website (https://bsclibrary.net/account).%0D%0A%0D%0AThank you,%0D%0A%0D%0A${libraryDoc.name}%0D%0Ahttps://bsclibrary.net`
              );
            }}
            color="primary"
          >
            Generate &quot;Due Soon&quot; Email
          </Button>
        )}
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

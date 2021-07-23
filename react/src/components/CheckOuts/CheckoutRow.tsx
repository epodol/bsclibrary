import React, { useState, Suspense, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { useFirestore, useFirestoreDocData } from 'reactfire';

import {
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Chip,
} from '@material-ui/core';
import { Launch } from '@material-ui/icons';

import CheckoutType, { checkoutStatus } from '@common/types/Checkout';
import Copy, { condition } from '@common/types/Copy';

import Loading from 'src/components/Loading';

import Book from '@common/types/Book';
import User from '@common/types/User';
import WithID from '@common/types/WithID';
import FirebaseContext from 'src/contexts/FirebaseContext';
import NotificationContext from 'src/contexts/NotificationContext';

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

const CheckoutDialog = ({ checkout }: { checkout: WithID<CheckoutType> }) => {
  const firebaseContext = useContext(FirebaseContext);
  const NotificationHandler = useContext(NotificationContext);

  const history = useHistory();
  const { Timestamp } = useFirestore;
  const firestore = useFirestore();

  const user = useFirestoreDocData(
    firestore.collection('users').doc(checkout.userID),
    { idField: 'ID' }
  ).data as unknown as WithID<User>;

  const book = useFirestoreDocData(
    firestore.collection('books').doc(checkout.bookID),
    { idField: 'ID' }
  ).data as unknown as WithID<Book>;

  const copy = useFirestoreDocData(
    firestore
      .collection('books')
      .doc(checkout.bookID)
      .collection('copies')
      .doc(checkout.copyID),
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
          history.push(`/checkouts`);
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
          Copy: #{copy.barcode}
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

            firestore
              .collection('checkouts')
              .doc(checkout.ID)
              .set(newData, { merge: true })
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

const Checkout = ({ checkout }: { checkout: WithID<CheckoutType> }) => {
  const history = useHistory();
  const params = useParams() as any;
  return (
    <>
      <TableRow>
        <TableCell>{checkout.dueDate?.toDate().toDateString()}</TableCell>
        <TableCell>{checkout.timeOut?.toDate().toLocaleString()}</TableCell>
        <TableCell>
          {checkout.timeIn?.toDate().toLocaleString() ?? ''}
        </TableCell>
        <TableCell>{determineCondition(checkout.conditionOut)}</TableCell>
        <TableCell>{determineCondition(checkout.conditionIn) ?? ''}</TableCell>
        <TableCell>{checkout.renewsUsed}</TableCell>
        <TableCell>{determineStatus(checkout.checkoutStatus)}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              history.push(`/checkouts/${checkout.ID}`);
            }}
          >
            <Launch />
          </IconButton>
          {params?.id === checkout.ID && (
            <Suspense fallback={<Loading />}>
              <CheckoutDialog checkout={checkout} />
            </Suspense>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default Checkout;

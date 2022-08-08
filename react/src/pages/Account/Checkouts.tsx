import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';
import {
  useFirestore,
  useFirestoreDocData,
  useFunctions,
  useUser,
} from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { doc } from 'firebase/firestore';

import Checkout from '@common/types/Checkout';
import NotificationContext from 'src/contexts/NotificationContext';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import User from '@common/types/User';
import Library from '@common/types/Library';

const CheckoutRow = ({ checkoutID }: { checkoutID: string }) => {
  const NotificationHandler = useContext(NotificationContext);
  const functions = useFunctions();
  const firestore = useFirestore();

  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library found!');

  const user = useUser().data;
  if (!user) throw new Error('No user signed in!');

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  const userDoc: User = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID, 'users', user.uid)
  ).data as User;

  const checkoutRef = doc(
    firestore,
    'libraries',
    activeLibraryID,
    'checkouts',
    checkoutID
  );
  const checkout = useFirestoreDocData(checkoutRef).data as unknown as Checkout;
  return (
    <TableRow>
      <TableCell>
        {(checkout?.dueDate?.toMillis() ?? 99999999999999) > Date.now()
          ? 'Active'
          : 'Overdue'}
      </TableCell>
      <TableCell>
        {checkout?.dueDate?.toDate()?.toDateString() ?? 'Loading'}
      </TableCell>
      <TableCell>
        {checkout.renewsUsed} /{' '}
        {libraryDoc.checkoutGroups[userDoc.checkoutGroup].maxRenews ?? 0}
        <Button
          style={{
            marginLeft: '1rem',
          }}
          variant="contained"
          disabled={
            (libraryDoc.checkoutGroups[userDoc.checkoutGroup].maxRenews ?? 0) -
              checkout.renewsUsed <=
              0 || checkout.dueDate.toMillis() > Date.now()
          }
          onClick={() => {
            httpsCallable(
              functions,
              'renewCheckout'
            )({ checkoutID, libraryID: activeLibraryID })
              .then(() => {
                NotificationHandler.addNotification({
                  message: 'Checkout renewed',
                  severity: 'success',
                });
              })
              .catch((err) => {
                NotificationHandler.addNotification({
                  message: `An error occurred while renewing the checkout: ${err.code} ${err.message}`,
                  severity: 'error',
                });
              });
          }}
        >
          Renew (+
          {libraryDoc.checkoutGroups[userDoc.checkoutGroup].renewDuration} Days)
        </Button>
      </TableCell>
      <TableCell>
        <Link to={`/books/${checkout.bookID}`}>View Book</Link>
      </TableCell>
    </TableRow>
  );
};

const Checkouts = ({ userCheckoutIDs }: { userCheckoutIDs: string[] }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Status</TableCell>
        <TableCell>Due Date</TableCell>
        <TableCell>Renewals</TableCell>
        <TableCell>Book</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {userCheckoutIDs.map((checkoutID) => (
        <CheckoutRow checkoutID={checkoutID} key={checkoutID} />
      ))}
    </TableBody>
  </Table>
);

export default Checkouts;

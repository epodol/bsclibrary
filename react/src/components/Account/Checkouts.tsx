import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@material-ui/core';
import { useFirestore, useFirestoreDocData, useFunctions } from 'reactfire';

import Checkout from '@common/types/Checkout';
import FirebaseContext from 'src/contexts/FirebaseContext';
import NotificationContext from 'src/contexts/NotificationContext';
import { httpsCallable } from 'firebase/functions';
import { doc } from 'firebase/firestore';

const CheckoutRow = ({ checkoutID }: { checkoutID: string }) => {
  const NotificationHandler = useContext(NotificationContext);
  const firebaseContext = useContext(FirebaseContext);
  const functions = useFunctions();
  const firestore = useFirestore();
  const checkoutRef = doc(firestore, 'checkouts', checkoutID);
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
        {firebaseContext.userDoc?.checkoutInfo?.maxRenews ?? 0}
        <Button
          style={{
            marginLeft: '1rem',
          }}
          variant="contained"
          color="inherit"
          disabled={
            (firebaseContext.userDoc?.checkoutInfo?.maxRenews ?? 0) -
              checkout.renewsUsed <=
            0
          }
          onClick={() => {
            httpsCallable(
              functions,
              'renewCheckout'
            )({ checkoutID })
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
          Renew (+7 Days)
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

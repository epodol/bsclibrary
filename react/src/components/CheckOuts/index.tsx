import React, { useState } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
  Timestamp,
  query as firestoreQuery,
  collection,
  orderBy,
  where,
} from 'firebase/firestore';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import CheckoutRow from 'src/components/CheckOuts/CheckoutRow';
import Checkout, { checkoutStatus } from '@common/types/Checkout';
import WithID from '@common/types/WithID';
import { Outlet } from 'react-router';

const CheckOuts = () => {
  const firestore = useFirestore();
  const now = Timestamp.fromMillis(
    new Date(new Date().toDateString()).valueOf()
  );

  interface queryInterface {
    checkoutStatus: checkoutStatus | null;
    showOverdue: boolean;
  }
  const [query, setQuery] = useState<queryInterface>({
    checkoutStatus: null,
    showOverdue: false,
  });

  const useCheckoutRef = (queryArg: queryInterface) => {
    let checkoutRef = firestoreQuery(
      collection(firestore, 'checkouts'),
      orderBy('dueDate')
    );
    if (queryArg.checkoutStatus !== null) {
      checkoutRef = firestoreQuery(
        checkoutRef,
        where('checkoutStatus', '==', queryArg.checkoutStatus)
      );
    }
    if (queryArg.showOverdue) {
      checkoutRef = firestoreQuery(checkoutRef, where('dueDate', '<=', now));
    }
    return checkoutRef;
  };

  const checkouts = useFirestoreCollectionData(useCheckoutRef(query), {
    idField: 'ID',
  }).data as unknown as WithID<Checkout>[];

  return (
    <div className="text-center lead m-5">
      <h1>Check Outs</h1>
      <Outlet />
      <TableContainer component={Paper}>
        <div style={{ margin: '1%' }}>
          <FormControl>
            <InputLabel shrink id="status-label">
              Status
            </InputLabel>
            <Select
              labelId="status-label"
              id="status-label"
              value={query.checkoutStatus ?? ''}
              onChange={(e: any) => {
                setQuery({
                  ...query,
                  checkoutStatus:
                    e.target.value !== ''
                      ? (e.target.value as checkoutStatus)
                      : null,
                });
              }}
              displayEmpty
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              <MenuItem value={0}>Active</MenuItem>
              <MenuItem value={1}>Returned</MenuItem>
              <MenuItem value={2}>Returned Overdue</MenuItem>
              <MenuItem value={3}>Missing</MenuItem>
            </Select>
            <FormHelperText>Show only</FormHelperText>
          </FormControl>
          <br />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={query.showOverdue}
                onChange={(e: any) => {
                  setQuery({
                    ...query,
                    showOverdue: e.target.checked as boolean,
                  });
                }}
              />
            }
            label="Show Only Overdue Books"
          />
          <hr />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="h4">Due Date</TableCell>
                <TableCell className="h4">Time Out</TableCell>
                <TableCell className="h4">Time In</TableCell>
                <TableCell className="h4">Condition Out</TableCell>
                <TableCell className="h4">Condition In</TableCell>
                <TableCell className="h4">Renews Used</TableCell>
                <TableCell className="h4">Status</TableCell>
                <TableCell padding="none" />
              </TableRow>
            </TableHead>
            <TableBody>
              {checkouts.map((checkout) => (
                <CheckoutRow key={checkout.ID} checkout={checkout} />
              ))}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </div>
  );
};

export default CheckOuts;

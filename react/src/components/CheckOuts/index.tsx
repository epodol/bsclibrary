import React, { useState, ChangeEvent } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

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
} from '@material-ui/core';

import CheckoutRow from 'src/components/CheckOuts/CheckoutRow';
import Checkout, { checkoutStatus } from '@common/types/Checkout';
import WithID from '@common/types/WithID';

const CheckOuts = () => {
  const firestore = useFirestore();
  const now = useFirestore.Timestamp.fromMillis(
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
    let checkoutRef = firestore.collection('checkouts').orderBy('dueDate');
    if (queryArg.checkoutStatus !== null) {
      checkoutRef = checkoutRef.where(
        'checkoutStatus',
        '==',
        queryArg.checkoutStatus
      );
    }
    if (queryArg.showOverdue) {
      checkoutRef = checkoutRef.where('dueDate', '<=', now);
    }
    return checkoutRef;
  };

  const checkouts = useFirestoreCollectionData(useCheckoutRef(query), {
    idField: 'ID',
  }).data as unknown as WithID<Checkout>[];

  console.log(checkouts);
  return (
    <div className="text-center lead m-5">
      <h1>Check Outs</h1>
      <p className="font-italic">This page is still a work in progress.</p>
      <TableContainer component={Paper}>
        <div style={{ margin: '1%' }}>
          <FormControl>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Status
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={query.checkoutStatus ?? ''}
              onChange={(e: ChangeEvent<{ value: unknown }>) => {
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

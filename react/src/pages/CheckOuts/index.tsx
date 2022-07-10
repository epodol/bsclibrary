import React, { useContext } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import {
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
  TableSortLabel,
  ButtonGroup,
  Button,
} from '@mui/material';

import CheckoutRow from 'src/pages/CheckOuts/CheckoutRow';
import Checkout from '@common/types/Checkout';
import WithID from '@common/types/util/WithID';
import { Outlet } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';

const tableHeadRows = [
  { id: 'timeOut', label: 'Time Out' },
  { id: 'timeIn', label: 'Time In' },
  { id: 'dueDate', label: 'Due Date' },
  { id: 'conditionOut', label: 'Condition Out' },
  { id: 'conditionIn', label: 'Condition In' },
  { id: 'conditionDiff', label: 'Condition Change' },
  { id: 'renewsUsed', label: 'Renews Used' },
];

const useBuildCheckoutsQuery = (searchParams: URLSearchParams) => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');

  const firestore = useFirestore();

  let query = firestoreQuery(
    collection(firestore, 'libraries', activeLibraryID, 'checkouts')
  );

  const sortBy = searchParams.get('sortBy');

  if (sortBy !== null && tableHeadRows.map((row) => row.id).includes(sortBy)) {
    query = firestoreQuery(
      query,
      orderBy(sortBy, searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc')
    );
  }

  const status = searchParams.get('status');
  if (status === 'active') {
    query = firestoreQuery(query, where('timeIn', '==', null));
  }
  if (status === 'returned') {
    query = firestoreQuery(query, where('returned', '==', true));
  }

  return query;
};

const CheckOuts = () => {
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useBuildCheckoutsQuery(searchParams);

  const checkouts = useFirestoreCollectionData(query, {
    idField: 'ID',
  }).data as unknown as WithID<Checkout>[];

  return (
    <div className="text-center lead m-5">
      <h1>Check Outs</h1>
      <Outlet />
      <TableContainer component={Paper}>
        <div style={{ margin: '1%' }}>
          <br />
          <ButtonGroup>
            <Button
              disabled={searchParams.get('status') === null}
              onClick={() => {
                searchParams.delete('status');
                setSearchParams(searchParams);
              }}
            >
              Active and Returned
            </Button>
            <Button
              disabled={searchParams.get('status') === 'active'}
              onClick={() => {
                searchParams.set('status', 'active');
                setSearchParams(searchParams);
              }}
            >
              Active Only
            </Button>
            <Button
              disabled={searchParams.get('status') === 'returned'}
              onClick={() => {
                searchParams.set('status', 'returned');
                setSearchParams(searchParams);
              }}
            >
              Returned Only
            </Button>
          </ButtonGroup>
          <hr />
          <Table>
            <TableHead>
              <TableRow>
                {tableHeadRows.map((row) => (
                  <TableCell key={row.id} className="h4">
                    <TableSortLabel
                      active={searchParams.get('sortBy') === row.id}
                      direction={
                        searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc'
                      }
                      onClick={() => {
                        if (searchParams.get('sortBy') === row.id) {
                          searchParams.set(
                            'sortDir',
                            searchParams.get('sortDir') === 'asc'
                              ? 'desc'
                              : 'asc'
                          );
                        } else {
                          searchParams.set('sortDir', 'asc');
                        }

                        searchParams.set('sortBy', row.id);
                        setSearchParams(searchParams);
                      }}
                    >
                      {row.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell padding="none" />
              </TableRow>
            </TableHead>
            <TableBody>
              {checkouts.map((checkout) => (
                <CheckoutRow key={checkout.ID} checkout={checkout} />
              ))}
            </TableBody>
          </Table>
          {checkouts.length === 0 && (
            <div>
              <h3 className="text-center mt-4 mb-4">No results found.</h3>
              <Button
                onClick={() => {
                  searchParams.delete('sortBy');
                  searchParams.delete('sortDir');
                  setSearchParams(searchParams);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </TableContainer>
    </div>
  );
};

export default CheckOuts;

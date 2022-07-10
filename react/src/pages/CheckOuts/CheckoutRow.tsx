import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { TableRow, TableCell, IconButton } from '@mui/material';
import { Launch } from '@mui/icons-material';

import CheckoutType from '@common/types/Checkout';

import WithID from '@common/types/util/WithID';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import ActiveLibraryID from 'src/contexts/ActiveLibraryID';
import Library from '@common/types/Library';
import { doc } from 'firebase/firestore';

const Checkout = ({ checkout }: { checkout: WithID<CheckoutType> }) => {
  const navigate = useNavigate();
  const activeLibraryID = useContext(ActiveLibraryID);
  if (!activeLibraryID) throw new Error('No active library ID!');

  const firestore = useFirestore();

  const libraryDoc: Library = useFirestoreDocData(
    doc(firestore, 'libraries', activeLibraryID)
  ).data as Library;

  return (
    <>
      <TableRow>
        <TableCell>{checkout.timeOut?.toDate().toLocaleString()}</TableCell>
        <TableCell>
          {checkout.timeIn?.toDate().toLocaleString() ?? ''}
        </TableCell>
        <TableCell>{checkout.dueDate?.toDate().toDateString()}</TableCell>
        <TableCell>
          {libraryDoc.conditionOptions[checkout.conditionOut]}
        </TableCell>
        <TableCell>
          {checkout.conditionIn &&
            libraryDoc.conditionOptions[checkout.conditionIn]}
        </TableCell>
        <TableCell>{checkout.conditionDiff}</TableCell>
        <TableCell>{checkout.renewsUsed}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/checkouts/${checkout.ID}`);
            }}
          >
            <Launch />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Checkout;

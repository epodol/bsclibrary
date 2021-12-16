import React from 'react';
import { useNavigate } from 'react-router-dom';

import { TableRow, TableCell, IconButton } from '@material-ui/core';
import { Launch } from '@material-ui/icons';

import CheckoutType, { checkoutStatus } from '@common/types/Checkout';
import { condition } from '@common/types/Copy';

import WithID from '@common/types/WithID';

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

const Checkout = ({ checkout }: { checkout: WithID<CheckoutType> }) => {
  const navigate = useNavigate();
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

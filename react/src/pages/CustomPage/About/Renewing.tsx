import React from 'react';
import { Container } from '@mui/material';

const Renewing = () => (
  <Container>
    <h1 className="flex-center m-3">Renewing Policy</h1>
    <div>
      <li>
        All students will be allowed to renew a book for{' '}
        <b className="font-weight-bold">7 calendar days</b>, up to{' '}
        <b className="font-weight-bold">two times</b>.
        <ul>
          <li>
            Example: A book was checked out on Monday, 08/02/2021. It will be
            due on Monday, 08/16/2021. If the book was renewed once, it would be
            due on Monday, 08/23/2021. If the book was renewed again, it would
            be due on Monday, 08/30/2021.
          </li>
        </ul>
      </li>
      <li>
        A book can be renewed at any time before it is due.
        <ul>
          <li>The 7 day renewal will be added onto the due date.</li>
        </ul>
      </li>
    </div>
  </Container>
);

export default Renewing;

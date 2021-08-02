import React from 'react';
import { Container } from '@material-ui/core';

const DueDates = () => (
  <Container>
    <h1 className="flex-center m-3">Due Dates Policy</h1>
    <div>
      <li>
        Normal Books shall be due{' '}
        <b className="font-weight-bold">14 calendar days</b> after their
        checkout date
        <ul>
          <li>
            Example: A book was checked out on Monday, 08/01/2021. It will be
            due on Monday, 08/15/2021
          </li>
        </ul>
      </li>
      <li>
        Books will be due at <b className="font-weight-bold">5:00 pm</b> on
        their Due Date
        <ul>
          <li>
            The library may be closed before this, so be sure to check when the
            library will close on the day your book is due.
          </li>
          <li>
            Example: A book was checked out on Monday, 08/01/2021 at 7:50 am. It
            will be due on 08/15/2021 at 5:00 pm.
          </li>
        </ul>
      </li>
      <li>
        In the event that a book will due on an academic or national holiday or
        break, the book will be due on{' '}
        <b className="font-weight-bold">the first day back</b>.
        <ul>
          <li>
            Example: A book was checked out on Monday, 12/11/2021. It will
            normally be due on 12/25/2021, however, due to the break, it will be
            due on 01/03/2022, the first day back.
          </li>
        </ul>
      </li>
      <li>
        Up to <b className="font-weight-bold">three books</b> may be checked out
        at any given time.
        <ul>
          <li>There are exceptions to this rule.</li>
        </ul>
      </li>
    </div>
  </Container>
);

export default DueDates;

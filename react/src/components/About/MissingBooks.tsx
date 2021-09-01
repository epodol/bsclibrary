import React from 'react';
import { Container } from '@material-ui/core';

const MissingBooks = () => (
  <Container>
    <h1 className="flex-center m-3">Missing Books Policy</h1>
    <div>
      <li>
        A book will be considered missing if it has not been returned{' '}
        <b className="font-weight-bold">within 3 calendar days</b> after it was
        due and no communication was made to the BASIS Scottsdale Library
        Committee.
        <ul>
          <li>
            In the event of a missing book, the information about the book, its
            value, and the person who checked out the book, will be given to the
            respective dean or school administrator to be dealt with as defined
            in the BASIS Scottsdale Parent/Student Handbook “Care of Property”
            section.
          </li>
          <li>
            The school administration will determine the penalty on a
            case-by-case basis, if any.
          </li>
        </ul>
      </li>
      <li>
        A book will be considered overdue if it was returned after the book was
        due.
        <ul>
          <li>
            In the event of three overdue books, information will be given to
            the respective dean or school administrator to be dealt with as
            defined in the BASIS Scottsdale Parent/Student Handbook “Care of
            Property” section.
          </li>
        </ul>
      </li>
    </div>
  </Container>
);

export default MissingBooks;

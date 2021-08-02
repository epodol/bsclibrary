import React from 'react';
import { Container } from '@material-ui/core';

const Donate = () => (
  <Container>
    <h1 className="flex-center m-3">Donate</h1>
    <div>
      <p>We are always looking for new books to have in our library!</p> <br />
      <p>
        Do you have books for 5th-12th graders that are in good condition?
        Please consider donating them to the BASIS Scottsdale Library!
      </p>
      <br />
      <p>
        We have a large donation box in the front office ready to accept
        donations. We ask that books be in good condition (not damaged or
        written in), and be appropriate for the students at our school (5th -
        12th grade).
      </p>
      <p>
        For larger donations, please contact us at{' '}
        <a href="mailto:support@bsclibrary.net">support@bsclibrary.net</a> to
        schedule a pickup time.
      </p>
      <br />
      <p>
        We are also currently accepting donations on our{' '}
        <a
          href="https://wishlist.bsclibrary.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          Amazon wishlist
        </a>
        .
      </p>
      <p>
        When purchasing items from our Amazon wishlist, you directly support our
        Library by contributing books that students or teachers have requested.
        When ordering from our wishlist, your contribution is directly mailed to
        the library.
      </p>
    </div>
  </Container>
);

export default Donate;

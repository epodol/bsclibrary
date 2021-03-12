import React from 'react';
import { MDBContainer } from 'mdbreact';

const Resources = () => (
  <MDBContainer>
    <h1 className="flex-center m-4">Resources</h1>
    <div className="mx-5">
      <h3>Books</h3>
      <p>
        We are always looking for new books to have in our library! <br />
        We are currently accepting donations on our{' '}
        <a
          href="https://wishlist.bsclibrary.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          Amazon wishlist (https://wishlist.bsclibrary.net)
        </a>
        <br />
        <p>We also are accepting gently used books.</p>
      </p>
    </div>
  </MDBContainer>
);

export default Resources;

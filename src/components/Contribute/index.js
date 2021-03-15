import React, { useState } from 'react';
import { MDBBtn, MDBBtnGroup, MDBContainer, MDBJumbotron } from 'mdbreact';
import Time from './Time';
import Resources from './Resources';

const Contribute = () => {
  const [type, setType] = useState(0);
  return (
    <>
      <div className="text-center mt-3">
        <h2>How can you contribute?</h2>
        <p className="font-italic">This page is still a work in progress.</p>
        <MDBBtnGroup size="md" className="">
          <MDBBtn
            color="dark-green"
            active={type === 0}
            onClick={() => setType(0)}
          >
            Time
          </MDBBtn>
          <MDBBtn
            color="dark-green"
            active={type === 1}
            onClick={() => setType(1)}
          >
            Resources
          </MDBBtn>
        </MDBBtnGroup>
      </div>
      <MDBContainer className="mx-auto m-5">
        <MDBJumbotron>
          {type === 0 && <Time />}
          {type === 1 && <Resources />}
        </MDBJumbotron>
      </MDBContainer>
    </>
  );
};
export default Contribute;

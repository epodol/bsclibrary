import React from 'react';
import {
  MDBMask,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBView,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBAnimation,
  MDBAlert,
} from 'mdbreact';
import './home.css';
import SignInForm from './SignInForm';
import { FirebaseContext } from '../../Firebase';

const Home = (props, { location }) => {
  const displayAuthError =
    location && location.state
      ? location.state.error.type === 'auth-required'
      : false;

  return (
    <div id="classicformpage">
      <MDBView>
        <MDBMask className="d-flex justify-content-center align-items-center" />
        {displayAuthError && (
          <MDBContainer
            style={{ height: '100%', width: '100%', paddingTop: '1rem' }}
          >
            <MDBAlert color="warning" dismiss>
              <strong>Holy guacamole!</strong> You should check in on some of
              those fields below.
            </MDBAlert>
          </MDBContainer>
        )}
        <MDBContainer
          style={{ height: '100%', width: '100%', paddingTop: '10rem' }}
          className="mt-5 d-flex justify-content-center align-items-center"
        >
          <MDBRow>
            <MDBAnimation
              type="fadeInLeft"
              delay=".3s"
              className="text-center text-md-center col-md-6 mt-xl-5 mb-5"
            >
              <h1 className="h1-responsive font-weight-bold">
                BASIS Scottsdale Library
              </h1>
              <hr className="hr-dark" />
              <h6 className="mb-4">Cool text about the library</h6>
              <MDBBtn>Learn More</MDBBtn>
            </MDBAnimation>

            <MDBCol md="6" m="5" className="mb-4">
              <MDBAnimation type="fadeInRight" delay=".5s">
                <MDBCard id="classic-card" className="">
                  <MDBCardBody>
                    <FirebaseContext.Consumer>
                      {(firebase) => <SignInForm firebase={firebase} />}
                    </FirebaseContext.Consumer>
                  </MDBCardBody>
                </MDBCard>
              </MDBAnimation>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </MDBView>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import {
  MDBJumbotron,
  MDBRow,
  MDBCol,
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
} from 'mdbreact';

import Introduction from './AboutTheLibrary/Introduction';
import DueDates from './LibraryPolicies/DueDates';
import MissingBooks from './LibraryPolicies/MissingBooks';
import Renewing from './LibraryPolicies/Renewing';

const About = () => {
  // 0: About the Library
  // 1: Library Policies
  const [currentMenu, setCurrentMenu] = useState('0');

  // 0.0: Introduction
  // 1.0: Due Dates
  // 1.1: Renewing
  // 1.2: Missing Books
  const [currentComponent, setCurrentComponent] = useState('0.0');
  return (
    <>
      <h1 className="flex-center m-4">About</h1>
      <p className="flex-center font-italic">
        This page is still a work in progress.
      </p>
      <MDBContainer fluid>
        <MDBRow>
          <MDBCol md="3">
            <MDBJumbotron className="m-5">
              <MDBListGroup style={{ cursor: 'pointer' }} className="my-4">
                <MDBListGroupItem
                  danger
                  hover
                  onClick={() => {
                    setCurrentMenu('0');
                    setCurrentComponent('0.0');
                  }}
                  color="success"
                  active={currentMenu === '0'}
                >
                  About the Library
                </MDBListGroupItem>
                <MDBListGroupItem
                  hover
                  onClick={() => {
                    setCurrentMenu('1');
                    setCurrentComponent('1.0');
                  }}
                  color="success"
                  active={currentMenu === '1'}
                >
                  Library Policies
                </MDBListGroupItem>
              </MDBListGroup>

              {currentMenu === '0' && (
                <MDBListGroup style={{ cursor: 'pointer' }} className="my-4">
                  <MDBListGroupItem
                    danger
                    hover
                    onClick={() => setCurrentComponent('0.0')}
                    color="success"
                    active={currentComponent === '0.0'}
                  >
                    Introduction
                  </MDBListGroupItem>
                </MDBListGroup>
              )}

              {currentMenu === '1' && (
                <MDBListGroup style={{ cursor: 'pointer' }} className="my-4">
                  <MDBListGroupItem
                    hover
                    onClick={() => setCurrentComponent('1.0')}
                    color="success"
                    active={currentComponent === '1.0'}
                  >
                    Due Dates
                  </MDBListGroupItem>
                  <MDBListGroupItem
                    hover
                    onClick={() => setCurrentComponent('1.1')}
                    color="success"
                    active={currentComponent === '1.1'}
                  >
                    Missing Books
                  </MDBListGroupItem>
                  <MDBListGroupItem
                    hover
                    onClick={() => setCurrentComponent('1.2')}
                    color="success"
                    active={currentComponent === '1.2'}
                  >
                    Renewing
                  </MDBListGroupItem>
                </MDBListGroup>
              )}
            </MDBJumbotron>
          </MDBCol>
          <MDBCol md="9">
            <MDBJumbotron className="m-5">
              {currentComponent === '0.0' && <Introduction />}
              {currentComponent === '1.0' && <DueDates />}
              {currentComponent === '1.1' && <MissingBooks />}
              {currentComponent === '1.2' && <Renewing />}
              <div className="footer-copyright text-center py-3">
                <MDBContainer fluid>
                  <span className="font-italic">
                    This information is subject to change. Always check your
                    account for up-to-date information.
                  </span>
                </MDBContainer>
              </div>
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default About;

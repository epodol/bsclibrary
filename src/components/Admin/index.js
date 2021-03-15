import React, { useState } from 'react';
import {
  MDBJumbotron,
  MDBRow,
  MDBCol,
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
} from 'mdbreact';
import AddUserForm from './AddUserForm';
import SetRoleForm from './SetRoleForm';

const Admin = () => {
  // 0: User Managment
  // 1: Other
  const [currentMenu, setCurrentMenu] = useState('0');

  // 0.0: Add New User
  // 0.1: Get User
  // 0.2: Set User Role
  const [currentComponent, setCurrentComponent] = useState('0.0');
  return (
    <>
      <h1 className="flex-center m-4">Admin Panel</h1>
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
                  User Management
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
                  Other
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
                    Add New User
                  </MDBListGroupItem>
                  <MDBListGroupItem
                    hover
                    onClick={() => setCurrentComponent('0.1')}
                    color="success"
                    active={currentComponent === '0.1'}
                  >
                    Get a User&apos;s Info
                  </MDBListGroupItem>
                  <MDBListGroupItem
                    hover
                    onClick={() => setCurrentComponent('0.2')}
                    color="success"
                    active={currentComponent === '0.2'}
                  >
                    Set a User&apos;s Role
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
                    Coming soon
                  </MDBListGroupItem>
                </MDBListGroup>
              )}
            </MDBJumbotron>
          </MDBCol>
          <MDBCol md="9">
            <MDBJumbotron className="m-5">
              {currentComponent === '0.0' && <AddUserForm />}
              {currentComponent === '0.1' && <></>}
              {currentComponent === '0.2' && <SetRoleForm />}
            </MDBJumbotron>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Admin;

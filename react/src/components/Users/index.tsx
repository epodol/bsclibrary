import React from 'react';
import Paper from '@mui/material/Paper';

import FindUser from './FindUser';
import AddUserForm from './AddUserForm';
import './users.css';

const Users = () => (
  <div className="div-margin">
    <Paper className="paper-margin">
      <div
        className="paper-margin"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FindUser />
      </div>
    </Paper>
    <br />
    <Paper className="paper-margin">
      <div
        className="paper-margin"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AddUserForm />
      </div>
    </Paper>
  </div>
);

export default Users;

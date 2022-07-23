import React from 'react';
import { Paper } from '@mui/material';

import FindUser from 'src/pages/Users/FindUser';
import 'src/pages/Users//users.css';
import JoinRequests from 'src/pages/Users/JoinRequests';

const Users = () => (
  <div>
    <Paper
      sx={{
        marginTop: {
          xs: '.5rem',
          sm: '.5rem',
          md: '1rem',
          lg: '2rem',
          xl: '3rem',
        },
        marginLeft: {
          xs: '1rem',
          sm: '2rem',
          md: '15rem',
          lg: '20rem',
          xl: '25rem',
        },
        marginRight: {
          xs: '1rem',
          sm: '2rem',
          md: '15rem',
          lg: '20rem',
          xl: '25rem',
        },
        padding: {
          xs: '1rem',
          sm: '1rem',
          md: '1rem',
          lg: '2rem',
          xl: '3rem',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FindUser />
      </div>
    </Paper>
    <Paper
      sx={{
        marginTop: {
          xs: '.5rem',
          sm: '.5rem',
          md: '1rem',
          lg: '2rem',
          xl: '3rem',
        },
        marginLeft: {
          xs: '1rem',
          sm: '2rem',
          md: '15rem',
          lg: '20rem',
          xl: '25rem',
        },
        marginRight: {
          xs: '1rem',
          sm: '2rem',
          md: '15rem',
          lg: '20rem',
          xl: '25rem',
        },
        padding: {
          xs: '1rem',
          sm: '1rem',
          md: '1rem',
          lg: '2rem',
          xl: '3rem',
        },
      }}
    >
      <div>
        <JoinRequests />
      </div>
    </Paper>
  </div>
);

export default Users;

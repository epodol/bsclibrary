import React from 'react';
import { Container } from '@material-ui/core';

const Volunteer = () => (
  <Container>
    <h1 className="flex-center m-3">Volunteer</h1>
    <div>
      The BASIS Scottsdale Library is looking for volunteers to help run the
      library on a daily basis. If you are interested in helping out, please
      contact the library at{' '}
      <a href="mailto:support@bsclibrary.net">support@bsclibrary.net</a>.
      <p>
        More information about our volunteer program will be available soon!
      </p>
    </div>
  </Container>
);

export default Volunteer;

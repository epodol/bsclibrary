import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';

import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');

render(
  <StrictMode>
    <App />
  </StrictMode>,
  container
);

serviceWorker.register();

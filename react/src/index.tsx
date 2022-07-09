import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

serviceWorker.register();

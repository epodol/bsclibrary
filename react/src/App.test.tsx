import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import App from './App';

test('renders', async () => {
  render(<App />);

  await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

  expect(screen.getByText('Coming 2021')).toBeInTheDocument();
});

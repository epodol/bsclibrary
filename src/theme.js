import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#6DB058',
    },
    background: {
      default: '#f8f7f8',
    },
  },
  typography: {
    fontFamily: 'century-gothic, sans-serif',
  },
});

export default theme;

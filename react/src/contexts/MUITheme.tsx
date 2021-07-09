import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const MUITheme = createTheme({
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

export default MUITheme;

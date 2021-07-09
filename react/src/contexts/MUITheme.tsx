import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const MUITheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em',
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey',
        },
      },
    },
  },
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

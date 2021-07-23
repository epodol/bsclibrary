import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const MUITheme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '5px',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#6DB058',
          borderRadius: '100em',
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

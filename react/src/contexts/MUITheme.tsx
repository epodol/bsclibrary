import React, { useState, createContext, useMemo } from 'react';
import { PaletteMode, useMediaQuery } from '@mui/material';
import { purple } from '@mui/material/colors';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const getDesignTokens = (mode: PaletteMode) => ({
  typography: {
    fontFamily: 'century-gothic, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    mode,
    background: {
      default: mode === 'light' ? '#f8f7f8' : '#121212',
    },
    primary: {
      main: '#6DB058',
      contrastText: '#000000',
    },
    secondary: {
      main: purple[500],
    },
  },
});

const ThemeContext = createContext<any>(null);

export const ThemeContextProvider = ({ children }: { children: any }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light'
  );
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const MUITheme = useMemo(() => createTheme(getDesignTokens(theme)), [theme]);

  return (
    <ThemeContext.Provider value={toggleTheme}>
      <ThemeProvider theme={MUITheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

// import { createTheme, adaptV4Theme } from '@mui/material/styles';

// // A custom theme for this app
// const MUITheme = createTheme(
//   adaptV4Theme({
//     overrides: {
//       MuiCssBaseline: {
//         '@global': {
//           '*::-webkit-scrollbar': {
//             width: '5px',
//           },
//           '*::-webkit-scrollbar-thumb': {
//             backgroundColor: '#6DB058',
//             borderRadius: '5px',
//           },
//         },
//       },
//     },
//     palette: {
//       primary: {
//         main: '#6DB058',
//       },
//       secondary: {
//         main: '#6DB058',
//       },
//       background: {
//         default: '#f8f7f8',
//       },
//     },
//     typography: {
//       fontFamily: 'century-gothic, sans-serif',
//     },
//   })
// );

// export default MUITheme;

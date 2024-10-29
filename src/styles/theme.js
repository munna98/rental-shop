import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#CE5A67',
    },
    secondary: {
      main: '#F4BF96',
    },
    background: {
      default: '#FCF5ED',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F1717',
      secondary: '#000000',
    },
  },
  typography: {
    fontFamily: '"Spectral", Arial, sans-serif', // Set Spectral as the primary font
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#CE5A67',
    },
    secondary: {
      main: '#F4BF96',
    },
    background: {
      default: '#1F1717',
      paper: '#2A2A2A', // Adjusted for paper color in dark mode
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
  typography: {
    fontFamily: '"Spectral", Arial, sans-serif', // Set Spectral as the primary font
  },
});

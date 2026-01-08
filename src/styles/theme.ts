import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#646cff',
      light: '#747bff',
      dark: '#535bf2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.2em',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h6: {
      fontSize: '1em',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontSize: '1em',
          fontWeight: 500,
          padding: '0.6em 1.2em',
          textTransform: 'none',
          transition: 'border-color 0.25s',
          '&:hover': {
            borderColor: '#646cff',
          },
          '&:focus-visible': {
            outline: '4px auto -webkit-focus-ring-color',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#646cff',
      light: '#747bff',
      dark: '#535bf2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#242424',
      paper: '#1a1a1a',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3.2em',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h6: {
      fontSize: '1em',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontSize: '1em',
          fontWeight: 500,
          padding: '0.6em 1.2em',
          textTransform: 'none',
          transition: 'border-color 0.25s',
          '&:hover': {
            borderColor: '#646cff',
          },
          '&:focus-visible': {
            outline: '4px auto -webkit-focus-ring-color',
          },
        },
      },
    },
  },
});
import { alpha, Theme } from '@mui/material/styles';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scrollbar-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)} transparent;
    scrollbar-width: thin;
  }

  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.2)};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.4)};
  }
`;

export default GlobalStyles;

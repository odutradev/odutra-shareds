import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect } from 'react';

import { toastContainerConfig } from '@assets/data/toast';
import { lightTheme, darkTheme } from '@styles/theme';
import defaultConfig from '@assets/config/default';
import GlobalStyles from '@styles/globalStyles';
import useSystemStore from '@stores/system';
import Router from '@routes/index';

const App = () => {
  const { system: { theme }, initializeTheme } = useSystemStore();

  useEffect(() => {
    initializeTheme();
    console.log(`version: ${defaultConfig.version} - mode: ${defaultConfig.mode}`);
  }, []);

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <ToastContainer {...toastContainerConfig} />
      <CssBaseline />
      <title>Shareds</title>
      <Router />
      <GlobalStyles theme={currentTheme} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
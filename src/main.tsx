import { ToastContainer } from 'react-toastify';
import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useState } from 'react';

import { toastContainerConfig } from '@assets/data/toast';
import defaultConfig from '@assets/config/default';
import Router from '@routes/index';
import { lightTheme, darkTheme } from '@styles/theme';
import GlobalStyles from '@styles/globalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedThemeMode = window.localStorage.getItem('theme');
    return savedThemeMode === 'dark' ? darkTheme : lightTheme;
  }
  return lightTheme;
};
const App = () => {
  const [activeTheme, setActiveTheme] = useState(getInitialTheme());

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme') {
        setActiveTheme(getInitialTheme());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  useEffect(() => {
    console.log(`version: ${defaultConfig.version} - mode: ${defaultConfig.mode}`);
  }, []);

  return (
    <ThemeProvider theme={activeTheme}>
      <ToastContainer {...toastContainerConfig} />
      <CssBaseline />

      <Router />
<GlobalStyles />
   </ ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

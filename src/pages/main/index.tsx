import { useState } from 'react';
import { Button } from '@mui/material';

import logo from '@assets/imgs/logo.svg';
import { MainContainer, Logo, Title, ChipsContainer, StyledChip, ButtonContainer } from './styles';
import useSystemStore from '@stores/system';

const Main = () => {
  const { system: { count }, setCount } = useSystemStore();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const modules = ['React', 'TypeScript', 'Vite', 'Docker', 'Zustand', 'Styled Components', 'MUI'];

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.location.reload()
  };

  return (
    <MainContainer>
      <Logo src={logo} alt="Zeck Logo" />
      <Title variant="h1">Zeck React Typescript Boilerplate + Vite</Title>
      <ChipsContainer>
        {modules.map((module) => (
          <StyledChip key={module} label={module} />
        ))}
      </ChipsContainer>
      <ButtonContainer>
        <Button variant="contained" onClick={() => setCount(count + 1)}>
          count is {count}
        </Button>
        <Button variant="outlined" onClick={toggleTheme} sx={{ ml: 2 }}>
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
      </ButtonContainer>
    </MainContainer>
  );
};

export default Main;
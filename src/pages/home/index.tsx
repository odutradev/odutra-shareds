import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box } from '@mui/material';
import { HomeContainer, LoginCard, Logo } from './styles';
import logo from '@assets/imgs/logo.svg';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard/projects');
  }, [navigate]);

  return (
    <HomeContainer>
      <LoginCard elevation={0}>
        <Box sx={{ textAlign: 'center' }}>
          <Logo src={logo} alt="Zeck Logo" />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Bem-vindo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Faça login para continuar
          </Typography>
        </Box>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            variant="outlined"
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/dashboard/projects')}
          >
            Entrar
          </Button>
        </Box>
      </LoginCard>
    </HomeContainer>
  );
};

export default Home;
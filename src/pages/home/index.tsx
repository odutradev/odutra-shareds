import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './subcomponents/loginForm';
import { HomeContainer } from './styles';
import useSystemStore from '@stores/system';

const Home = () => {
  const navigate = useNavigate();
  const { login, system: { isAuthenticated } } = useSystemStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard/projects');
  }, [isAuthenticated, navigate]);

  const handleLoginAttempt = async (code: string) => {
    const success = await login(code);
    if (success) navigate('/dashboard/projects');
    return success;
  };

  return (
    <HomeContainer>
      <LoginForm onLogin={handleLoginAttempt} />
    </HomeContainer>
  );
};

export default Home;
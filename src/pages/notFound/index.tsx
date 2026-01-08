import { useNavigate } from 'react-router-dom';

import { NotFoundContainer, ErrorIcon, ErrorTitle, ErrorMessage, HomeButton } from './styles';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <ErrorIcon />
      
      <ErrorTitle variant="h1">
        404
      </ErrorTitle>
      
      <ErrorMessage variant="body1">
        Sorry, the page you are looking for does not exist.
      </ErrorMessage>
      
      <HomeButton 
        variant="contained"
        onClick={() => navigate('/')}
      >
        Back to Home
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;
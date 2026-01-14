import { useEffect, useState } from 'react';

import { Container, Message, Spinner } from './styles';

import type { LoadingProps } from './types';

const Loading = ({ message = 'Carregando', showSpinner = true }: LoadingProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {showSpinner && <Spinner />}
      <Message variant="h6">
        {message}{dots}
      </Message>
    </Container>
  );
};

export default Loading;
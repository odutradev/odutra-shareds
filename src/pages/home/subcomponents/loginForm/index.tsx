import { useEffect, useRef, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { LoginCard, Logo, PinContainer, PinInput } from './styles';
import logo from '@assets/imgs/logo.svg';

interface LoginFormProps {
  onLogin: (code: string) => boolean;
}

const PIN_LENGTH = 6;
const INITIAL_PIN = new Array(PIN_LENGTH).fill('');

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [pin, setPin] = useState<string[]>(INITIAL_PIN);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleSubmit = (code: string) => {
    const isSuccess = onLogin(code);
    if (!isSuccess) {
      setError(true);
      setTimeout(() => {
        setPin(INITIAL_PIN);
        setError(false);
        inputRefs.current[0]?.focus();
      }, 500);
    }
  };

  const handleChange = (index: number, value: string) => {
    setError(false);
    const digit = value.replace(/\D/g, '').slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    if (digit && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullPin = newPin.join('');
    if (fullPin.length === PIN_LENGTH && !newPin.includes('')) {
      handleSubmit(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
    if (!pastedData) return;

    const newPin = [...pin];
    pastedData.split('').forEach((char, i) => {
      if (i < PIN_LENGTH) newPin[i] = char;
    });
    setPin(newPin);

    const nextIndex = Math.min(pastedData.length, PIN_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    if (newPin.join('').length === PIN_LENGTH && !newPin.includes('')) {
      handleSubmit(newPin.join(''));
    }
  };

  return (
    <LoginCard elevation={0}>
      <Box sx={{ textAlign: 'center' }}>
        <Logo src={logo} alt="Zeck Logo" />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Acesso Restrito
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Digite o PIN de acesso
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
        <Box sx={{ position: 'relative' }}>
          <PinContainer onPaste={handlePaste}>
            {pin.map((digit, index) => (
              <PinInput
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type={showPin ? 'text' : 'password'}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={error ? 'error' : ''}
                autoComplete="off"
                inputMode="numeric"
                maxLength={1}
              />
            ))}
          </PinContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Tooltip title={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}>
              <IconButton
                onClick={() => setShowPin(!showPin)}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                {showPin ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => handleSubmit(pin.join(''))}
          disabled={pin.some((p) => p === '')}
          sx={{ height: 48 }}
        >
          Entrar
        </Button>
      </Box>
    </LoginCard>
  );
};

export default LoginForm;
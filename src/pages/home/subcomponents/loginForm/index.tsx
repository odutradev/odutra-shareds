import { useEffect, useRef, useState } from 'react';
import { Visibility, VisibilityOff, Lock, Warning } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography, Fade } from '@mui/material';
import useSystemStore from '@stores/system';
import { LoginCard, Logo, PinContainer, PinInput } from './styles';
import logo from '@assets/imgs/logo.svg';

interface LoginFormProps {
  onLogin: (code: string) => Promise<boolean>;
}

const PIN_LENGTH = 6;
const INITIAL_PIN = new Array(PIN_LENGTH).fill('');

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { system: { lockoutUntil, loginAttempts } } = useSystemStore();
  const [pin, setPin] = useState<string[]>(INITIAL_PIN);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const [validating, setValidating] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isLocked = !!(lockoutUntil && Date.now() < lockoutUntil);

  useEffect(() => {
    if (!isLocked) inputRefs.current[0]?.focus();
  }, [isLocked]);

  const handleSubmit = async (code: string) => {
    if (validating || isLocked) return;
    setValidating(true);
    
    const isSuccess = await onLogin(code);
    
    if (!isSuccess) {
      setError(true);
      setTimeout(() => {
        setPin(INITIAL_PIN);
        setError(false);
        setValidating(false);
        inputRefs.current[0]?.focus();
      }, 500);
    } else {
      setValidating(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (isLocked) return;
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
    if (isLocked) return;
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
    if (isLocked) return;
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

  const getStatusMessage = () => {
    if (isLocked) return "Acesso bloqueado temporariamente";
    if (error) return "PIN incorreto";
    if (loginAttempts > 0) return `${3 - loginAttempts} tentativas restantes`;
    return "Digite o PIN de acesso";
  };

  return (
    <LoginCard elevation={0}>
      <Box sx={{ textAlign: 'center' }}>
        <Logo src={logo} alt="Zeck Logo" style={{ opacity: isLocked ? 0.5 : 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom color={isLocked ? 'error' : 'text.primary'}>
          {isLocked ? 'Bloqueado' : 'Acesso Restrito'}
        </Typography>
        <Fade in={true}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: isLocked || error ? 'error.main' : 'text.secondary' }}>
            {isLocked && <Lock fontSize="small" />}
            {error && <Warning fontSize="small" />}
            <Typography variant="body2" fontWeight={isLocked || error ? 'bold' : 'regular'}>
              {getStatusMessage()}
            </Typography>
          </Box>
        </Fade>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, opacity: isLocked ? 0.5 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
        <Box sx={{ position: 'relative' }}>
          <PinContainer onPaste={handlePaste}>
            {pin.map((digit, index) => (
              <PinInput
                key={index}
                ref={(el: any) => { inputRefs.current[index] = el; }}
                type={showPin ? 'text' : 'password'}
                value={digit}
                onChange={(e: any) => handleChange(index, e.target.value)}
                onKeyDown={(e: any) => handleKeyDown(index, e)}
                className={error ? 'error' : ''}
                disabled={validating || isLocked}
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
                disabled={isLocked}
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
          disabled={pin.some((p) => p === '') || validating || isLocked}
          sx={{ height: 48 }}
          color={isLocked ? "error" : "primary"}
        >
          {isLocked ? 'Aguarde...' : validating ? 'Verificando...' : 'Entrar'}
        </Button>
      </Box>
    </LoginCard>
  );
};

export default LoginForm;
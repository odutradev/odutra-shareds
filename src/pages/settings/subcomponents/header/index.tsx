import { ArrowBack } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { HeaderContainer, BackButton } from './styles';

import type { SettingsHeaderProps } from './types';

const SettingsHeader = ({ onBack }: SettingsHeaderProps) => {
  return (
    <HeaderContainer>
      <BackButton onClick={onBack}>
        <ArrowBack />
      </BackButton>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Configurações
      </Typography>
    </HeaderContainer>
  );
};

export default SettingsHeader;
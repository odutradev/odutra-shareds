import { Add, DarkMode, LightMode, Settings } from '@mui/icons-material';
import { Typography, Tooltip } from '@mui/material';

import { HeaderContainer, TitleSection, ActionSection, HeaderIconButton, CreateButton} from './styles';

import type { DashboardHeaderProps } from './types';

const DashboardHeader = ({ theme, showCreateButton, onToggleTheme, onSettings, onCreate }: DashboardHeaderProps) => {
  return (
    <HeaderContainer>
      <TitleSection>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
          Meus Compartilhamentos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Gerencie seus links, páginas e conteúdos compartilhados
        </Typography>
      </TitleSection>

      <ActionSection>
        <Tooltip title="Configurações">
          <HeaderIconButton onClick={onSettings}>
            <Settings fontSize="small" />
          </HeaderIconButton>
        </Tooltip>

        <Tooltip title="Alternar tema">
          <HeaderIconButton onClick={onToggleTheme}>
            {theme === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
          </HeaderIconButton>
        </Tooltip>

        {showCreateButton && (
          <CreateButton
            variant="contained"
            startIcon={<Add />}
            onClick={onCreate}
          >
            Novo Compartilhamento
          </CreateButton>
        )}
      </ActionSection>
    </HeaderContainer>
  );
};

export default DashboardHeader;

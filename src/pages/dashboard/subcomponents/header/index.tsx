import { Add, DarkMode, LightMode, Settings } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import { CreateButton, HeaderIconButton } from './styles';
import PageHeader from '@components/pageHeader';

import type { DashboardHeaderProps } from './types';

const DashboardHeader = ({ theme, showCreateButton, onToggleTheme, onSettings, onCreate }: DashboardHeaderProps) => {
  return (
    <PageHeader
      title="Meus Compartilhamentos"
      subtitle="Gerencie seus links, páginas e conteúdos compartilhados"
      actions={
        <>
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
        </>
      }
    />
  );
};

export default DashboardHeader;
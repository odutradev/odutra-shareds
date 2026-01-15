import { ArrowBack } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { ActionSection, BackButton, HeaderContainer, LeftSection, TitleGroup } from './styles';

import type { PageHeaderProps } from './types';

const PageHeader = ({ title, subtitle, onBack, actions }: PageHeaderProps) => {
  return (
    <HeaderContainer>
      <LeftSection>
        {onBack && (
          <BackButton onClick={onBack} size="small">
            <ArrowBack fontSize="small" />
          </BackButton>
        )}
        <TitleGroup>
          <Typography
            variant="h4"
            color="text.primary"
            sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </TitleGroup>
      </LeftSection>

      {actions && (
        <ActionSection>
          {actions}
        </ActionSection>
      )}
    </HeaderContainer>
  );
};

export default PageHeader;
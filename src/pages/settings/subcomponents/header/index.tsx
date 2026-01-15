import PageHeader from '@components/pageHeader';

import type { SettingsHeaderProps } from './types';

const SettingsHeader = ({ onBack }: SettingsHeaderProps) => {
  return (
    <PageHeader
      title="Configurações"
      onBack={onBack}
    />
  );
};

export default SettingsHeader;
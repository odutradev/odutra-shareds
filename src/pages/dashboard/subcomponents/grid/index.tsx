import { GridContainer } from './styles';
import SharedCard from '../sharedCard';

import type { DashboardGridProps } from './types';

const DashboardGrid = ({ data, onEdit, onDelete }: DashboardGridProps) => {
  return (
    <GridContainer>
      {data.map((shared) => {
        if (!shared || !shared._id) return null;
        return (
          <SharedCard
            key={shared._id}
            shared={shared}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </GridContainer>
  );
};

export default DashboardGrid;

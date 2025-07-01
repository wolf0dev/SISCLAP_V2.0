import React from 'react';
import { DependientesListLogic } from './DependientesListLogic';
import { DependientesListView } from './DependientesListView';

const DependientesListContainer: React.FC = () => {
  return (
    <DependientesListLogic>
      <DependientesListView />
    </DependientesListLogic>
  );
};

export default DependientesListContainer;
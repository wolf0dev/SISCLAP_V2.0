import React from 'react';
import { BeneficiariosListLogic } from './BeneficiariosListLogic';
import { BeneficiariosListView } from './BeneficiariosListView';

const BeneficiariosListContainer: React.FC = () => {
  return (
    <BeneficiariosListLogic>
      <BeneficiariosListView />
    </BeneficiariosListLogic>
  );
};

export default BeneficiariosListContainer;
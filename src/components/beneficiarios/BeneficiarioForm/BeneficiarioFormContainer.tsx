import React from 'react';
import { BeneficiarioFormLogic } from './BeneficiarioFormLogic';
import { BeneficiarioFormView } from './BeneficiarioFormView';

const BeneficiarioFormContainer: React.FC = () => {
  return (
    <BeneficiarioFormLogic>
      <BeneficiarioFormView />
    </BeneficiarioFormLogic>
  );
};

export default BeneficiarioFormContainer;
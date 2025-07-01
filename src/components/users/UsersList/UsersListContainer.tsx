import React from 'react';
import { UsersListLogic } from './UsersListLogic';
import { UsersListView } from './UsersListView';

const UsersListContainer: React.FC = () => {
  return (
    <UsersListLogic>
      <UsersListView />
    </UsersListLogic>
  );
};

export default UsersListContainer;
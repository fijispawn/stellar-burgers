import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserState } from '../../services/userSlice';

export const AppHeader: FC = () => {
  const { user } = useSelector(selectUserState);
  return <AppHeaderUI userName={user?.name} />;
};

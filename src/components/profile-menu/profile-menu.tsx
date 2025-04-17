import { FC, SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { AppDispatch } from '../../services/store';
import { logoutUserThunk } from '../../services/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUserThunk()).then(() => {
      navigate('/login');
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

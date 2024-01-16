import React from 'react';
import { useAppDispatch} from '../../hooks/redux-hooks';
import { logout } from '../../features/auth/authSlice';


const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout} className="btn btn-primary">Logout</button>
  );
};

export default LogoutButton;

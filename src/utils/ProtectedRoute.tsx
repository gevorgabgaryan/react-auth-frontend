import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppSelector } from '../hooks/redux-hooks';

const PrivateRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.auth.isLogin);
  const validatingToken = useAppSelector(state => state.auth.validatingToken);

  if (validatingToken) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

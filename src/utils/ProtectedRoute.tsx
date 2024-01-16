import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!(localStorage.getItem('token') == null));
  }, []);

  return isLoggedIn  ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;

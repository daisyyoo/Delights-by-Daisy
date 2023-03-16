import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const paidStatus = localStorage.getItem('paidStatus');
  return (
    paidStatus ? <Outlet/> : <Navigate to='/' />
  );
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, cartId }) => {
  if (!cartId) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;

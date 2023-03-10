import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, paymentIntent }) => {
  if (!paymentIntent) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;

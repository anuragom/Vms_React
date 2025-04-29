


// src/Routes/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../Auth/auth'; 

const ProtectedRoute = ({ element }) => {
  const token = getToken();
  return token ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;

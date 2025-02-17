// src/Routes/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../Auth/auth';

const ProtectedRoute = ({ element }) => {
  const user = getUser(); // Check if user exists in memory
  return user && !user.error ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;

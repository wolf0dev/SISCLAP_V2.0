import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Container, Box, Paper, Typography } from '@mui/material';
import { Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (

          <Outlet />

  );
};

export default AuthLayout;
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../lib/auth';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
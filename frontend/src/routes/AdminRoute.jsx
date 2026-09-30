import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorState } from '../components/ui/ErrorState';

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24">
        <ErrorState
          title="Access Restricted"
          message="Administrative privileges are required to access this console. Please sign in with an administrator account."
        />
      </div>
    );
  }

  return children;
}

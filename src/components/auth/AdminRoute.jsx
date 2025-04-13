import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  console.log('AdminRoute Debug:');
  console.log('- Loading:', loading);
  console.log('- Current User:', JSON.stringify(currentUser, null, 2));
  console.log('- Current User Role:', currentUser?.role);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!currentUser) {
    console.log('No current user - redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check with more robust comparison
  const isAdmin = currentUser.role === 'ADMIN' || 
                  currentUser.is_admin === true || 
                  currentUser.role?.toUpperCase() === 'ADMIN';

  console.log('Is Admin:', isAdmin);

  if (!isAdmin) {
    console.log('Not an admin - redirecting to member dashboard');
    return <Navigate to="/member/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
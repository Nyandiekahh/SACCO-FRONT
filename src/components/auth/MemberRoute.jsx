// components/auth/MemberRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MemberRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is a member
  if (currentUser.role !== 'MEMBER') {
    // Redirect to admin dashboard if they're logged in but not a member
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default MemberRoute;
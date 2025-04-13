import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getCurrentUser();
          setCurrentUser(response);
        } catch (err) {
          console.error('Failed to get user profile:', err);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Standard login with password
  const login = async (email, password) => {
    setError(null);
    try {
      await authService.login(email, password);
      
      // Get user profile
      const userProfile = await authService.getCurrentUser();
      setCurrentUser(userProfile);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.error || 'Invalid credentials';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login with OTP (for new invites)
  const loginWithOTP = async (email, otp) => {
    setError(null);
    try {
      const result = await authService.loginWithOTP(email, otp);
      
      if (result.user_exists) {
        // Get user profile
        const userProfile = await authService.getCurrentUser();
        setCurrentUser(userProfile);
        return { success: true, user_exists: true };
      } else {
        // Registration needs to be completed
        return {
          success: true,
          user_exists: false,
          invitation_id: result.invitation_id,
          message: result.message
        };
      }
    } catch (err) {
      const errorMessage = err.error || 'Failed to login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Complete registration (after OTP verification)
  const completeRegistration = async (userData) => {
    setError(null);
    try {
      const result = await authService.completeRegistration(userData);
      
      // Get user profile
      const userProfile = await authService.getCurrentUser();
      setCurrentUser(userProfile);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.error || 'Failed to complete registration';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setError(null);
    try {
      const response = await authService.requestPasswordReset(email);
      return { success: true, message: response.message };
    } catch (err) {
      const errorMessage = err.error || 'Failed to request password reset';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP for password reset
  const verifyOTP = async (email, otp) => {
    setError(null);
    try {
      const result = await authService.verifyOTP(email, otp);
      return { success: true, reset_token: result.reset_token };
    } catch (err) {
      const errorMessage = err.error || 'Invalid OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (newPassword, confirmPassword) => {
    setError(null);
    try {
      await authService.resetPassword(newPassword, confirmPassword);
      return { success: true };
    } catch (err) {
      const errorMessage = err.error || 'Failed to reset password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const response = await authService.updateUserProfile(profileData);
      setCurrentUser(response);
      return { success: true };
    } catch (err) {
      const errorMessage = err.error || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Upload document
  const uploadDocument = async (documentData) => {
    setError(null);
    try {
      const response = await authService.uploadDocument(documentData);
      
      // Refresh the user profile to get updated document status
      const userProfile = await authService.getCurrentUser();
      setCurrentUser(userProfile);
      
      return { success: true, document_id: response.document_id };
    } catch (err) {
      const errorMessage = err.error || 'Failed to upload document';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    loginWithOTP,
    completeRegistration,
    requestPasswordReset,
    verifyOTP,
    resetPassword,
    updateProfile,
    uploadDocument,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
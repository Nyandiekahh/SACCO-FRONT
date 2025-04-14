import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children, navigate }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Comprehensive user initialization - only runs once at startup
  const initializeUser = useCallback(async () => {
    // Skip if we're already past the initial load
    if (!isInitializing) return;
    
    setLoading(true);
    setError(null);

    try {
      // Check if a token exists
      if (authService.isAuthenticated()) {
        try {
          // Attempt to get user profile
          const userProfile = await authService.getCurrentUser();
          setCurrentUser(userProfile);
          console.log('User profile loaded successfully');
        } catch (profileError) {
          console.error('Failed to load user profile:', profileError);
          
          // If profile fetch fails, logout the user
          authService.logout();
          setCurrentUser(null);
          
          // Optionally redirect to login
          if (navigate) {
            navigate('/login');
          }
        }
      }
    } catch (err) {
      console.error('User initialization error:', err);
      setError('Failed to initialize user session');
    } finally {
      setLoading(false);
      setIsInitializing(false);
    }
  }, [navigate, isInitializing]);

  // Initialize user on component mount - only once
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Login method with comprehensive error handling
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Attempt login
      const loginResult = await authService.login(email, password);
      
      // Add a small delay to prevent immediate profile request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch user profile after successful login
      const userProfile = await authService.getCurrentUser();
      setCurrentUser(userProfile);
      
      // Determine user route based on role
      const isAdmin = 
        userProfile.role === 'ADMIN' || 
        userProfile.is_admin === true || 
        userProfile.role?.toUpperCase() === 'ADMIN';
      
      // Navigate to appropriate dashboard (if navigate is provided)
      if (navigate) {
        navigate(isAdmin ? '/admin/dashboard' : '/member/dashboard');
      }
      
      return { success: true };
    } catch (err) {
      // Detailed error logging and handling
      console.error('Login error details:', err);
      
      const errorMessage = 
        err.response?.data?.error || 
        err.message || 
        'An unexpected error occurred during login';
      
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
    if (navigate) {
      navigate('/login');
    }
  }, [navigate]);

  // OTP Login method
  const loginWithOTP = async (email, otp) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.loginWithOTP(email, otp);
      
      if (result.user_exists) {
        // Add a small delay to prevent immediate profile request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch user profile
        const userProfile = await authService.getCurrentUser();
        setCurrentUser(userProfile);
        
        // Determine routing
        const isAdmin = 
          userProfile.role === 'ADMIN' || 
          userProfile.is_admin === true || 
          userProfile.role?.toUpperCase() === 'ADMIN';
        
        // Navigate if possible
        if (navigate) {
          navigate(isAdmin ? '/admin/dashboard' : '/member/dashboard');
        }
        
        return { success: true };
      } else {
        // Needs registration completion
        return {
          success: true,
          needsRegistration: true,
          invitationId: result.invitation_id
        };
      }
    } catch (err) {
      console.error('OTP Login error:', err);
      
      const errorMessage = 
        err.response?.data?.error || 
        err.message || 
        'Failed to login with OTP';
      
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Complete registration method
  const completeRegistration = async (registrationData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.completeRegistration(registrationData);
      
      // Add a small delay to prevent immediate profile request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch user profile
      const userProfile = await authService.getCurrentUser();
      setCurrentUser(userProfile);
      
      // Determine routing
      const isAdmin = 
        userProfile.role === 'ADMIN' || 
        userProfile.is_admin === true || 
        userProfile.role?.toUpperCase() === 'ADMIN';
      
      // Navigate if possible
      if (navigate) {
        navigate(isAdmin ? '/admin/dashboard' : '/member/dashboard');
      }
      
      return { 
        success: true,
        message: result.message 
      };
    } catch (err) {
      console.error('Registration error:', err);
      
      const errorMessage = 
        err.response?.data?.error || 
        err.message || 
        'Failed to complete registration';
      
      setError(errorMessage);
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  // Context value with all authentication methods
  const contextValue = {
    currentUser,
    loading,
    error,
    login,
    loginWithOTP,
    logout,
    completeRegistration,
    initializeUser,
    setError,  // Allow manual error setting if needed
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
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
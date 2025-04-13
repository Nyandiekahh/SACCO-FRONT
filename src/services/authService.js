// services/authService.js
import api from './api';

const authService = {
  // Normal login with email/password (JWT token)
  login: async (email, password) => {
    const response = await api.post('/token/', { email, password });
    
    // Save tokens
    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    
    return {
      token: response.access,
      refresh: response.refresh
    };
  },

  // OTP Login (for invited users)
  loginWithOTP: async (email, otp) => {
    const response = await api.post('/auth/otp-login/', { email, otp });
    
    if (response.user_exists) {
      // User exists, save tokens and return user
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      return {
        user_exists: true,
        user_id: response.user_id,
        token: response.access
      };
    } else {
      // New user needs to complete registration
      return {
        user_exists: false,
        invitation_id: response.invitation_id,
        message: response.message
      };
    }
  },
  
  // Complete Registration (after OTP verification)
  completeRegistration: async (userData) => {
    const response = await api.post('/auth/complete-registration/', userData);
    
    // Save tokens
    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    
    return {
      user_id: response.user_id,
      token: response.access,
      message: response.message
    };
  },
  
  // Request password reset
  requestPasswordReset: async (email) => {
    return await api.post('/auth/reset-password-request/', { email });
  },
  
  // Verify OTP for password reset
  verifyOTP: async (email, otp) => {
    const response = await api.post('/auth/verify-otp/', { email, otp });
    // Handle the reset token from the response
    if (response.reset_token) {
      localStorage.setItem('resetToken', response.reset_token);
    }
    return response;
  },
  
  // Reset password
  resetPassword: async (newPassword, confirmPassword) => {
    const resetToken = localStorage.getItem('resetToken');
    
    // Use the reset token for authorization
    const originalToken = localStorage.getItem('accessToken');
    localStorage.setItem('accessToken', resetToken);
    
    try {
      const result = await api.post('/auth/reset-password/', {
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      // Restore original token or clear if none
      if (originalToken) {
        localStorage.setItem('accessToken', originalToken);
      } else {
        localStorage.removeItem('accessToken');
      }
      
      // Clear reset token after use
      localStorage.removeItem('resetToken');
      
      return result;
    } catch (error) {
      // Restore original token or clear if none
      if (originalToken) {
        localStorage.setItem('accessToken', originalToken);
      } else {
        localStorage.removeItem('accessToken');
      }
      throw error;
    }
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    return await api.get('/auth/profile/');
  },
  
  // Update user profile
  updateUserProfile: async (profileData) => {
    return await api.put('/auth/profile/', profileData);
  },
  
  // Upload document
  uploadDocument: async (documentData) => {
    const formData = new FormData();
    formData.append('document_type', documentData.document_type);
    formData.append('document', documentData.document);
    
    return await api.post('/auth/upload-document/', formData);
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
  
  // Refresh the token when it expires
  refreshToken: async () => {
    return await api.refreshToken();
  }
};

export default authService;
// services/authService.js
import api from './api';

// Track the last profile request time to prevent rate limiting
let lastProfileRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between profile requests

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
  
  // Reset password - improved implementation
  resetPassword: async (newPassword, confirmPassword) => {
    const resetToken = localStorage.getItem('resetToken');
    
    if (!resetToken) {
      throw new Error('Reset token not found. Please request a new password reset.');
    }
    
    try {
      // Create a custom headers object with the reset token
      const headers = {
        'Authorization': `Bearer ${resetToken}`,
        'Content-Type': 'application/json'
      };
      
      // Use the request method that accepts custom headers
      const result = await api.request('/auth/reset-password/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });
      
      // Clear reset token after use
      localStorage.removeItem('resetToken');
      
      return result;
    } catch (error) {
      // Still clear the reset token on error
      localStorage.removeItem('resetToken');
      throw error;
    }
  },
  
  // Get current user profile with throttling to prevent 429 errors
  getCurrentUser: async () => {
    try {
      const now = Date.now();
      
      // If we've made a request recently, add a delay
      if (now - lastProfileRequestTime < MIN_REQUEST_INTERVAL) {
        const waitTime = MIN_REQUEST_INTERVAL - (now - lastProfileRequestTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      // Update the last request time
      lastProfileRequestTime = Date.now();
      
      return await api.get('/auth/profile/');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
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
  },

  /**
   * Admin verifies a document
   * @param {string} documentId - Document ID to verify
   * @returns {Promise<Object>} - Response
   */
  verifyDocument: async (documentId) => {
    try {
      const response = await api.post(`/admin/verify-document/${documentId}/`);
      return response;
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  },

  /**
   * Admin verifies a document by type
   * @param {string} documentType - Document type to verify (e.g., 'ID_FRONT')
   * @returns {Promise<Object>} - Response
   */
  verifyDocumentByType: async (documentType) => {
    try {
      const response = await api.post(`/admin/verify-document/type/${documentType}/`);
      return response;
    } catch (error) {
      console.error('Error verifying document by type:', error);
      throw error;
    }
  },

  /**
   * Admin reset password OTP for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Response
   */
  adminResetUserOTP: async (userId) => {
    try {
      const response = await api.post(`/auth/admin/reset-user-otp/${userId}/`);
      return response;
    } catch (error) {
      console.error('Error resetting user OTP:', error);
      throw error;
    }
  }
};

export default authService;
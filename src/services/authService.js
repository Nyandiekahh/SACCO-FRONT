// services/authService.js
import api from './api';

class AuthService {
  constructor() {
    this.cachedProfile = null;
    this.profileCacheTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Normal login with email/password (JWT token)
  login = async (email, password) => {
    const response = await api.post('/token/', { email, password });
    
    // Save tokens
    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    
    // Clear cached profile on new login
    this.cachedProfile = null;
    this.profileCacheTime = null;
    
    return {
      token: response.access,
      refresh: response.refresh
    };
  };

  // Get current user profile with caching
  getCurrentUser = async () => {
    try {
      // Check if we have a valid cached profile
      if (this.cachedProfile && this.profileCacheTime) {
        const now = Date.now();
        const cacheAge = now - this.profileCacheTime;
        
        if (cacheAge < this.cacheTimeout) {
          console.log('Using cached user profile');
          return this.cachedProfile;
        }
      }
      
      console.log('Fetching fresh user profile');
      const profile = await api.get('/auth/profile/');
      
      // Cache the profile
      this.cachedProfile = profile;
      this.profileCacheTime = Date.now();
      
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If API fails but we have cached data, return it
      if (this.cachedProfile) {
        console.log('API failed, using cached profile');
        return this.cachedProfile;
      }
      
      throw error;
    }
  };

  // Clear cache method
  clearProfileCache = () => {
    this.cachedProfile = null;
    this.profileCacheTime = null;
  };

  // Logout - clear cache
  logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.clearProfileCache();
  };

  // Rest of your existing methods...
  loginWithOTP = async (email, otp) => {
    const response = await api.post('/auth/otp-login/', { email, otp });
    
    if (response.user_exists) {
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      this.clearProfileCache(); // Clear cache for new user
      
      return {
        user_exists: true,
        user_id: response.user_id,
        token: response.access
      };
    } else {
      return {
        user_exists: false,
        invitation_id: response.invitation_id,
        message: response.message
      };
    }
  };

  completeRegistration = async (userData) => {
    const response = await api.post('/auth/complete-registration/', userData);
    
    localStorage.setItem('accessToken', response.access);
    localStorage.setItem('refreshToken', response.refresh);
    this.clearProfileCache();
    
    return {
      user_id: response.user_id,
      token: response.access,
      message: response.message
    };
  };

  requestPasswordReset = async (email) => {
    return await api.post('/auth/reset-password-request/', { email });
  };

  verifyOTP = async (email, otp) => {
    const response = await api.post('/auth/verify-otp/', { email, otp });
    if (response.reset_token) {
      localStorage.setItem('resetToken', response.reset_token);
    }
    return response;
  };

  resetPassword = async (newPassword, confirmPassword) => {
    const resetToken = localStorage.getItem('resetToken');
    
    if (!resetToken) {
      throw new Error('Reset token not found. Please request a new password reset.');
    }
    
    try {
      const headers = {
        'Authorization': `Bearer ${resetToken}`,
        'Content-Type': 'application/json'
      };
      
      const result = await api.request('/auth/reset-password/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });
      
      localStorage.removeItem('resetToken');
      return result;
    } catch (error) {
      localStorage.removeItem('resetToken');
      throw error;
    }
  };

  updateUserProfile = async (profileData) => {
    const result = await api.put('/auth/profile/', profileData);
    this.clearProfileCache(); // Clear cache after update
    return result;
  };

  uploadDocument = async (documentData) => {
    const formData = new FormData();
    formData.append('document_type', documentData.document_type);
    formData.append('document', documentData.document);
    
    return await api.post('/auth/upload-document/', formData);
  };

  isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };

  refreshToken = async () => {
    return await api.refreshToken();
  };

  verifyDocument = async (documentId) => {
    try {
      const response = await api.post(`/admin/verify-document/${documentId}/`);
      return response;
    } catch (error) {
      console.error('Error verifying document:', error);
      throw error;
    }
  };

  verifyDocumentByType = async (documentType, memberId) => {
    try {
      const response = await api.post(`/admin/verify-document/type/${documentType}/`, {
        member_id: memberId
      });
      return response;
    } catch (error) {
      console.error('Error verifying document by type:', error);
      throw error;
    }
  };

  adminResetUserOTP = async (userId) => {
    try {
      const response = await api.post(`/auth/admin/reset-user-otp/${userId}/`);
      return response;
    } catch (error) {
      console.error('Error resetting user OTP:', error);
      throw error;
    }
  };
}

const authService = new AuthService();
export default authService;
// services/memberService.js
import api from './api';

const memberService = {
  /**
   * Get all members
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of members
   */
  getMembers: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/members/members${queryString}`);
    return response;
  },

  /**
   * Get member details by ID
   * @param {string} id - Member ID
   * @returns {Promise<Object>} - Member details
   */
  getMemberById: async (id) => {
    try {
      const response = await api.get(`/members/members/${id}/`);
      return response;
    } catch (error) {
      console.error('Error fetching member by ID:', error);
      throw error;
    }
  },

  /**
   * Toggle member active status
   * @param {string} id - Member ID
   * @returns {Promise<Object>} - Response message
   */
  toggleMemberActiveStatus: async (id) => {
    const response = await api.post(`/members/members/${id}/toggle_active/`);
    return response;
  },

  /**
   * Get member contributions
   * @param {string} id - Member ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Member contributions
   */
  getMemberContributions: async (id, filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/members/members/${id}/contributions/${queryString}`);
    return response;
  },

  /**
   * Get member share capital payments
   * @param {string} id - Member ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Member share capital payments
   */
  getMemberShareCapital: async (id, filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/members/members/${id}/share_capital/${queryString}`);
    return response;
  },

  /**
   * Get member share summary
   * @param {string} id - Member ID
   * @returns {Promise<Object>} - Member share summary
   */
  getMemberShareSummary: async (id) => {
    const response = await api.get(`/members/members/${id}/share_summary/`);
    return response;
  },

  /**
   * Get member loans
   * @param {string} id - Member ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} - Member loans
   */
  getMemberLoans: async (id, filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/members/members/${id}/loans/${queryString}`);
    return response;
  },

  /**
   * Set member share capital term
   * @param {string} id - Member ID
   * @param {number} term - Share capital term (12 or 24 months)
   * @returns {Promise<Object>} - Response message
   */
  setShareCapitalTerm: async (id, term) => {
    const response = await api.post(`/members/members/${id}/set_share_capital_term/`, { term });
    return response;
  },

  /**
   * Get member dashboard data
   * @returns {Promise<Object>} - Member dashboard data
   */
  getMemberDashboard: async () => {
    const response = await api.get('/members/dashboard/');
    return response;
  },

  /**
   * Invite a new member
   * @param {Object} data - Member invitation data (email, share_capital_term)
   * @returns {Promise<Object>} - Response message
   */
  inviteMember: async (data) => {
    const response = await api.post('/auth/invite/', data);
    return response;
  },

  /**
   * Get sent invitations
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of sent invitations
   */
  getSentInvitations: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/auth/invitations${queryString}`);
    return response;
  },

  /**
   * Resend an invitation
   * @param {string} id - Invitation ID
   * @returns {Promise<Object>} - Response message
   */
  resendInvitation: async (id) => {
    const response = await api.post(`/auth/invitations/${id}/resend/`);
    return response;
  },

  /**
   * Get member stats for admin dashboard
   * @returns {Promise<Object>} - Member statistics
   */
  getMemberStats: async () => {
    try {
      // In a real implementation, this would call to a dedicated endpoint
      // For now, we'll simulate by getting the members list and calculating stats
      const members = await memberService.getMembers();
      
      // Calculate stats
      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.is_active).length;
      const inactiveMembers = totalMembers - activeMembers;
      const onHoldMembers = members.filter(m => m.is_on_hold).length;
      const pendingVerification = members.filter(m => !m.is_verified).length;
      
      // Count share capital completion status
      const completedShareCapital = members.filter(m => m.share_summary?.share_capital_completion_percentage === 100).length;
      const inProgressShareCapital = members.filter(m => {
        const completion = m.share_summary?.share_capital_completion_percentage || 0;
        return completion > 0 && completion < 100;
      }).length;
      const notStartedShareCapital = members.filter(m => {
        return !m.share_summary || m.share_summary.share_capital_completion_percentage === 0;
      }).length;
      
      // Get new members this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newMembersThisMonth = members.filter(m => {
        const joinDate = new Date(m.date_joined);
        return joinDate >= firstDayOfMonth;
      }).length;
      
      // Calculate growth rate (simplified)
      const growthRate = totalMembers ? Math.round((newMembersThisMonth / totalMembers) * 100) : 0;
      
      return {
        totalMembers,
        activeMembers,
        inactiveMembers,
        onHoldMembers,
        pendingVerification,
        completedShareCapital,
        inProgressShareCapital,
        notStartedShareCapital,
        newMembersThisMonth,
        growthRate,
        membershipTarget: totalMembers + 10 // Arbitrary target
      };
    } catch (error) {
      console.error("Error fetching member stats:", error);
      // Return default values in case of error
      return {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        onHoldMembers: 0,
        pendingVerification: 0,
        completedShareCapital: 0,
        inProgressShareCapital: 0,
        notStartedShareCapital: 0,
        newMembersThisMonth: 0,
        growthRate: 0,
        membershipTarget: 0
      };
    }
  },

  /**
   * Toggle member status (put on hold/activate)
   * @param {string} id - Member ID
   * @param {string} reason - Reason for putting on hold (optional)
   * @returns {Promise<Object>} - Response
   */
  toggleMemberStatus: async (id, reason = '') => {
    try {
      const response = await api.post(`/auth/admin/toggle-user-status/${id}/`, { reason });
      return response;
    } catch (error) {
      console.error('Error toggling member status:', error);
      throw error;
    }
  }
};

export default memberService;
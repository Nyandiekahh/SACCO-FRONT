// services/contributionService.js
import api from './api';
import memberService from './memberService';

const contributionService = {
  /**
   * Get all monthly contributions
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of monthly contributions
   */
  getMonthlyContributions: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    // Use admin endpoint for all contributions
    const response = await api.get(`/contributions/monthly/${queryString}`);
    return response;
  },

  /**
   * Get member monthly contributions
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of monthly contributions for the current member
   */
  getMemberContributions: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/contributions/member/monthly/${queryString}`);
    return response;
  },

  /**
   * Create a new monthly contribution
   * @param {Object} contributionData - Contribution data
   * @returns {Promise<Object>} - Created contribution
   */
  createMonthlyContribution: async (contributionData) => {
    const response = await api.post('/contributions/monthly/', contributionData);
    return response;
  },

  /**
   * Bulk create monthly contributions
   * @param {Array} contributionsData - Array of contribution data
   * @returns {Promise<Object>} - Response with created contributions
   */
  bulkCreateMonthlyContributions: async (contributionsData) => {
    const response = await api.post('/contributions/monthly/bulk_create/', contributionsData);
    return response;
  },

  /**
   * Get members with missing contributions
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise<Object>} - Members with missing contributions
   */
  getMissingContributions: async (year, month) => {
    const response = await api.get(`/contributions/monthly/missing_contributions/`, { 
      params: { year, month } 
    });
    return response;
  },

  /**
   * Send contribution reminders
   * @param {Object} reminderData - Reminder data with year, month, and message
   * @returns {Promise<Object>} - Response with reminder status
   */
  sendContributionReminders: async (reminderData) => {
    const response = await api.post('/contributions/monthly/send_reminders/', reminderData);
    return response;
  },

  /**
   * Generate monthly contribution report
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise<Object>} - Generated report
   */
  generateMonthlyReport: async (year, month) => {
    const response = await api.get('/contributions/monthly/generate_report/', {
      params: { year, month }
    });
    return response;
  },

  /**
   * Get all share capital payments
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of share capital payments
   */
  getShareCapitalPayments: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    // Use admin endpoint for all share capital payments
    const response = await api.get(`/contributions/share-capital/${queryString}`);
    return response;
  },

  /**
   * Get member share capital payments
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of share capital payments for the current member
   */
  getMemberShareCapital: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/contributions/member/share-capital/${queryString}`);
    return response;
  },

  /**
   * Create a new share capital payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} - Created payment
   */
  createShareCapitalPayment: async (paymentData) => {
    const response = await api.post('/contributions/share-capital/', paymentData);
    return response;
  },

  /**
   * Bulk create share capital payments
   * @param {Array} paymentsData - Array of payment data
   * @returns {Promise<Object>} - Response with created payments
   */
  bulkCreateShareCapitalPayments: async (paymentsData) => {
    const response = await api.post('/contributions/share-capital/bulk_create/', paymentsData);
    return response;
  },

  /**
   * Get members with incomplete share capital
   * @returns {Promise<Object>} - Members with incomplete share capital
   */
  getIncompleteShareCapital: async () => {
    const response = await api.get('/contributions/share-capital/incomplete_share_capital/');
    return response;
  },

  /**
   * Recalculate share percentages
   * @returns {Promise<Object>} - Response status
   */
  recalculateShares: async () => {
    const response = await api.post('/contributions/recalculate-shares/');
    return response;
  },

  /**
   * Get recent contributions for dashboard
   * @param {number} limit - Number of recent contributions to get
   * @returns {Promise<Array>} - Recent contributions
   */
  getRecentContributions: async (limit = 5) => {
    try {
      // First get monthly contributions
      const monthlyResponse = await contributionService.getMonthlyContributions();
      let monthlyContributions = [];
      
      // Handle different API response formats
      if (monthlyResponse.data && Array.isArray(monthlyResponse.data)) {
        monthlyContributions = monthlyResponse.data;
      } else if (monthlyResponse.data && monthlyResponse.data.results) {
        monthlyContributions = monthlyResponse.data.results;
      } else if (Array.isArray(monthlyResponse)) {
        monthlyContributions = monthlyResponse;
      } else if (monthlyResponse.results) {
        monthlyContributions = monthlyResponse.results;
      }
      
      // Get share capital payments
      const shareCapitalResponse = await contributionService.getShareCapitalPayments();
      let shareCapitalPayments = [];
      
      // Handle different API response formats
      if (shareCapitalResponse.data && Array.isArray(shareCapitalResponse.data)) {
        shareCapitalPayments = shareCapitalResponse.data;
      } else if (shareCapitalResponse.data && shareCapitalResponse.data.results) {
        shareCapitalPayments = shareCapitalResponse.data.results;
      } else if (Array.isArray(shareCapitalResponse)) {
        shareCapitalPayments = shareCapitalResponse;
      } else if (shareCapitalResponse.results) {
        shareCapitalPayments = shareCapitalResponse.results;
      }
      
      // Combine and format both types
      const allContributions = [
        ...monthlyContributions.map(c => ({
          ...c,
          contribution_type: 'MONTHLY'
        })),
        ...shareCapitalPayments.map(c => ({
          ...c,
          contribution_type: 'SHARE_CAPITAL'
        }))
      ];
      
      // Sort by date (most recent first)
      allContributions.sort((a, b) => {
        const dateA = new Date(a.transaction_date || a.created_at);
        const dateB = new Date(b.transaction_date || b.created_at);
        return dateB - dateA;
      });
      
      // Return limited number
      return allContributions.slice(0, limit);
    } catch (error) {
      console.error("Error fetching recent contributions:", error);
      return [];
    }
  },

  /**
   * Get contribution statistics for dashboard
   * @returns {Promise<Object>} - Contribution statistics
   */
  getContributionStats: async () => {
    try {
      // Get monthly contributions
      const monthlyResponse = await contributionService.getMonthlyContributions();
      const monthlyContributions = Array.isArray(monthlyResponse.data) ? monthlyResponse.data : 
                                  (monthlyResponse.results ? monthlyResponse.results : monthlyResponse);
      
      // Get share capital payments
      const shareCapitalResponse = await contributionService.getShareCapitalPayments();
      const shareCapitalPayments = Array.isArray(shareCapitalResponse.data) ? shareCapitalResponse.data : 
                                  (shareCapitalResponse.results ? shareCapitalResponse.results : shareCapitalResponse);
      
      // Get member stats
      const memberStats = await memberService.getMemberStats();
      
      // Get current month and year
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
      
      // Calculate total monthly contributions
      const totalMonthlyContributions = monthlyContributions.reduce((sum, contribution) => {
        return sum + (parseFloat(contribution.amount) || 0);
      }, 0);
      
      // Calculate this month's contributions
      const thisMonthContributions = monthlyContributions.reduce((sum, contribution) => {
        if (contribution.year === currentYear && contribution.month === currentMonth) {
          return sum + (parseFloat(contribution.amount) || 0);
        }
        return sum;
      }, 0);
      
      // Calculate total share capital
      const totalShareCapital = shareCapitalPayments.reduce((sum, payment) => {
        return sum + (parseFloat(payment.amount) || 0);
      }, 0);

      // Calculate total contributions (monthly + share capital)
      const totalContributions = totalMonthlyContributions + totalShareCapital;
      
      // Calculate contributing members percentage using memberStats
      const contributingMembersCount = new Set(monthlyContributions.map(c => c.member)).size;
      const totalMembers = memberStats.totalMembers;
      const contributingMembersPercentage = totalMembers ? Math.round((contributingMembersCount / totalMembers) * 100) : 0;
      
      return {
        totalContributions,
        totalMonthlyContributions,
        thisMonthContributions,
        totalShareCapital,
        contributingMembersCount,
        contributingMembersPercentage,
        totalMembers
      };
    } catch (error) {
      console.error("Error fetching contribution stats:", error);
      // Return default values in case of error
      return {
        totalContributions: 0,
        totalMonthlyContributions: 0,
        thisMonthContributions: 0,
        totalShareCapital: 0,
        contributingMembersCount: 0,
        contributingMembersPercentage: 0,
        totalMembers: 0
      };
    }
  }
};

export default contributionService;
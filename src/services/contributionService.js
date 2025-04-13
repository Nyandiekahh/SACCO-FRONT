// services/contributionService.js
import api from './api';

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
    const response = await api.get(`/contributions/monthly/${queryString}`);
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
    const response = await api.get(`/contributions/monthly/missing_contributions/?year=${year}&month=${month}`);
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
    const response = await api.get(`/contributions/monthly/generate_report/?year=${year}&month=${month}`);
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
    const response = await api.get(`/contributions/share-capital/${queryString}`);
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
      const monthlyContributions = await contributionService.getMonthlyContributions();
      
      // Get share capital payments
      const shareCapitalPayments = await contributionService.getShareCapitalPayments();
      
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
      // In a real implementation, this would call to a dedicated endpoint
      // For now, we'll simulate by getting contributions and calculating stats
      const monthlyContributions = await contributionService.getMonthlyContributions();
      const shareCapitalPayments = await contributionService.getShareCapitalPayments();
      
      // Get current month and year
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
      
      // Calculate total contributions
      const totalContributions = monthlyContributions.reduce((sum, contribution) => {
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
      
      // Calculate contributing members percentage (assume 100 total members for now)
      // In real implementation, you'd need to get total member count from memberService
      const contributingMembersCount = new Set(monthlyContributions.map(c => c.member)).size;
      const totalMembers = 100; // Placeholder value
      const contributingMembersPercentage = Math.round((contributingMembersCount / totalMembers) * 100);
      
      return {
        totalContributions,
        thisMonthContributions,
        totalShareCapital,
        contributingMembersCount,
        contributingMembersPercentage
      };
    } catch (error) {
      console.error("Error fetching contribution stats:", error);
      // Return default values in case of error
      return {
        totalContributions: 0,
        thisMonthContributions: 0,
        totalShareCapital: 0,
        contributingMembersCount: 0,
        contributingMembersPercentage: 0
      };
    }
  }
};

export default contributionService;
// services/contributionService.js
import api from './api';

const contributionService = {
  /**
   * Get member contributions - FIXED to work with dashboard data
   * @returns {Promise<Array>} - Member contributions
   */
  getMemberContributions: async () => {
    try {
      console.log('Fetching member contributions...');
      const response = await api.get('/members/dashboard/');
      console.log('Dashboard response for contributions:', response);
      
      // Return the contributions from dashboard data
      return response.contributions?.recent_contributions || [];
    } catch (error) {
      console.error('Failed to fetch member contributions:', error);
      throw error;
    }
  },

  /**
   * Get member share capital - FIXED to work with dashboard data
   * @returns {Promise<Array>} - Member share capital payments
   */
  getMemberShareCapital: async () => {
    try {
      console.log('Fetching member share capital...');
      const response = await api.get('/members/dashboard/');
      console.log('Dashboard response for share capital:', response);
      
      // Return the share capital payments from dashboard data
      return response.share_capital?.recent_payments || [];
    } catch (error) {
      console.error('Failed to fetch member share capital:', error);
      throw error;
    }
  }
};

export default contributionService;
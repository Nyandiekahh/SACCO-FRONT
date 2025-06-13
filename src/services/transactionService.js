// services/transactionService.js
import api from './api';

const transactionService = {
  /**
   * Calculate total investments (contributions + share capital) - FIXED
   * @returns {Promise<Object>} - Total investments
   */
  calculateTotalInvestments: async () => {
    try {
      console.log('Calculating total investments...');
      // Use the endpoint we added to transactions/urls.py
      const response = await api.get('/transactions/total-investments/');
      console.log('Financial response received:', response);
      return response;
    } catch (error) {
      console.error("Error calculating total investments:", error);
      // Fallback to dashboard data if the endpoint fails
      try {
        console.log('Trying fallback to dashboard data...');
        const dashboardResponse = await api.get('/members/dashboard/');
        const sharesData = dashboardResponse.shares_summary || {};
        
        const result = {
          monthlyContributions: sharesData.total_contributions || 0,
          shareCapital: sharesData.total_share_capital || 0,
          totalInvestments: (sharesData.total_contributions || 0) + (sharesData.total_share_capital || 0)
        };
        
        console.log('Fallback result:', result);
        return result;
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        return {
          monthlyContributions: 0,
          shareCapital: 0,
          totalInvestments: 0
        };
      }
    }
  },

  /**
   * Get all SACCO expenses
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of expenses
   */
  getExpenses: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/transactions/expenses/${queryString}`);
    return response;
  },

  /**
   * Create a new expense
   * @param {Object} expenseData - Expense data
   * @returns {Promise<Object>} - Created expense
   */
  createExpense: async (expenseData) => {
    const response = await api.post('/transactions/expenses/', expenseData);
    return response;
  },

  /**
   * Update an expense
   * @param {string} id - Expense ID
   * @param {Object} expenseData - Updated expense data
   * @returns {Promise<Object>} - Updated expense
   */
  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/transactions/expenses/${id}/`, expenseData);
    return response;
  },

  /**
   * Delete an expense
   * @param {string} id - Expense ID
   * @returns {Promise<Object>} - Response
   */
  deleteExpense: async (id) => {
    const response = await api.delete(`/transactions/expenses/${id}/`);
    return response;
  },

  /**
   * Get all SACCO income
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of income entries
   */
  getIncome: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/transactions/income/${queryString}`);
    return response;
  },

  /**
   * Create a new income entry
   * @param {Object} incomeData - Income data
   * @returns {Promise<Object>} - Created income entry
   */
  createIncome: async (incomeData) => {
    const response = await api.post('/transactions/income/', incomeData);
    return response;
  },

  /**
   * Update an income entry
   * @param {string} id - Income ID
   * @param {Object} incomeData - Updated income data
   * @returns {Promise<Object>} - Updated income entry
   */
  updateIncome: async (id, incomeData) => {
    const response = await api.put(`/transactions/income/${id}/`, incomeData);
    return response;
  },

  /**
   * Delete an income entry
   * @param {string} id - Income ID
   * @returns {Promise<Object>} - Response
   */
  deleteIncome: async (id) => {
    const response = await api.delete(`/transactions/income/${id}/`);
    return response;
  },

  /**
   * Get all transaction batches
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of transaction batches
   */
  getTransactionBatches: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/transactions/batches/${queryString}`);
    return response;
  },

  /**
   * Create a new transaction batch
   * @param {Object} batchData - Batch data
   * @returns {Promise<Object>} - Created batch
   */
  createTransactionBatch: async (batchData) => {
    const response = await api.post('/transactions/batches/', batchData);
    return response;
  },

  /**
   * Process a transaction batch
   * @param {string} id - Batch ID
   * @returns {Promise<Object>} - Process response
   */
  processBatch: async (id) => {
    const response = await api.post(`/transactions/batches/${id}/process_batch/`);
    return response;
  },

  /**
   * Get all bank accounts
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of bank accounts
   */
  getBankAccounts: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/transactions/bank-accounts/${queryString}`);
    return response;
  },

  /**
   * Create a new bank account
   * @param {Object} accountData - Bank account data
   * @returns {Promise<Object>} - Created bank account
   */
  createBankAccount: async (accountData) => {
    const response = await api.post('/transactions/bank-accounts/', accountData);
    return response;
  },

  /**
   * Update a bank account
   * @param {string} id - Bank account ID
   * @param {Object} accountData - Updated bank account data
   * @returns {Promise<Object>} - Updated bank account
   */
  updateBankAccount: async (id, accountData) => {
    const response = await api.put(`/transactions/bank-accounts/${id}/`, accountData);
    return response;
  },

  /**
   * Set a bank account as primary
   * @param {string} id - Bank account ID
   * @returns {Promise<Object>} - Response
   */
  setAsPrimaryAccount: async (id) => {
    const response = await api.post(`/transactions/bank-accounts/${id}/set_as_primary/`);
    return response;
  },

  /**
   * Get all bank transactions
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of bank transactions
   */
  getBankTransactions: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/transactions/bank-transactions/${queryString}`);
    return response;
  },

  /**
   * Create a new bank transaction
   * @param {Object} transactionData - Bank transaction data
   * @returns {Promise<Object>} - Created bank transaction
   */
  createBankTransaction: async (transactionData) => {
    const response = await api.post('/transactions/bank-transactions/', transactionData);
    return response;
  },

  /**
   * Reconcile a bank transaction
   * @param {string} id - Bank transaction ID
   * @returns {Promise<Object>} - Response
   */
  reconcileTransaction: async (id) => {
    const response = await api.post(`/transactions/bank-transactions/${id}/reconcile/`);
    return response;
  },

  /**
   * Get summary of financial transactions
   * @returns {Promise<Object>} - Financial summary
   */
  getFinancialSummary: async () => {
    const response = await api.get('/transactions/summary/');
    return response;
  }
};

export default transactionService;
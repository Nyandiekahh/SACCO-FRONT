// services/loanService.js
import api from './api';

const loanService = {
  /**
   * Get all loan applications
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of loan applications
   */
  getLoanApplications: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/loans/applications/${queryString}`);
    return response;
  },

  /**
   * Create a new loan application
   * @param {Object} applicationData - Application data
   * @returns {Promise<Object>} - Created application
   */
  createLoanApplication: async (applicationData) => {
    const response = await api.post('/loans/applications/', applicationData);
    return response;
  },

  /**
   * Get loan application by ID
   * @param {string} id - Application ID
   * @returns {Promise<Object>} - Loan application details
   */
  getLoanApplicationById: async (id) => {
    const response = await api.get(`/loans/applications/${id}/`);
    return response;
  },

  /**
   * Approve loan application
   * @param {string} id - Application ID
   * @param {Object} approvalData - Approval data with interest rate
   * @returns {Promise<Object>} - Response with loan ID
   */
  approveLoanApplication: async (id, approvalData) => {
    const response = await api.post(`/loans/applications/${id}/approve/`, approvalData);
    return response;
  },

  /**
   * Reject loan application
   * @param {string} id - Application ID
   * @param {Object} rejectionData - Rejection data with reason
   * @returns {Promise<Object>} - Response status
   */
  rejectLoanApplication: async (id, rejectionData) => {
    const response = await api.post(`/loans/applications/${id}/reject/`, rejectionData);
    return response;
  },

  /**
   * Get all loans
   * @param {Object} filters - Optional filters for the request
   * @returns {Promise<Array>} - List of loans
   */
  getLoans: async (filters = {}) => {
    // Convert filters to query params
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/loans/loans/${queryString}`);
    return response;
  },

  /**
   * Get loan by ID
   * @param {string} id - Loan ID
   * @returns {Promise<Object>} - Loan details
   */
  getLoanById: async (id) => {
    const response = await api.get(`/loans/loans/${id}/`);
    return response;
  },

  /**
   * Fetch loan disbursement options 
   * @param {string} id - Loan ID
   * @returns {Promise<Object>} - Available payment methods
   */
  getLoanDisbursementOptions: async (id) => {
    try {
      // Change to a POST request
      const response = await api.post(`/loans/loans/${id}/disburse/`, {});
      return response;
    } catch (error) {
      console.error("Error fetching loan disbursement options:", error);
      throw error;
    }
  },

  /**
   * Disburse an approved loan
   * @param {string} id - Loan ID
   * @param {Object} disbursementData - Disbursement data with payment method details
   * @returns {Promise<Object>} - Response with loan details
   */
  disburseLoan: async (id, disbursementData = {}) => {
    const response = await api.post(`/loans/loans/${id}/disburse/`, disbursementData);
    return response;
  },

  /**
   * Add repayment to a loan
   * @param {string} id - Loan ID
   * @param {Object} repaymentData - Repayment data
   * @returns {Promise<Object>} - Response with repayment details
   */
  addLoanRepayment: async (id, repaymentData) => {
    const response = await api.post(`/loans/loans/${id}/add_repayment/`, repaymentData);
    return response;
  },

  /**
   * Get repayment schedule for a loan
   * @param {string} id - Loan ID
   * @returns {Promise<Object>} - Loan repayment schedule
   */
  getLoanRepaymentSchedule: async (id) => {
    const response = await api.get(`/loans/loans/${id}/repayment_schedule/`);
    return response;
  },

  /**
   * Generate a loan statement
   * @param {string} id - Loan ID
   * @returns {Promise<Object>} - Generated loan statement
   */
  generateLoanStatement: async (id) => {
    const response = await api.post(`/loans/loans/${id}/generate_statement/`);
    return response;
  },

  /**
   * Get all loans with due payments
   * @returns {Promise<Object>} - Loans with due payments
   */
  getDuePayments: async () => {
    const response = await api.get('/loans/loans/due_payments/');
    return response.due_payments || [];
  },

  /**
   * Send reminders for loan payments
   * @param {Object} reminderData - Reminder data with type and message
   * @returns {Promise<Object>} - Response with sent count
   */
  sendPaymentReminders: async (reminderData) => {
    const response = await api.post('/loans/loans/send_payment_reminders/', reminderData);
    return response;
  },

  /**
   * Check loan eligibility
   * @returns {Promise<Object>} - Eligibility status and limits
   */
  checkLoanEligibility: async () => {
    const response = await api.get('/loans/eligibility/');
    return response;
  },

  /**
   * Get financial summary including available funds in the SACCO
   * @returns {Promise<Object>} - Financial summary with available funds
   */
  getFinancialSummary: async () => {
    try {
      console.log("Calculating financial summary...");
      
      // 1. Get contribution statistics data directly
      let totalContributions = 0;
      try {
        // Fetch raw contribution data
        const monthlyContributions = await api.get('/contributions/monthly/');
        const shareCapital = await api.get('/contributions/share-capital/');
        
        console.log("Monthly contributions:", monthlyContributions);
        console.log("Share capital:", shareCapital);
        
        // Calculate total monthly contributions
        let totalMonthlyContributions = 0;
        if (Array.isArray(monthlyContributions)) {
          totalMonthlyContributions = monthlyContributions.reduce((sum, contrib) => {
            const amount = parseFloat(contrib.amount || 0);
            console.log(`Monthly contribution: ${amount}`);
            return sum + amount;
          }, 0);
        }
        
        // Calculate total share capital
        let totalShareCapital = 0;
        if (Array.isArray(shareCapital)) {
          totalShareCapital = shareCapital.reduce((sum, share) => {
            const amount = parseFloat(share.amount || 0);
            console.log(`Share capital: ${amount}`);
            return sum + amount;
          }, 0);
        }
        
        totalContributions = totalMonthlyContributions + totalShareCapital;
        console.log("Calculated total contributions:", {
          totalMonthlyContributions,
          totalShareCapital,
          totalContributions
        });
      } catch (error) {
        console.error("Error calculating total contributions:", error);
        totalContributions = 0;
      }
      
      // 2. Get loan statistics
      let outstandingAmount = 0;
      let totalInterestEarned = 0;
      
      try {
        // Get loans directly
        const loans = await api.get('/loans/loans/');
        console.log("Loans data:", loans);
        
        if (Array.isArray(loans)) {
          // Calculate outstanding amount directly from loans
          outstandingAmount = loans.reduce((sum, loan) => {
            // Check if loan is active (APPROVED or DISBURSED)
            if (loan.status === 'DISBURSED' || loan.status === 'APPROVED') {
              const balance = parseFloat(loan.remaining_balance || 0);
              console.log(`Loan ${loan.id} has remaining balance: ${balance}`);
              return sum + balance;
            }
            return sum;
          }, 0);
          
          // Calculate interest earned
          totalInterestEarned = loans.reduce((sum, loan) => {
            const interest = parseFloat(loan.interest_paid || 0);
            console.log(`Loan ${loan.id} has interest paid: ${interest}`);
            return sum + interest;
          }, 0);
        }
        
        console.log("Loan calculations:", {
          outstandingAmount,
          totalInterestEarned
        });
      } catch (error) {
        console.error("Error calculating loan stats:", error);
      }
      
      // 3. Calculate available funds
      // Formula: Total Contributions + Interest Earned - Outstanding Loans
      const availableFunds = totalContributions + totalInterestEarned - outstandingAmount;
      
      console.log("Final available funds calculation:", {
        totalContributions,
        totalInterestEarned,
        outstandingAmount,
        calculatedFunds: availableFunds
      });
      
      return {
        availableFunds: Math.max(0, availableFunds), // Ensure it's never negative
        totalContributions,
        outstandingAmount,
        totalInterestEarned
      };
    } catch (error) {
      console.error("Error calculating financial summary:", error);
      // Return default values in case of error
      return {
        availableFunds: 0,
        totalContributions: 0,
        outstandingAmount: 0,
        totalInterestEarned: 0
      };
    }
  },

  /**
   * Get loan statistics for dashboard
   * @returns {Promise<Object>} - Loan statistics
   */
  getLoanStats: async () => {
    try {
      // In a real implementation, this would call to a dedicated endpoint
      // For now, we'll simulate by getting loans and calculating stats
      const loans = await loanService.getLoans();
      const applications = await loanService.getLoanApplications();
      
      // Define loan statuses
      const APPROVED = 'APPROVED';
      const DISBURSED = 'DISBURSED';
      const SETTLED = 'SETTLED';
      const PENDING = 'PENDING';
      
      // Calculate active loans (approved or disbursed)
      const activeLoans = loans.filter(loan => 
        loan.status === APPROVED || loan.status === DISBURSED
      ).length;
      
      // Calculate pending applications
      const pendingApplications = applications.filter(app => 
        app.status === PENDING
      ).length;
      
      // Calculate total loans amount
      const totalLoansAmount = loans.reduce((sum, loan) => {
        return sum + (parseFloat(loan.amount) || 0);
      }, 0);
      
      // Calculate total disbursed amount
      const totalDisbursedAmount = loans.filter(loan => 
        loan.status === DISBURSED || loan.status === SETTLED
      ).reduce((sum, loan) => {
        return sum + (parseFloat(loan.disbursed_amount) || 0);
      }, 0);
      
      // Calculate total repaid amount
      const totalRepaidAmount = loans.reduce((sum, loan) => {
        return sum + (parseFloat(loan.total_repaid) || 0);
      }, 0);
      
      // Calculate outstanding amount
      const outstandingAmount = loans.reduce((sum, loan) => {
        return sum + (parseFloat(loan.remaining_balance) || 0);
      }, 0);
      
      // Calculate total interest earned
      const totalInterestEarned = loans.reduce((sum, loan) => {
        return sum + (parseFloat(loan.interest_paid) || 0);
      }, 0);
      
      // Assume some overdue loans (in real app, check repayment schedule status)
      const overdueLoans = Math.floor(activeLoans * 0.1); // 10% of active loans
      
      // Calculate fully paid loans
      const fullyPaidLoans = loans.filter(loan => 
        loan.status === SETTLED
      ).length;
      
      // Calculate repayment rate
      const repaymentRate = totalDisbursedAmount > 0 
        ? Math.round((totalRepaidAmount / totalDisbursedAmount) * 100) 
        : 0;
      
      return {
        activeLoans,
        pendingApplications,
        totalLoansAmount,
        totalDisbursedAmount,
        totalRepaidAmount,
        outstandingAmount,
        overdueLoans,
        fullyPaidLoans,
        repaymentRate,
        totalInterestEarned
      };
    } catch (error) {
      console.error("Error fetching loan stats:", error);
      // Return default values in case of error
      return {
        activeLoans: 0,
        pendingApplications: 0,
        totalLoansAmount: 0,
        totalDisbursedAmount: 0,
        totalRepaidAmount: 0,
        outstandingAmount: 0,
        overdueLoans: 0,
        fullyPaidLoans: 0,
        repaymentRate: 0,
        totalInterestEarned: 0
      };
    }
  }
};

export default loanService;
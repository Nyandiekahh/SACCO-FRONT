// pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { 
  DashboardSummary, 
  RecentContributions, 
  MembershipStats, 
  LoanSummary, 
  DueLoanPayments 
} from '../../components/admin/dashboard';
import { memberService, contributionService, loanService } from '../../services';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    memberStats: {},
    contributionStats: {},
    loanStats: {},
    dueLoanPayments: [],
    recentContributions: [],
    availableFunds: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log("Fetching dashboard data...");
        
        // Fetch all data in parallel
        const [
          memberStats, 
          contributionStats, 
          loanStats, 
          dueLoanPayments, 
          recentContributions
        ] = await Promise.all([
          memberService.getMemberStats(),
          contributionService.getContributionStats(),
          loanService.getLoanStats(),
          loanService.getDuePayments(),
          contributionService.getRecentContributions()
        ]);
        
        console.log("Base data fetched, now calculating financial summary...");
        
        // Calculate financial summary separately to handle errors specifically for this calculation
        let availableFunds = 0;
        try {
          const financialSummary = await loanService.getFinancialSummary();
          console.log("Financial summary:", financialSummary);
          availableFunds = financialSummary.availableFunds || 0;
        } catch (finError) {
          console.error("Error in financial summary calculation:", finError);
          // Continue with zero if this calculation fails
        }

        setDashboardData({
          memberStats,
          contributionStats,
          loanStats,
          dueLoanPayments,
          recentContributions,
          availableFunds
        });
        
        console.log("Dashboard data set successfully");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="loader animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { 
    memberStats, 
    contributionStats, 
    loanStats, 
    dueLoanPayments, 
    recentContributions,
    availableFunds 
  } = dashboardData;

  return (
    <AdminLayout>
      {/* Dashboard Summary */}
      <DashboardSummary 
        memberStats={memberStats}
        contributionStats={contributionStats}
        loanStats={loanStats}
        availableFunds={availableFunds}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Contributions */}
        <RecentContributions contributions={recentContributions} />
        
        {/* Membership Stats */}
        <MembershipStats memberStats={memberStats} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Loan Summary */}
        <LoanSummary loanStats={loanStats} />
        
        {/* Due Loan Payments */}
        <DueLoanPayments duePayments={dueLoanPayments} />
      </div>
      
      {/* Quick Action Links */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/members" className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Members</h3>
              <p className="text-sm text-gray-500">View and update member information</p>
            </div>
          </div>
        </Link>
        
        <Link to="/admin/contributions" className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Contributions</h3>
              <p className="text-sm text-gray-500">Record and track member contributions</p>
            </div>
          </div>
        </Link>
        
        <Link to="/admin/loans" className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Manage Loans</h3>
              <p className="text-sm text-gray-500">Process loan applications and repayments</p>
            </div>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
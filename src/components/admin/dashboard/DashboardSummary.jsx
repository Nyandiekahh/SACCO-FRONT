// components/admin/dashboard/DashboardSummary.jsx
import React from 'react';

const DashboardSummary = ({ memberStats, contributionStats, loanStats, availableFunds = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Available Funds - New Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500 text-sm">Available Funds</p>
            <div className="flex items-end">
              <h3 className="text-3xl font-semibold text-gray-800 mr-2">
                KES {(availableFunds || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Total money available for SACCO operations, loans, and dividends
          </p>
        </div>
      </div>

      {/* Total Members */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500 text-sm">Total Members</p>
            <div className="flex items-end">
              <h3 className="text-3xl font-semibold text-gray-800 mr-2">
                {memberStats.totalMembers || 0}
              </h3>
              {memberStats.activeMembers && (
                <p className="text-sm text-gray-500 pb-1">
                  ({memberStats.activeMembers} active)
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">
              +{memberStats.newMembersThisMonth || 0} this month
            </span>
            <span className="text-gray-600">
              {memberStats.pendingVerification || 0} pending verification
            </span>
          </div>
        </div>
      </div>

      {/* Total Contributions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500 text-sm">Total Contributions</p>
            <div className="flex items-end">
              <h3 className="text-3xl font-semibold text-gray-800 mr-2">
                KES {(contributionStats.totalContributions || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Monthly Contributions:</span>
              <span className="text-sm font-medium text-gray-800">
                KES {(contributionStats.totalMonthlyContributions || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Share Capital:</span>
              <span className="text-sm font-medium text-gray-800">
                KES {(contributionStats.totalShareCapital || 0).toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month:</span>
                <span className="text-sm font-medium text-green-600">
                  KES {(contributionStats.thisMonthContributions || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-5">
            <p className="text-gray-500 text-sm">Total Loans</p>
            <div className="flex items-end">
              <h3 className="text-3xl font-semibold text-gray-800 mr-2">
                KES {(loanStats.totalLoansAmount || 0).toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 pb-1">
                ({loanStats.activeLoans || 0} active)
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-yellow-600 font-medium">
              {loanStats.pendingApplications || 0} pending applications
            </span>
            <span className="text-red-600">
              {loanStats.overdueLoans || 0} overdue loans
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
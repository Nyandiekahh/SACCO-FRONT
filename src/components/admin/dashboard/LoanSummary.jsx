// components/admin/dashboard/LoanSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LoanSummary = ({ loanStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Loan Summary</h3>
        <Link to="/admin/loans" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all loans
        </Link>
      </div>
      <div className="p-6">
        {/* Loan Status Distribution */}
        <div className="grid grid-cols-2 gap-4">
          {/* Active Loans */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Active Loans</p>
                <p className="text-lg font-semibold text-gray-900">{loanStats.activeLoans || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Pending Applications */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Pending Applications</p>
                <p className="text-lg font-semibold text-gray-900">{loanStats.pendingApplications || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Overdue Loans */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Overdue Loans</p>
                <p className="text-lg font-semibold text-gray-900">{loanStats.overdueLoans || 0}</p>
              </div>
            </div>
          </div>
          
          {/* Fully Paid */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Fully Paid</p>
                <p className="text-lg font-semibold text-gray-900">{loanStats.fullyPaidLoans || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loan Performance */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Loan Performance</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Disbursed</p>
                <p className="text-lg font-semibold text-gray-900">KES {loanStats.totalDisbursedAmount?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Repaid</p>
                <p className="text-lg font-semibold text-green-600">KES {loanStats.totalRepaidAmount?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Outstanding</p>
                <p className="text-lg font-semibold text-red-600">KES {loanStats.outstandingAmount?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Repayment Rate */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Repayment Rate</h4>
            <span className="text-sm font-semibold text-gray-900">{loanStats.repaymentRate || 0}%</span>
          </div>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${loanStats.repaymentRate || 0}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanSummary;
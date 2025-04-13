// components/admin/loans/LoanStats.jsx
import React from 'react';

const LoanStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Total Active Loans */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Active Loans</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.activeLoans || 0}</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-medium text-gray-900">KES {stats.totalLoansAmount?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Pending Applications */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Pending Applications</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.pendingApplications || 0}</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-500">Require review</span>
          </div>
        </div>
      </div>
      
      {/* Disbursed & Repaid */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Disbursed</p>
            <h3 className="text-2xl font-semibold text-gray-800">
              KES {stats.totalDisbursedAmount?.toLocaleString() || 0}
            </h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Repaid</span>
            <span className="font-medium text-green-600">KES {stats.totalRepaidAmount?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Overdue Loans */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Overdue Loans</p>
            <h3 className="text-2xl font-semibold text-gray-800">{stats.overdueLoans || 0}</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Outstanding</span>
            <span className="font-medium text-red-600">KES {stats.outstandingAmount?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>
      
      {/* Repayment Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 col-span-1 md:col-span-4">
        <h3 className="text-base font-medium text-gray-900 mb-2">Repayment Performance</h3>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-grow">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Repayment Rate</span>
              <span className="text-sm font-medium text-gray-700">{stats.repaymentRate || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className={`h-2.5 rounded-full ${stats.repaymentRate > 80 ? 'bg-green-600' : stats.repaymentRate > 60 ? 'bg-yellow-500' : 'bg-red-600'}`}
                style={{ width: `${stats.repaymentRate || 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex-shrink-0 md:ml-6 mt-4 md:mt-0 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">Fully Paid Loans</div>
              <div className="text-xl font-semibold text-gray-900">{stats.fullyPaidLoans || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Active Collection</div>
              <div className="text-xl font-semibold text-gray-900">{stats.activeLoans || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStats;
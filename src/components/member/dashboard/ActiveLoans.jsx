// components/member/dashboard/ActiveLoans.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ActiveLoans = ({ loans = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Active Loans</h3>
        <Link to="/member/loan-application" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          Apply for Loan
        </Link>
      </div>
      
      <div className="px-6 py-4">
        {loans.length === 0 ? (
          <div className="text-center py-6">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mx-auto h-12 w-12 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Loans</h3>
            <p className="text-gray-500 mb-4">You don't have any active loans at the moment.</p>
            <Link 
              to="/member/loan-application" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Apply for a Loan
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {loans.map((loan) => (
              <div key={loan.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === 'APPROVED' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {loan.status === 'APPROVED' ? 'Approved' : 'Disbursed'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Applied: {new Date(loan.application_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-base font-medium text-gray-900 mt-1">
                      KES {loan.amount?.toLocaleString() || 0}
                    </h4>
                  </div>
                  <Link 
                    to={`/member/loans/${loan.id}`} 
                    className="text-xs text-blue-600 hover:text-blue-500"
                  >
                    View Details
                  </Link>
                </div>
                
                {loan.status === 'DISBURSED' && (
                  <>
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Repayment Progress</span>
                        <span className="text-xs text-gray-500">
                          {Math.round((loan.total_repaid / loan.total_expected_repayment) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.round((loan.total_repaid / loan.total_expected_repayment) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Disbursed</p>
                        <p className="text-sm font-medium text-gray-900">
                          KES {loan.disbursed_amount?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="text-sm font-medium text-green-700">
                          KES {loan.total_repaid?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Outstanding</p>
                        <p className="text-sm font-medium text-red-700">
                          KES {loan.remaining_balance?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Next Payment</p>
                        <p className="text-sm font-medium text-gray-900">
                          {loan.next_payment_date ? new Date(loan.next_payment_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveLoans;
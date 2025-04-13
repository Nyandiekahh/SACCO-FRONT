// components/admin/loans/ActiveLoans.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ActiveLoans = ({ loans = [], onDisburseLoan, onAddRepayment, isOverdueTab = false, isSettledTab = false }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [repaymentReference, setRepaymentReference] = useState('');

  const handleAddRepaymentClick = (loan) => {
    setSelectedLoan(loan);
    setRepaymentAmount(loan.remaining_balance || 0);
    setShowRepaymentModal(true);
  };

  const handleRepaymentSubmit = () => {
    onAddRepayment(selectedLoan.id, {
      amount: repaymentAmount,
      reference_number: repaymentReference,
      transaction_date: new Date().toISOString().split('T')[0]
    });
    setShowRepaymentModal(false);
    setSelectedLoan(null);
    setRepaymentAmount(0);
    setRepaymentReference('');
  };

  if (!loans.length) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isOverdueTab 
            ? 'There are currently no overdue loans.' 
            : isSettledTab
              ? 'No loans have been settled yet.'
              : 'There are no active loans at the moment.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="shadow-sm overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Repayment
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan.id} className={isOverdueTab && loan.isOverdue ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-700 font-medium">
                        {loan.member_details?.full_name ? loan.member_details.full_name.charAt(0).toUpperCase() : 'M'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {loan.member_details?.full_name || 'Unknown Member'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {loan.member_details?.membership_number || 'No ID'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    KES {loan.amount?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {loan.term_months} months @ {loan.interest_rate}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      loan.status === 'SETTLED' 
                        ? 'bg-green-100 text-green-800' 
                        : loan.status === 'DISBURSED' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status === 'SETTLED' 
                        ? 'Settled' 
                        : loan.status === 'DISBURSED' 
                          ? 'Disbursed'
                          : 'Approved'}
                    </span>
                    
                    {isOverdueTab && loan.isOverdue && (
                      <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {loan.daysOverdue} days overdue
                      </span>
                    )}
                    
                    <span className="mt-1 text-xs text-gray-500">
                      {loan.status === 'SETTLED'
                        ? `Settled on: ${new Date(loan.completion_date || loan.updated_at).toLocaleDateString()}`
                        : loan.status === 'DISBURSED'
                          ? `Disbursed: ${new Date(loan.disbursement_date).toLocaleDateString()}`
                          : `Approved: ${new Date(loan.approval_date).toLocaleDateString()}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {loan.status !== 'SETTLED' ? (
                    <div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          KES {loan.remaining_balance?.toLocaleString() || 0}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          outstanding
                        </span>
                      </div>
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${Math.min(100, Math.round((loan.total_repaid / loan.total_expected_repayment) * 100) || 0)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((loan.total_repaid / loan.total_expected_repayment) * 100) || 0}% paid
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-green-600 font-medium">
                      Fully Repaid
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex flex-col space-y-1">
                    <Link 
                      to={`/admin/loans/${loan.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                    
                    {loan.status === 'APPROVED' && onDisburseLoan && (
                      <button
                        onClick={() => onDisburseLoan(loan.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Disburse
                      </button>
                    )}
                    
                    {loan.status === 'DISBURSED' && onAddRepayment && (
                      <button
                        onClick={() => handleAddRepaymentClick(loan)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Add Repayment
                      </button>
                    )}
                    
                    <Link 
                      to={`/admin/loans/${loan.id}/schedule`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Schedule
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Repayment Modal */}
      {showRepaymentModal && selectedLoan && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add Loan Repayment
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are adding a repayment for a loan of{' '}
                        <span className="font-medium text-gray-900">
                          KES {selectedLoan.amount?.toLocaleString() || 0}
                        </span>{' '}
                        for{' '}
                        <span className="font-medium text-gray-900">
                          {selectedLoan.member_details?.full_name || 'Unknown Member'}
                        </span>.
                      </p>
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="repayment-amount" className="block text-sm font-medium text-gray-700">
                            Repayment Amount (KES)
                          </label>
                          <input
                            type="number"
                            name="repayment-amount"
                            id="repayment-amount"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={repaymentAmount}
                            onChange={(e) => setRepaymentAmount(parseFloat(e.target.value) || 0)}
                            min="0"
                            max={selectedLoan.remaining_balance || 0}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Outstanding balance: KES {selectedLoan.remaining_balance?.toLocaleString() || 0}
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="repayment-reference" className="block text-sm font-medium text-gray-700">
                            Reference Number / Transaction Code
                          </label>
                          <input
                            type="text"
                            name="repayment-reference"
                            id="repayment-reference"
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={repaymentReference}
                            onChange={(e) => setRepaymentReference(e.target.value)}
                            placeholder="e.g. MPESA transaction code"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button"
                  onClick={handleRepaymentSubmit}
                  disabled={repaymentAmount <= 0 || !repaymentReference.trim()}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    repaymentAmount <= 0 || !repaymentReference.trim()
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Record Payment
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRepaymentModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveLoans;
// components/admin/loans/LoanApprovals.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoanApprovals = ({ applications = [], onApprove, onReject, showAll }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [interestRate, setInterestRate] = useState(12);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setShowApproveModal(true);
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
  };

  const handleApproveSubmit = () => {
    onApprove(selectedApplication.id, { interest_rate: interestRate });
    setShowApproveModal(false);
    setSelectedApplication(null);
    setInterestRate(12);
  };

  const handleRejectSubmit = () => {
    onReject(selectedApplication.id, { rejection_reason: rejectionReason });
    setShowRejectModal(false);
    setSelectedApplication(null);
    setRejectionReason('');
  };

  if (!applications.length) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pending loan applications</h3>
        <p className="mt-1 text-sm text-gray-500">
          All loan applications have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {applications.map((application) => (
          <li key={application.id} className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-medium">
                      {application.member_name ? application.member_name.charAt(0).toUpperCase() : 'M'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {application.member_name || 'Unknown Member'}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500">
                      <span>Applied: {new Date(application.application_date).toLocaleDateString()}</span>
                      <span className="hidden sm:inline sm:mx-1">•</span>
                      <span>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Loan Details */}
                <div className="mt-3 pl-14">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        KES {application.amount?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Term:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {application.term_months || 0} months
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Purpose:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {application.purpose || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                <button
                  type="button"
                  onClick={() => handleApproveClick(application)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectClick(application)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reject
                </button>
                <Link
                  to={`/admin/loans/applications/${application.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
      {/* Show All Link */}
      {applications.length > 3 && showAll && (
        <div className="px-4 py-3 bg-gray-50 text-center">
          <button 
            onClick={showAll}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View All Applications
          </button>
        </div>
      )}
      
      {/* Approve Modal */}
      {showApproveModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Approve Loan Application
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to approve a loan application for{' '}
                        <span className="font-medium text-gray-900">
                          KES {selectedApplication.amount?.toLocaleString() || 0}
                        </span>{' '}
                        submitted by{' '}
                        <span className="font-medium text-gray-900">
                          {selectedApplication.member_name}
                        </span>.
                      </p>
                      
                      <div className="mt-4">
                        <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          name="interest-rate"
                          id="interest-rate"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button"
                  onClick={handleApproveSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Approve
                </button>
                <button 
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Reject Loan Application
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You are about to reject a loan application for{' '}
                        <span className="font-medium text-gray-900">
                          KES {selectedApplication.amount?.toLocaleString() || 0}
                        </span>{' '}
                        submitted by{' '}
                        <span className="font-medium text-gray-900">
                          {selectedApplication.member_name}
                        </span>.
                      </p>
                      
                      <div className="mt-4">
                        <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700">
                          Rejection Reason
                        </label>
                        <textarea
                          id="rejection-reason"
                          name="rejection-reason"
                          rows={3}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Explain why this loan application is being rejected..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button"
                  onClick={handleRejectSubmit}
                  disabled={!rejectionReason.trim()}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    rejectionReason.trim() ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-red-300 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Reject
                </button>
                <button 
                  type="button"
                  onClick={() => setShowRejectModal(false)}
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

export default LoanApprovals;
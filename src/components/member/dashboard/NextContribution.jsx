// components/member/dashboard/NextContribution.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NextContribution = ({ nextDue }) => {
  if (!nextDue) return null;

  // Date formatting
  const formatMonth = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  // Check if current month is paid
  const isCurrentMonthPaid = nextDue.is_current_month_paid;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Next Contribution</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-full ${isCurrentMonthPaid ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} mb-4`}>
            {isCurrentMonthPaid ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <h4 className="text-xl font-medium text-gray-900 mb-1">
            {isCurrentMonthPaid ? 'Current Month Paid' : 'Contribution Due'}
          </h4>
          
          <p className="text-gray-500 text-center mb-4">
            {isCurrentMonthPaid 
              ? `You've paid your contribution for ${nextDue.month_name}.` 
              : `Your contribution for ${nextDue.month_name} ${nextDue.year} is due.`
            }
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 w-full mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                {isCurrentMonthPaid ? 'Next Month' : 'Current Month'}:
              </span>
              <span className="text-sm font-medium text-gray-900">
                {nextDue.month_name} {nextDue.year}
              </span>
            </div>
          </div>
          
          {!isCurrentMonthPaid && (
            <Link 
              to="/member/contributions/make-payment" 
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Make Payment
            </Link>
          )}
          
          {isCurrentMonthPaid && (
            <div className="text-sm text-gray-500 text-center">
              Next payment will be due in {nextDue.month_name} {nextDue.year}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextContribution;
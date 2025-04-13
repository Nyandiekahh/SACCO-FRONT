// components/admin/dashboard/DueLoanPayments.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DueLoanPayments = ({ duePayments = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Due Loan Payments</h3>
        <Link to="/admin/loans/due-payments" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all
        </Link>
      </div>
      <div className="bg-white">
        {duePayments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No loan payments due at this time</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {duePayments.slice(0, 5).map((payment) => (
              <li key={payment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-800">
                          {payment.member.full_name?.charAt(0) || 'M'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.member.full_name}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.days_overdue > 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.days_overdue > 0 ? `${payment.days_overdue} days overdue` : 'Due soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-semibold text-gray-900">
                      KES {payment.remaining_amount?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Due: {new Date(payment.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <Link 
                    to={`/admin/loans/${payment.loan_id}`} 
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Loan
                  </Link>
                  <Link 
                    to={`/admin/loans/${payment.loan_id}/add-payment`} 
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Record Payment
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DueLoanPayments;
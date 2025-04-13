import React, { useState } from 'react';
import { Eye, AlertTriangle } from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

const ShareCapitalTable = ({ 
  payments = [], 
  onOpenIncompletePayments 
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const paginatedPayments = payments.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Share Capital Payments</h3>
        {onOpenIncompletePayments && (
          <button
            onClick={onOpenIncompletePayments}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Incomplete Payments</span>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left text-sm font-medium text-gray-600">Member</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Transaction Date</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Reference Number</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Transaction Code</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{payment.member_name}</td>
                <td className="p-3">{formatCurrency(payment.amount)}</td>
                <td className="p-3">
                  {new Date(payment.transaction_date).toLocaleDateString()}
                </td>
                <td className="p-3">{payment.reference_number}</td>
                <td className="p-3">{payment.transaction_code || 'N/A'}</td>
                <td className="p-3">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {payments.length > itemsPerPage && (
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, payments.length)} of{' '}
            {payments.length} payments
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm bg-gray-200 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareCapitalTable;
import React, { useState, useEffect } from 'react';
import { Eye, AlertTriangle, User } from 'lucide-react';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

// Utility to get month name
const getMonthName = (monthNumber) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1];
};

// Utility to get recorder initials
const getInitials = (name) => {
  if (!name) return 'A';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0);
  return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
};

const MonthlyContributionsTable = ({ 
  contributions = [], 
  onOpenMissingContributions 
}) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Add debug logging
  useEffect(() => {
    // Check if recorder_name is available in the data
    if (contributions.length > 0) {
      const firstItem = contributions[0];
      if (!firstItem.recorder_name) {
        console.log('Warning: recorder_name is missing from contribution data:', firstItem);
      }
    }
  }, [contributions]);

  // Pagination logic
  const paginatedContributions = contributions.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(contributions.length / itemsPerPage);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Contributions</h3>
        <button
          onClick={onOpenMissingContributions}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
        >
          <AlertTriangle className="h-5 w-5" />
          <span>Missing Contributions</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left text-sm font-medium text-gray-600">Member</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Month</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Year</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Transaction Date</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Reference Number</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Recorded By</th>
              <th className="p-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContributions.map((contribution) => {
              // Get the admin name for display
              const recorderName = contribution.recorder_name || 'Unknown Admin';
              const initials = getInitials(recorderName);
              
              return (
                <tr key={contribution.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{contribution.member_name}</td>
                  <td className="p-3">{getMonthName(contribution.month)}</td>
                  <td className="p-3">{contribution.year}</td>
                  <td className="p-3">{formatCurrency(contribution.amount)}</td>
                  <td className="p-3">
                    {new Date(contribution.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{contribution.reference_number}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-blue-700">{initials}</span>
                      </div>
                      <span className="text-sm text-gray-700">{recorderName}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <button 
                      className="text-blue-500 hover:text-blue-700"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {contributions.length > itemsPerPage && (
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, contributions.length)} of{' '}
            {contributions.length} contributions
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

export default MonthlyContributionsTable;
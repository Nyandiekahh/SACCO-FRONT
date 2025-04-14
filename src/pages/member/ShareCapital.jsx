import React, { useState, useEffect } from 'react';
import MemberLayout from '../../layouts/MemberLayout';
import contributionService from '../../services/contributionService';
import memberService from '../../services/memberService';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

const ShareCapital = () => {
  const [shareCapitalPayments, setShareCapitalPayments] = useState([]);
  const [shareStats, setShareStats] = useState({
    totalShareCapital: 0,
    shareCapitalTarget: 0,
    completionPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch share capital data
  useEffect(() => {
    const fetchShareCapitalData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch share capital payments
        const paymentsResponse = await contributionService.getShareCapitalPayments();
        setShareCapitalPayments(paymentsResponse);

        // Fetch share summary for the current user
        const dashboardResponse = await memberService.getMemberDashboard();
        const shareSummary = dashboardResponse.share_summary || {};
        
        setShareStats({
          totalShareCapital: shareSummary.total_share_capital || 0,
          shareCapitalTarget: shareSummary.share_capital_target || 0,
          completionPercentage: shareSummary.share_capital_completion_percentage || 0
        });
      } catch (error) {
        console.error('Failed to fetch share capital data:', error);
        // TODO: Add error handling (e.g., toast notification)
      } finally {
        setIsLoading(false);
      }
    };

    fetchShareCapitalData();
  }, []);

  // Pagination logic
  const paginatedData = shareCapitalPayments.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );
  const totalPages = Math.ceil(shareCapitalPayments.length / itemsPerPage);

  if (isLoading) {
    return (
      <MemberLayout>
        <div className="p-6">
          <div className="text-center py-8">
            <p>Loading share capital data...</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Share Capital</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Total Share Capital</h3>
            <p className="text-xl font-bold text-indigo-600">
              {formatCurrency(shareStats.totalShareCapital)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Target Amount</h3>
            <p className="text-xl font-bold text-emerald-600">
              {formatCurrency(shareStats.shareCapitalTarget)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Completion</h3>
            <p className="text-xl font-bold text-yellow-600">
              {shareStats.completionPercentage}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${shareStats.completionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Share Capital Payments Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Reference Number</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Transaction Code</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(item.transaction_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{formatCurrency(item.amount)}</td>
                    <td className="p-3">{item.reference_number}</td>
                    <td className="p-3">{item.transaction_code || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {shareCapitalPayments.length > itemsPerPage && (
            <div className="flex justify-between items-center p-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * itemsPerPage + 1} to{' '}
                {Math.min(page * itemsPerPage, shareCapitalPayments.length)} of{' '}
                {shareCapitalPayments.length} payments
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

        {/* No Share Capital Payments Message */}
        {shareCapitalPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No share capital payments found.
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default ShareCapital;
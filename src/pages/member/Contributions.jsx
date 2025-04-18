import React, { useState, useEffect } from 'react';
import MemberLayout from '../../layouts/MemberLayout';
import contributionService from '../../services/contributionService';

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

const ContributionsPage = () => {
  const [monthlyContributions, setMonthlyContributions] = useState([]);
  const [shareCapitalPayments, setShareCapitalPayments] = useState([]);
  const [contributionStats, setContributionStats] = useState({
    totalContributions: 0,
    totalShareCapital: 0,
    totalInvestments: 0,
    contributionCount: 0,
    averageContribution: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('monthly');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch contribution data
  useEffect(() => {
    const fetchContributionData = async () => {
      try {
        setIsLoading(true);
        // Fetch monthly contributions - using member endpoint
        const monthlyResponse = await contributionService.getMemberContributions();
        setMonthlyContributions(Array.isArray(monthlyResponse) ? monthlyResponse : []);

        // Fetch share capital payments - using member endpoint
        const shareCapitalResponse = await contributionService.getMemberShareCapital();
        setShareCapitalPayments(Array.isArray(shareCapitalResponse) ? shareCapitalResponse : []);

        // Calculate contribution stats
        const contributionsArray = Array.isArray(monthlyResponse) ? monthlyResponse : [];
        const shareCapitalArray = Array.isArray(shareCapitalResponse) ? shareCapitalResponse : [];
        
        const totalContributions = contributionsArray.reduce((sum, contribution) => 
          sum + (parseFloat(contribution.amount) || 0), 0);
          
        const totalShareCapital = shareCapitalArray.reduce((sum, payment) => 
          sum + (parseFloat(payment.amount) || 0), 0);
        
        // Calculate total investments (contributions + share capital)
        const totalInvestments = totalContributions + totalShareCapital;
        
        setContributionStats({
          totalContributions,
          totalShareCapital,
          totalInvestments,
          contributionCount: contributionsArray.length,
          averageContribution: contributionsArray.length > 0 ? totalContributions / contributionsArray.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch contributions:', error);
        // Set empty arrays in case of error
        setMonthlyContributions([]);
        setShareCapitalPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributionData();
  }, []);

  // Determine which data to display based on active tab
  const currentData = activeTab === 'monthly' 
    ? monthlyContributions 
    : shareCapitalPayments;

  // Pagination logic
  const paginatedData = currentData.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  if (isLoading) {
    return (
      <MemberLayout>
        <div className="p-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Loading contributions...</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Contributions</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Monthly Contributions</h3>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(contributionStats.totalContributions)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Share Capital</h3>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(contributionStats.totalShareCapital)}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Total Investments</h3>
            <p className="text-xl font-bold text-purple-600">
              {formatCurrency(contributionStats.totalInvestments)}
            </p>
            <p className="text-xs text-purple-500">Monthly Contributions + Share Capital</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h3 className="text-gray-500 text-sm mb-2">Contribution Count</h3>
            <p className="text-xl font-bold text-yellow-600">
              {contributionStats.contributionCount}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-4">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => {
                setActiveTab('monthly');
                setPage(1); // Reset to first page when switching tabs
              }}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'monthly' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monthly Contributions
            </button>
            <button
              onClick={() => {
                setActiveTab('share-capital');
                setPage(1); // Reset to first page when switching tabs
              }}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'share-capital' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Share Capital
            </button>
          </nav>
        </div>

        {/* Contributions Table */}
        {currentData.length > 0 ? (
          <div className="bg-white shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {activeTab === 'monthly' ? (
                      <>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Month</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Year</th>
                      </>
                    ) : (
                      <th className="p-3 text-left text-sm font-medium text-gray-600">Date</th>
                    )}
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Reference Number</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Transaction Code</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      {activeTab === 'monthly' ? (
                        <>
                          <td className="p-3">
                            {item.month_name || getMonthName(item.month)}
                          </td>
                          <td className="p-3">{item.year}</td>
                        </>
                      ) : (
                        <td className="p-3">
                          {new Date(item.transaction_date).toLocaleDateString()}
                        </td>
                      )}
                      <td className="p-3">{formatCurrency(item.amount)}</td>
                      <td className="p-3">{item.reference_number || 'N/A'}</td>
                      <td className="p-3">{item.transaction_code || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {currentData.length > itemsPerPage && (
              <div className="flex justify-between items-center p-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(page * itemsPerPage, currentData.length)} of{' '}
                  {currentData.length} contributions
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
        ) : (
          <div className="bg-white shadow rounded-lg py-10">
            <div className="text-center py-8 text-gray-500">
              No {activeTab === 'monthly' ? 'monthly contributions' : 'share capital payments'} found.
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default ContributionsPage;
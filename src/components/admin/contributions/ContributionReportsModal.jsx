import React, { useState, useEffect } from 'react';
import contributionService from '../../../services/contributionService';

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount || 0);
};

const ContributionReportsModal = ({ 
  isOpen, 
  onClose 
}) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch contribution report
  const fetchContributionReport = async () => {
    setIsLoading(true);
    try {
      const response = await contributionService.generateMonthlyReport(year, month);
      setReportData(response);
    } catch (error) {
      console.error('Failed to fetch contribution report:', error);
      alert('Failed to generate report');
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger report fetch when year/month changes or modal opens
  useEffect(() => {
    if (isOpen) {
      fetchContributionReport();
    }
  }, [year, month, isOpen]);

  // Handle report download
  const handleDownloadReport = () => {
    if (!reportData) return;

    // Create CSV of contributors
    const csvContent = generateContributorCSV(reportData.contributors);
    
    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contributions_report_${year}_${month}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate CSV of contributors
  const generateContributorCSV = (contributors) => {
    if (!contributors || contributors.length === 0) return '';

    // CSV headers
    const headers = [
      'Member ID', 
      'Full Name', 
      'Membership Number', 
      'Email', 
      'Amount', 
      'Transaction Date', 
      'Reference Number'
    ];

    // Convert contributors to CSV rows
    const csvRows = contributors.map(contributor => [
      contributor.id,
      contributor.full_name,
      contributor.membership_number,
      contributor.email,
      contributor.amount,
      contributor.transaction_date,
      contributor.reference_number
    ]);

    // Combine headers and rows
    return [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Contribution Report</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            {/* Year Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                {[2023, 2024, 2025].map(yr => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                {monthOptions.map(monthOption => (
                  <option 
                    key={monthOption.value} 
                    value={monthOption.value}
                  >
                    {monthOption.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Button */}
            <div className="self-end">
              <button
                onClick={handleDownloadReport}
                disabled={!reportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
              >
                Download CSV
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <p>Generating report...</p>
            </div>
          )}

          {/* Report Data */}
          {!isLoading && reportData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Total Amount */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-sm text-gray-500">Total Amount</h3>
                  <p className="text-xl font-bold text-indigo-600">
                    {formatCurrency(reportData.total_amount)}
                  </p>
                </div>

                {/* Contributing Members */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-sm text-gray-500">Contributing Members</h3>
                  <p className="text-xl font-bold text-emerald-600">
                    {reportData.contributing_members} / {reportData.total_members}
                  </p>
                </div>

                {/* Growth Percentage */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-sm text-gray-500">Growth</h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {reportData.growth_percentage.toFixed(2)}%
                  </p>
                </div>

                {/* Report Date */}
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="text-sm text-gray-500">Report Date</h3>
                  <p className="text-xl font-bold text-rose-600">
                    {new Date(reportData.report_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Contributors Table */}
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Contributing Members</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Membership Number</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Full Name</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Amount</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Transaction Date</th>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Reference Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.contributors.map((contributor) => (
                        <tr key={contributor.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{contributor.membership_number}</td>
                          <td className="p-3">{contributor.full_name}</td>
                          <td className="p-3">{formatCurrency(contributor.amount)}</td>
                          <td className="p-3">
                            {new Date(contributor.transaction_date).toLocaleDateString()}
                          </td>
                          <td className="p-3">{contributor.reference_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* No Data State */}
          {!isLoading && !reportData && (
            <div className="text-center py-8">
              <p>No contribution data available for the selected month.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionReportsModal;
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Plus as PlusIcon, 
  FileText as FileTextIcon, 
  Clock as ClockIcon, 
  BarChart2 as ChartBarIcon,
  RefreshCw as RefreshCwIcon,
  Users as UsersIcon,
  TrendingUp as TrendingUpIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Search as SearchIcon
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import ContributionModal from '../../components/admin/contributions/ContributionModal';
import MonthlyContributionsTable from '../../components/admin/contributions/MonthlyContributionsTable';
import ShareCapitalTable from '../../components/admin/contributions/ShareCapitalTable';
import ContributionReminderModal from '../../components/admin/contributions/ContributionReminderModal';
import MissingContributionsModal from '../../components/admin/contributions/MissingContributionsModal';
import ContributionReportsModal from '../../components/admin/contributions/ContributionReportsModal';
import BulkUploadModal from '../../components/admin/contributions/BulkUploadModal';

// Services
import contributionService from '../../services/contributionService';
import memberService from '../../services/memberService';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

// Years and months for filtering
const YEARS = Array.from(
  { length: 5 }, 
  (_, i) => new Date().getFullYear() - i
);

const MONTHS = [
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

const ContributionsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('monthly');
  const [contributionStats, setContributionStats] = useState({
    totalContributions: 0,
    thisMonthContributions: 0,
    totalShareCapital: 0,
    contributingMembersCount: 0,
    contributingMembersPercentage: 0
  });

  // Advanced filtering states
  const [filters, setFilters] = useState({
    monthly: {
      year: new Date().getFullYear(),
      month: null,
      minAmount: '',
      maxAmount: ''
    },
    shareCapital: {
      year: new Date().getFullYear(),
      minAmount: '',
      maxAmount: ''
    }
  });

  // Enhanced modal and view states
  const [modalStates, setModalStates] = useState({
    contribution: false,
    reminder: false,
    missingContributions: false,
    reports: false,
    bulkUpload: false
  });

  // Data states with more comprehensive tracking
  const [monthlyContributions, setMonthlyContributions] = useState({
    data: [],
    loading: false,
    error: null
  });

  const [shareCapitalPayments, setShareCapitalPayments] = useState({
    data: [],
    loading: false,
    error: null
  });

  // Advanced data tracking
  const [contributionTrends, setContributionTrends] = useState({
    monthlyTrend: [],
    shareCapitalTrend: []
  });

  // Comprehensive fetch and update contribution data
  const fetchContributionData = useCallback(async () => {
    try {
      // Set loading states
      setMonthlyContributions(prev => ({ ...prev, loading: true }));
      setShareCapitalPayments(prev => ({ ...prev, loading: true }));

      // Parallel data fetching
      const [
        statsResponse, 
        monthlyResponse, 
        shareCapitalResponse
      ] = await Promise.all([
        contributionService.getContributionStats(),
        contributionService.getMonthlyContributions(filters.monthly),
        contributionService.getShareCapitalPayments(filters.shareCapital)
      ]);

      // Update states with detailed information
      setContributionStats(statsResponse);
      setMonthlyContributions({
        data: monthlyResponse,
        loading: false,
        error: null
      });
      setShareCapitalPayments({
        data: shareCapitalResponse,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to fetch contribution data:', error);
      // Update error states
      setMonthlyContributions(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      setShareCapitalPayments(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [filters]);

  // Initial and filtered data fetch
  useEffect(() => {
    fetchContributionData();
  }, [fetchContributionData]);

  // Filter change handlers
  const handleFilterChange = (type, field, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  // Modal and action handlers
  const toggleModal = (modalName, isOpen) => {
    setModalStates(prev => ({
      ...prev,
      [modalName]: isOpen
    }));
  };

  // Share recalculation handler
  const handleRecalculateShares = async () => {
    try {
      await contributionService.recalculateShares();
      // Refresh data
      fetchContributionData();
      // TODO: Add success notification
    } catch (error) {
      console.error('Failed to recalculate shares:', error);
      // TODO: Add error notification
    }
  };

  // Export functionality
  const handleExportContributions = async () => {
    try {
      const exportData = activeTab === 'monthly' 
        ? await contributionService.getMonthlyContributions(filters.monthly)
        : await contributionService.getShareCapitalPayments(filters.shareCapital);
      
      // Convert to CSV
      const csvContent = convertToCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab}_contributions_export.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Add error notification
    }
  };

  // CSV conversion utility
  const convertToCSV = (data) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          `"${row[header] !== null ? row[header].toString().replace(/"/g, '""') : ''}"`.replace(/\n/g, ' ')
        ).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 space-y-6">
        {/* Page Header with Advanced Actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Contributions Management
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={handleExportContributions}
              className="btn btn-outline flex items-center space-x-2"
            >
              <DownloadIcon className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => toggleModal('bulkUpload', true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Bulk Upload</span>
            </button>
          </div>
        </div>

        {/* Contribution Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Contributions Card */}
          <div className="bg-white shadow rounded-lg p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Contributions</h3>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(contributionStats.totalContributions)}
              </p>
              <p className="text-xs text-gray-500">
                {contributionStats.contributingMembersPercentage}% Members Contributing
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-indigo-500" />
          </div>

          {/* This Month's Contributions Card */}
          <div className="bg-white shadow rounded-lg p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500">This Month</h3>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(contributionStats.thisMonthContributions)}
              </p>
              <p className="text-xs text-gray-500">Monthly Contribution Total</p>
            </div>
            <ClockIcon className="h-8 w-8 text-emerald-500" />
          </div>

          {/* Total Share Capital Card */}
          <div className="bg-white shadow rounded-lg p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Share Capital</h3>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(contributionStats.totalShareCapital)}
              </p>
              <p className="text-xs text-gray-500">Total Capital Raised</p>
            </div>
            <UsersIcon className="h-8 w-8 text-yellow-500" />
          </div>

          {/* Contributing Members Card */}
          <div className="bg-white shadow rounded-lg p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Members Contributing</h3>
              <p className="text-xl font-bold text-gray-800">
                {contributionStats.contributingMembersCount}
              </p>
              <p className="text-xs text-gray-500">Active Contributors</p>
            </div>
            <TrendingUpIcon className="h-8 w-8 text-rose-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={() => toggleModal('contribution', true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Record Contribution</span>
            </button>
            <button 
              onClick={() => toggleModal('reminder', true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <ClockIcon className="h-5 w-5" />
              <span>Send Reminder</span>
            </button>
            <button 
              onClick={() => toggleModal('reports', true)}
              className="btn btn-outline flex items-center space-x-2"
            >
              <FileTextIcon className="h-5 w-5" />
              <span>Generate Report</span>
            </button>
          </div>
          <button 
            onClick={handleRecalculateShares}
            className="btn btn-ghost flex items-center space-x-2"
          >
            <RefreshCwIcon className="h-5 w-5" />
            <span>Recalculate Shares</span>
          </button>
        </div>

        {/* Advanced Filtering Section */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center space-x-4 mb-4">
            <FilterIcon className="h-6 w-6 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-700">
              Advanced Filters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                value={activeTab === 'monthly' ? filters.monthly.year : filters.shareCapital.year}
                onChange={(e) => handleFilterChange(
                  activeTab === 'monthly' ? 'monthly' : 'shareCapital', 
                  'year', 
                  Number(e.target.value)
                )}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Filter (for Monthly Contributions) */}
            {activeTab === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <select
                  value={filters.monthly.month || ''}
                  onChange={(e) => handleFilterChange('monthly', 'month', 
                    e.target.value ? Number(e.target.value) : null
                  )}
                  className="mt-1 block w-full rounded-md border-gray-300"
                >
                  <option value="">All Months</option>
                  {MONTHS.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Min Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Amount</label>
              <input
                type="number"
                value={activeTab === 'monthly' ? filters.monthly.minAmount : filters.shareCapital.minAmount}
                onChange={(e) => handleFilterChange(
                  activeTab === 'monthly' ? 'monthly' : 'shareCapital', 
                  'minAmount', 
                  e.target.value
                )}
                className="mt-1 block w-full rounded-md border-gray-300"
                placeholder="Minimum Amount"
              />
            </div>

            {/* Max Amount Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Amount</label>
              <input
                type="number"
                value={activeTab === 'monthly' ? filters.monthly.maxAmount : filters.shareCapital.maxAmount}
                onChange={(e) => handleFilterChange(
                  activeTab === 'monthly' ? 'monthly' : 'shareCapital', 
                  'maxAmount', 
                  e.target.value
                )}
                className="mt-1 block w-full rounded-md border-gray-300"
                placeholder="Maximum Amount"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'monthly' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monthly Contributions
            </button>
            <button
              onClick={() => setActiveTab('share-capital')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'share-capital' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Share Capital
            </button>
          </nav>
        </div>

        {/* Table Section */}
        {activeTab === 'monthly' ? (
          <MonthlyContributionsTable 
            contributions={monthlyContributions.data}
            loading={monthlyContributions.loading}
            error={monthlyContributions.error}
            onOpenMissingContributions={() => toggleModal('missingContributions', true)}
          />
        ) : (
          <ShareCapitalTable 
            payments={shareCapitalPayments.data}
            loading={shareCapitalPayments.loading}
            error={shareCapitalPayments.error}
            onOpenIncompletePayments={() => toggleModal('missingContributions', true)}
          />
        )}

        {/* Modals */}
        <ContributionModal 
          isOpen={modalStates.contribution}
          onClose={() => toggleModal('contribution', false)}
          onContributionAdded={fetchContributionData}
        />

        <ContributionReminderModal 
          isOpen={modalStates.reminder}
          onClose={() => toggleModal('reminder', false)}
        />

        <MissingContributionsModal 
          isOpen={modalStates.missingContributions}
          onClose={() => toggleModal('missingContributions', false)}
        />

        <ContributionReportsModal 
          isOpen={modalStates.reports}
          onClose={() => toggleModal('reports', false)}
        />

        <BulkUploadModal 
          isOpen={modalStates.bulkUpload}
          onClose={() => toggleModal('bulkUpload', false)}
          onUploadComplete={fetchContributionData}
        />
      </div>
    </AdminLayout>
  );
};

export default ContributionsPage;
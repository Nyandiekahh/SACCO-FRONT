import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  FileTextIcon, 
  ClockIcon, 
  ChartBarIcon,
  RefreshCwIcon,
  UsersIcon,
  TrendingUpIcon
} from 'lucide-react';

import AdminLayout from '../../layouts/AdminLayout';
import ContributionModal from '../../components/admin/contributions/ContributionModal';
import MonthlyContributionsTable from '../../components/admin/contributions/MonthlyContributionsTable';
import ShareCapitalTable from '../../components/admin/contributions/ShareCapitalTable';
import ContributionReminderModal from '../../components/admin/contributions/ContributionReminderModal';
import MissingContributionsModal from '../../components/admin/contributions/MissingContributionsModal';
import ContributionReportsModal from '../../components/admin/contributions/ContributionReportsModal';

// Services
import contributionService from '../../services/contributionService';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

const ContributionsPage = () => {
  // State for page sections
  const [activeTab, setActiveTab] = useState('monthly');
  const [contributionStats, setContributionStats] = useState({
    totalContributions: 0,
    thisMonthContributions: 0,
    totalShareCapital: 0,
    contributingMembersCount: 0,
    contributingMembersPercentage: 0
  });

  // Modal states
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isMissingContributionsModalOpen, setIsMissingContributionsModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Data states
  const [monthlyContributions, setMonthlyContributions] = useState([]);
  const [shareCapitalPayments, setShareCapitalPayments] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchContributionData();
  }, []);

  // Fetch contribution data
  const fetchContributionData = async () => {
    try {
      // Parallel data fetching
      const [statsResponse, monthlyResponse, shareCapitalResponse] = await Promise.all([
        contributionService.getContributionStats(),
        contributionService.getMonthlyContributions(),
        contributionService.getShareCapitalPayments()
      ]);

      // Update states
      setContributionStats(statsResponse);
      setMonthlyContributions(monthlyResponse);
      setShareCapitalPayments(shareCapitalResponse);
    } catch (error) {
      console.error('Failed to fetch contribution data:', error);
      // TODO: Add error handling toast/notification
    }
  };

  // Handle recalculating shares
  const handleRecalculateShares = async () => {
    try {
      await contributionService.recalculateShares();
      // TODO: Add success notification
      fetchContributionData(); // Refresh data
    } catch (error) {
      console.error('Failed to recalculate shares:', error);
      // TODO: Add error handling toast/notification
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Contributions Management</h1>

        {/* Contribution Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Contributions */}
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 text-sm">Total Contributions</h3>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(contributionStats.totalContributions)}
                </p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {contributionStats.contributingMembersPercentage}% Members Contributing
            </div>
          </div>

          {/* This Month's Contributions */}
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 text-sm">This Month</h3>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(contributionStats.thisMonthContributions)}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Monthly Contribution Total
            </div>
          </div>

          {/* Total Share Capital */}
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 text-sm">Share Capital</h3>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(contributionStats.totalShareCapital)}
                </p>
              </div>
              <UsersIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Total Capital Raised
            </div>
          </div>

          {/* Contributing Members */}
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 text-sm">Members Contributing</h3>
                <p className="text-xl font-bold text-gray-800">
                  {contributionStats.contributingMembersCount}
                </p>
              </div>
              <TrendingUpIcon className="h-8 w-8 text-rose-500" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Active Contributors
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsContributionModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Record Contribution</span>
            </button>
            <button 
              onClick={() => setIsReminderModalOpen(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <ClockIcon className="h-5 w-5" />
              <span>Send Reminder</span>
            </button>
            <button 
              onClick={() => setIsReportsModalOpen(true)}
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

        {/* Tabs */}
        <div className="mb-4 border-b">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-2 px-4 border-b-2 ${
                activeTab === 'monthly' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Monthly Contributions
            </button>
            <button
              onClick={() => setActiveTab('share-capital')}
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

        {/* Table Section */}
        {activeTab === 'monthly' ? (
          <MonthlyContributionsTable 
            contributions={monthlyContributions}
            onOpenMissingContributions={() => setIsMissingContributionsModalOpen(true)}
          />
        ) : (
          <ShareCapitalTable 
            payments={shareCapitalPayments}
          />
        )}

        {/* Modals */}
        <ContributionModal 
          isOpen={isContributionModalOpen}
          onClose={() => setIsContributionModalOpen(false)}
          onContributionAdded={fetchContributionData}
        />

        <ContributionReminderModal 
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
        />

        <MissingContributionsModal 
          isOpen={isMissingContributionsModalOpen}
          onClose={() => setIsMissingContributionsModalOpen(false)}
        />

        <ContributionReportsModal 
          isOpen={isReportsModalOpen}
          onClose={() => setIsReportsModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};

export default ContributionsPage;
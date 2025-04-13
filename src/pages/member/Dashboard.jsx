import React, { useState, useEffect } from 'react';
import MemberLayout from '../../layouts/MemberLayout';
import { Link } from 'react-router-dom';
import { memberService } from '../../services';
import { 
  Wallet, 
  CreditCard, 
  FileText, 
  RefreshCw, 
  User, 
  BarChart2 
} from 'lucide-react';
import {
  ProfileSummary,
  SharesAndContributions,
  ActiveLoans,
  NextContribution,
  DocumentVerification
} from '../../components/member/dashboard';

// Quick Action Card Component
const QuickActionCard = ({ icon: Icon, title, description, to, bgColor }) => (
  <Link 
    to={to} 
    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-full ${bgColor} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${bgColor}`} />
      </div>
      <RefreshCw className="w-5 h-5 text-gray-400 hover:text-gray-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await memberService.getMemberDashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Could not load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </MemberLayout>
    );
  }

  if (error) {
    return (
      <MemberLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (!dashboardData) {
    return (
      <MemberLayout>
        <div className="text-center text-gray-500">No dashboard data available</div>
      </MemberLayout>
    );
  }

  const { profile, shares_summary, contributions, loans, documents } = dashboardData;

  return (
    <MemberLayout>
      {/* Profile Summary */}
      <ProfileSummary profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Shares & Contributions */}
        <div className="lg:col-span-2">
          <SharesAndContributions 
            sharesSummary={shares_summary} 
            contributions={contributions}
          />
        </div>

        {/* Next Contribution */}
        <div>
          <NextContribution nextDue={contributions.next_due} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Active Loans */}
        <div className="lg:col-span-2">
          <ActiveLoans loans={loans.active_loans} />
        </div>

        {/* Document Verification */}
        <div>
          <DocumentVerification documents={documents} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard 
          icon={CreditCard}
          title="Contributions"
          description="Make a contribution"
          to="/member/contributions"
          bgColor="text-blue-500"
        />
        
        <QuickActionCard 
          icon={Wallet}
          title="Share Capital"
          description="Add share capital"
          to="/member/share-capital"
          bgColor="text-green-500"
        />
        
        <QuickActionCard 
          icon={FileText}
          title="Loan Application"
          description="Apply for a loan"
          to="/member/loan-application"
          bgColor="text-purple-500"
        />
        
        <QuickActionCard 
          icon={User}
          title="Update Profile"
          description="Manage profile"
          to="/member/profile"
          bgColor="text-yellow-500"
        />
      </div>
    </MemberLayout>
  );
};

export default Dashboard;
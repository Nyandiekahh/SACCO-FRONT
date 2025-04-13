// components/member/dashboard/SharesAndContributions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SharesAndContributions = ({ sharesSummary, contributions }) => {
  if (!sharesSummary || !contributions) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Shares & Contributions</h3>
        <Link to="/member/contributions" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View History
        </Link>
      </div>
      
      <div className="px-6 py-4">
        {/* Share Capital Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Share Capital Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {sharesSummary.share_capital_completion_percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${sharesSummary.share_capital_completion_percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>KES {sharesSummary.total_share_capital?.toLocaleString() || 0}</span>
            <span>Target: KES {sharesSummary.share_capital_target?.toLocaleString() || 0}</span>
          </div>
        </div>
        
        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Contributions</p>
            <p className="text-xl font-semibold text-gray-900">
              KES {sharesSummary.total_contributions?.toLocaleString() || 0}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Deposits</p>
            <p className="text-xl font-semibold text-gray-900">
              KES {sharesSummary.total_deposits?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {sharesSummary.percentage_of_total_pool}% of total pool
            </p>
          </div>
        </div>
        
        {/* Recent Contributions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-700">Recent Contributions</h4>
          </div>
          
          {contributions.recent_contributions && contributions.recent_contributions.length > 0 ? (
            <div className="space-y-3">
              {contributions.recent_contributions.map((contribution, index) => (
                <div key={contribution.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {contribution.month_name} {contribution.year}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(contribution.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      KES {contribution.amount?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recent contributions
            </div>
          )}
          
          <div className="mt-4 flex justify-center">
            <Link 
              to="/member/contributions" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
            >
              See All Contributions
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharesAndContributions;
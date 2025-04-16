// components/admin/dashboard/RecentContributions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecentContributions = ({ contributions = [] }) => {
  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get member initials for avatar
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'M';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Get contribution type display text
  const getContributionType = (type) => {
    if (!type) return 'Contribution';
    if (type === 'MONTHLY' || type === 'monthly') return 'Monthly';
    if (type === 'SHARE_CAPITAL' || type === 'share-capital' || type === 'share_capital') return 'Share Capital';
    return type;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Contributions</h2>
        <Link to="/admin/contributions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">View all</Link>
      </div>

      {contributions.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          No recent contributions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contributions.map((contribution, index) => (
                <tr key={contribution.id || index} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                        {getInitials(contribution.member_name)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {contribution.member_name || 'Unknown Member'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {contribution.membership_number || 'No ID'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      KES {parseFloat(contribution.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      contribution.contribution_type === 'MONTHLY' || contribution.contribution_type === 'monthly'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getContributionType(contribution.contribution_type)}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(contribution.transaction_date || contribution.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentContributions;
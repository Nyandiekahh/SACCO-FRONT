// components/admin/dashboard/MembershipStats.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MembershipStats = ({ memberStats = {} }) => {
  // Ensure all required properties exist with defaults
  const stats = {
    activeMembers: memberStats.activeMembers || 0,
    inactiveMembers: memberStats.inactiveMembers || 0,
    onHoldMembers: memberStats.onHoldMembers || 0,
    pendingVerification: memberStats.pendingVerification || 0,
    growthRate: memberStats.growthRate || 0,
    membershipTarget: memberStats.membershipTarget || 0,
    completedShareCapital: memberStats.completedShareCapital || 0,
    inProgressShareCapital: memberStats.inProgressShareCapital || 0,
    notStartedShareCapital: memberStats.notStartedShareCapital || 0
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Membership Stats</h3>
        <Link to="/admin/members" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all members
        </Link>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Active Members */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Active Members</p>
                <p className="text-lg font-semibold text-gray-900">{stats.activeMembers}</p>
              </div>
            </div>
          </div>
          
          {/* Inactive Members */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Inactive Members</p>
                <p className="text-lg font-semibold text-gray-900">{stats.inactiveMembers}</p>
              </div>
            </div>
          </div>
          
          {/* On Hold Members */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">On Hold</p>
                <p className="text-lg font-semibold text-gray-900">{stats.onHoldMembers}</p>
              </div>
            </div>
          </div>
          
          {/* Pending Verification */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Pending Verification</p>
                <p className="text-lg font-semibold text-gray-900">{stats.pendingVerification}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Membership Growth */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Membership Growth</h4>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                style={{ width: `${Math.min(stats.growthRate, 100)}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Growth Rate: {stats.growthRate}%</span>
              <span>Target: {stats.membershipTarget}</span>
            </div>
          </div>
        </div>
        
        {/* Member Stats by Share Completion */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Share Capital Completion</h4>
          <div className="flex justify-between space-x-4">
            {/* Completed */}
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs text-gray-500">Completed</div>
                <div className="text-lg font-bold text-green-600">{stats.completedShareCapital}</div>
              </div>
            </div>
            
            {/* In Progress */}
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs text-gray-500">In Progress</div>
                <div className="text-lg font-bold text-yellow-600">{stats.inProgressShareCapital}</div>
              </div>
            </div>
            
            {/* Not Started */}
            <div className="flex-1 bg-gray-50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs text-gray-500">Not Started</div>
                <div className="text-lg font-bold text-red-600">{stats.notStartedShareCapital}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipStats;
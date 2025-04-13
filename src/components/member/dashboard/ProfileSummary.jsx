// components/member/dashboard/ProfileSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileSummary = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl">
            {profile.full_name ? profile.full_name.charAt(0) : 'M'}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">{profile.full_name}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
              <span className="mr-3">Membership No: {profile.membership_number}</span>
              <span className="hidden sm:inline">•</span>
              <span className="mt-1 sm:mt-0 sm:ml-3">
                Joined: {new Date(profile.date_joined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          {profile.is_on_hold && (
            <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Account on Hold
            </div>
          )}
          
          {!profile.is_verified && (
            <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Pending Verification
            </div>
          )}
          
          <Link to="/member/profile" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Edit Profile
          </Link>
        </div>
      </div>
      
      {profile.is_on_hold && profile.on_hold_reason && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
          <p className="font-medium">Reason: {profile.on_hold_reason}</p>
          <p className="mt-1">Please contact an administrator for assistance.</p>
        </div>
      )}
      
      {!profile.is_verified && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
          <p className="font-medium text-yellow-800">Your account is pending verification.</p>
          <p className="mt-1 text-yellow-700">
            Please ensure all required documents are uploaded to complete the verification process.
          </p>
          <Link to="/member/documents" className="mt-2 inline-flex items-center text-yellow-800 font-medium hover:text-yellow-900">
            Upload Documents
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileSummary;
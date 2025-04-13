// components/member/dashboard/DocumentVerification.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DocumentVerification = ({ documents }) => {
  if (!documents) return null;
  
  // Calculate verification status
  const idFrontUploaded = documents.id_front?.uploaded || false;
  const idFrontVerified = documents.id_front?.verified || false;
  const idBackUploaded = documents.id_back?.uploaded || false;
  const idBackVerified = documents.id_back?.verified || false;
  
  const allUploaded = idFrontUploaded && idBackUploaded;
  const allVerified = idFrontVerified && idBackVerified;
  const partiallyUploaded = (idFrontUploaded || idBackUploaded) && !(idFrontUploaded && idBackUploaded);
  const partiallyVerified = (idFrontVerified || idBackVerified) && !(idFrontVerified && idBackVerified);
  
  // Determine status display
  let statusIcon;
  let statusTitle;
  let statusDescription;
  let statusClass;
  
  if (allVerified) {
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
    statusTitle = 'Verified';
    statusDescription = 'All your documents have been verified.';
    statusClass = 'bg-green-100 text-green-600';
  } else if (allUploaded && !allVerified) {
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
    statusTitle = 'Pending Verification';
    statusDescription = 'Your documents have been uploaded and are pending verification.';
    statusClass = 'bg-yellow-100 text-yellow-600';
  } else if (partiallyUploaded) {
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    );
    statusTitle = 'Incomplete';
    statusDescription = 'Some documents are missing. Please upload all required documents.';
    statusClass = 'bg-red-100 text-red-600';
  } else {
    statusIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
    statusTitle = 'Documents Required';
    statusDescription = 'Please upload your identification documents to complete verification.';
    statusClass = 'bg-blue-100 text-blue-600';
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Document Verification</h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-full ${statusClass} mb-4`}>
            {statusIcon}
          </div>
          
          <h4 className="text-xl font-medium text-gray-900 mb-1">
            {statusTitle}
          </h4>
          
          <p className="text-gray-500 text-center mb-6">
            {statusDescription}
          </p>
          
          <div className="w-full space-y-3 mb-6">
            {/* ID Front */}
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span className="text-sm text-gray-700">ID Card (Front)</span>
              </div>
              <div>
                {idFrontVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                ) : idFrontUploaded ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Missing
                  </span>
                )}
              </div>
            </div>
            
            {/* ID Back */}
            <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span className="text-sm text-gray-700">ID Card (Back)</span>
              </div>
              <div>
                {idBackVerified ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                ) : idBackUploaded ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Missing
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {!allUploaded && (
            <Link 
              to="/member/documents" 
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Documents
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;
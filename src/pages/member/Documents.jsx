// pages/member/Documents.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import MemberLayout from '../../layouts/MemberLayout';
import authService from '../../services/authService';

const Documents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState({
    id_front: { uploaded: false, verified: false },
    id_back: { uploaded: false, verified: false },
    passport: { uploaded: false, verified: false }
  });
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await authService.getCurrentUser();
      setProfile(userProfile);
      
      // Update document status from profile
      if (userProfile.documents) {
        setDocuments(userProfile.documents);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load document status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG or PDF.');
      return;
    }

    try {
      setUploading(true);
      
      // Create document data object for upload
      const documentData = {
        document_type: documentType,
        document: file
      };

      // Upload document
      await authService.uploadDocument(documentData);
      
      // Update local state
      setDocuments(prev => ({
        ...prev,
        [documentType.toLowerCase().replace('_', '_')]: {
          ...prev[documentType.toLowerCase().replace('_', '_')],
          uploaded: true
        }
      }));

      toast.success('Document uploaded successfully');
      
      // Refresh profile to get updated document status
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const getDocumentStatus = (docType) => {
    const doc = documents[docType.toLowerCase().replace('_', '_')];
    
    if (!doc || !doc.uploaded) {
      return <span className="text-gray-500">Not uploaded</span>;
    }
    
    if (doc.verified) {
      return <span className="text-green-600 font-medium">✓ Verified</span>;
    }
    
    return <span className="text-yellow-600 font-medium">Pending verification</span>;
  };

  if (isLoading) {
    return (
      <MemberLayout>
        <div className="bg-white shadow rounded-lg p-6 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">My Documents</h2>
        <p className="text-gray-600 mb-6">
          Upload your identification documents for verification. We require a clear image of both sides of your ID card and a passport photo.
        </p>

        <div className="space-y-6">
          {/* ID Card Front */}
          <div className="border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">ID Card (Front)</h3>
                <p className="text-sm text-gray-600">Upload a clear image of the front of your ID card</p>
              </div>
              <div className="mt-2 sm:mt-0">{getDocumentStatus('ID_FRONT')}</div>
            </div>
            
            <div className="flex items-center mt-4">
              <label className={`
                flex justify-center items-center px-4 py-2 rounded-md text-sm
                ${documents.id_front?.verified 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'}
              `}>
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                {documents.id_front?.uploaded ? 'Replace Document' : 'Upload Document'}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'ID_FRONT')}
                  disabled={documents.id_front?.verified || uploading} 
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>
            </div>
          </div>

          {/* ID Card Back */}
          <div className="border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">ID Card (Back)</h3>
                <p className="text-sm text-gray-600">Upload a clear image of the back of your ID card</p>
              </div>
              <div className="mt-2 sm:mt-0">{getDocumentStatus('ID_BACK')}</div>
            </div>
            
            <div className="flex items-center mt-4">
              <label className={`
                flex justify-center items-center px-4 py-2 rounded-md text-sm
                ${documents.id_back?.verified 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'}
              `}>
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                {documents.id_back?.uploaded ? 'Replace Document' : 'Upload Document'}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'ID_BACK')}
                  disabled={documents.id_back?.verified || uploading} 
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>
            </div>
          </div>

          {/* Passport Photo */}
          <div className="border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Passport Photo</h3>
                <p className="text-sm text-gray-600">Upload a recent passport-sized photo of yourself</p>
              </div>
              <div className="mt-2 sm:mt-0">{getDocumentStatus('PASSPORT')}</div>
            </div>
            
            <div className="flex items-center mt-4">
              <label className={`
                flex justify-center items-center px-4 py-2 rounded-md text-sm
                ${documents.passport?.verified 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'}
              `}>
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </span>
                {documents.passport?.uploaded ? 'Replace Document' : 'Upload Document'}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => handleFileUpload(e, 'PASSPORT')} 
                  disabled={documents.passport?.verified || uploading}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-medium text-gray-800 mb-2">KYC Verification Status</h3>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${profile?.is_verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className={`font-medium ${profile?.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
              {profile?.is_verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {profile?.is_verified
              ? 'Your identity has been verified. Thank you for completing the KYC process.'
              : documents.id_front?.uploaded && documents.id_back?.uploaded
                ? 'Your documents are being reviewed by our team. This typically takes 1-2 business days.'
                : 'Please upload both sides of your ID card to complete the verification process.'}
          </p>
        </div>
      </div>
    </MemberLayout>
  );
};

export default Documents;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import DocumentUploadForm from '../../components/auth/DocumentUploadForm';
import { useAuth } from '../../context/AuthContext';

const DocumentUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { currentUser, uploadDocument } = useAuth();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
    }
  }, [currentUser, navigate]);

  // Check if user is already verified
  useEffect(() => {
    if (currentUser?.is_verified) {
      navigate('/member/dashboard');
    }
  }, [currentUser, navigate]);

  const handleUpload = async (documentData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await uploadDocument(documentData);
      
      if (result.success) {
        setSuccess(`Document uploaded successfully. It will be verified by an administrator.`);
        
        // Check if we've uploaded both ID sides
        const hasFront = currentUser?.documents?.id_front?.uploaded;
        const hasBack = currentUser?.documents?.id_back?.uploaded;
        
        if (documentData.document_type === 'ID_FRONT' || documentData.document_type === 'ID_BACK') {
          if ((documentData.document_type === 'ID_FRONT' && hasBack) || 
              (documentData.document_type === 'ID_BACK' && hasFront)) {
            // Show more detailed success message if both sides are uploaded
            setSuccess(`ID document uploaded successfully. Both sides of your ID card have been uploaded. They will be verified by an administrator.`);
          }
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Document upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Document Verification</h1>
        <p className="text-center text-gray-600">
          Please upload your identification documents for verification
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-lg mx-auto" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded w-full max-w-lg mx-auto" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <DocumentUploadForm 
        onUpload={handleUpload} 
        loading={loading}
        documents={currentUser?.documents}
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Your account will be pending until your documents are verified. You'll have limited access until verification is complete.
        </p>
        <button
          onClick={() => navigate('/member/dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          Continue to Dashboard
        </button>
      </div>
    </AuthLayout>
  );
};

export default DocumentUpload;
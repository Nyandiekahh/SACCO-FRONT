import React, { useState, useEffect } from 'react';
import MemberLayout from '../../layouts/MemberLayout';
import { User, Phone, Mail, CreditCard, Building, Upload, CheckCircle, RefreshCw, X, AlertCircle } from 'lucide-react';
import { authService } from '../../services';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [uploadType, setUploadType] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Using the correct function from your authService
      const data = await authService.getCurrentUser();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Could not load your profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError(null);
    
    try {
      const formData = new FormData(e.target);
      const formValues = Object.fromEntries(formData.entries());
      
      await authService.updateUserProfile(formValues);
      await fetchProfile();
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleDocumentUpload = (type) => {
    setUploadType(type);
    setUploadError('');
    setShowUploadModal(true);
  };

  const processFileUpload = async (file) => {
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPG, PNG, and PDF files are allowed');
      return;
    }
    
    try {
      await authService.uploadDocument({
        document_type: uploadType,
        document: file
      });
      
      setShowUploadModal(false);
      setSuccess('Document uploaded successfully!');
      
      // Refresh profile to get updated document status
      await fetchProfile();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading document:', err);
      setUploadError('Failed to upload document. Please try again.');
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </MemberLayout>
    );
  }

  if (error && !profile) {
    return (
      <MemberLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {profile?.membership_number && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {profile.membership_number}
            </span>
          )}
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && profile && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Account status */}
        {profile?.is_on_hold && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Account On Hold</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {profile.on_hold_reason || 'Your account has been placed on hold. Please contact the administrator.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Verification status */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Verification Status</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                profile?.is_verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile?.is_verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  profile?.documents?.id_front?.verified 
                    ? 'bg-green-100' 
                    : profile?.documents?.id_front?.uploaded
                    ? 'bg-yellow-100'
                    : 'bg-gray-100'
                }`}>
                  <User className={`h-5 w-5 ${
                    profile?.documents?.id_front?.verified 
                      ? 'text-green-600' 
                      : profile?.documents?.id_front?.uploaded
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ID Front</p>
                  <p className="text-xs text-gray-500">
                    {profile?.documents?.id_front?.verified 
                      ? 'Verified' 
                      : profile?.documents?.id_front?.uploaded
                      ? 'Uploaded, pending verification'
                      : 'Not uploaded'}
                  </p>
                </div>
                {!profile?.documents?.id_front?.verified && (
                  <button 
                    onClick={() => handleDocumentUpload('ID_FRONT')}
                    className="ml-auto px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    {profile?.documents?.id_front?.uploaded ? 'Update' : 'Upload'}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  profile?.documents?.id_back?.verified 
                    ? 'bg-green-100' 
                    : profile?.documents?.id_back?.uploaded
                    ? 'bg-yellow-100'
                    : 'bg-gray-100'
                }`}>
                  <User className={`h-5 w-5 ${
                    profile?.documents?.id_back?.verified 
                      ? 'text-green-600' 
                      : profile?.documents?.id_back?.uploaded
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ID Back</p>
                  <p className="text-xs text-gray-500">
                    {profile?.documents?.id_back?.verified 
                      ? 'Verified' 
                      : profile?.documents?.id_back?.uploaded
                      ? 'Uploaded, pending verification'
                      : 'Not uploaded'}
                  </p>
                </div>
                {!profile?.documents?.id_back?.verified && (
                  <button 
                    onClick={() => handleDocumentUpload('ID_BACK')}
                    className="ml-auto px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    {profile?.documents?.id_back?.uploaded ? 'Update' : 'Upload'}
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  profile?.documents?.passport?.verified 
                    ? 'bg-green-100' 
                    : profile?.documents?.passport?.uploaded
                    ? 'bg-yellow-100'
                    : 'bg-gray-100'
                }`}>
                  <User className={`h-5 w-5 ${
                    profile?.documents?.passport?.verified 
                      ? 'text-green-600' 
                      : profile?.documents?.passport?.uploaded
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Passport Photo</p>
                  <p className="text-xs text-gray-500">
                    {profile?.documents?.passport?.verified 
                      ? 'Verified' 
                      : profile?.documents?.passport?.uploaded
                      ? 'Uploaded, pending verification'
                      : 'Not uploaded'}
                  </p>
                </div>
                {!profile?.documents?.passport?.verified && (
                  <button 
                    onClick={() => handleDocumentUpload('PASSPORT')}
                    className="ml-auto px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    {profile?.documents?.passport?.uploaded ? 'Update' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal information and preferences.
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      defaultValue={profile?.full_name || ''}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="shadow-sm bg-gray-50 cursor-not-allowed block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="id_number" className="block text-sm font-medium text-gray-700">
                    ID Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="id_number"
                      id="id_number"
                      defaultValue={profile?.id_number || ''}
                      required
                      pattern="^\d{8,10}$"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">ID number must be 8-10 digits</p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone_number"
                      id="phone_number"
                      defaultValue={profile?.phone_number || ''}
                      required
                      pattern="^\+?\d{10,15}$"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Format: +254700000000</p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                    WhatsApp Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="whatsapp_number"
                      id="whatsapp_number"
                      defaultValue={profile?.whatsapp_number || ''}
                      pattern="^\+?\d{10,15}$"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Optional</p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="mpesa_number" className="block text-sm font-medium text-gray-700">
                    M-Pesa Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="mpesa_number"
                      id="mpesa_number"
                      defaultValue={profile?.mpesa_number || ''}
                      required
                      pattern="^\+?\d{10,15}$"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6 border-t border-gray-200 pt-5">
                  <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="bank_name" className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="bank_name"
                      id="bank_name"
                      defaultValue={profile?.bank_name || ''}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="bank_account_number" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="bank_account_number"
                      id="bank_account_number"
                      defaultValue={profile?.bank_account_number || ''}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="bank_account_name" className="block text-sm font-medium text-gray-700">
                    Account Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="bank_account_name"
                      id="bank_account_name"
                      defaultValue={profile?.bank_account_name || ''}
                      required
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="share_capital_term" className="block text-sm font-medium text-gray-700">
                    Share Capital Term
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="share_capital_term"
                      value={`${profile?.share_capital_term || 12} months`}
                      readOnly
                      className="shadow-sm bg-gray-50 cursor-not-allowed block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Set by admin during registration</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Upload document modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowUploadModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upload {uploadType === 'ID_FRONT' ? 'ID Card (Front)' : 
                           uploadType === 'ID_BACK' ? 'ID Card (Back)' : 'Passport Photo'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please upload a clear, high-quality image or PDF of your document. 
                      Maximum file size is 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 sm:mt-4">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => e.target.files && e.target.files[0] && processFileUpload(e.target.files[0])}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MemberLayout>
  );
};

export default Profile;
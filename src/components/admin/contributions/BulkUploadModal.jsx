import React, { useState } from 'react';
import { Upload as UploadIcon, FileSpreadsheet as FileSpreadsheetIcon } from 'lucide-react';
import contributionService from '../../../services/contributionService';

const BulkUploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadType, setUploadType] = useState('monthly'); // 'monthly' or 'share-capital'

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadError(null);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Reset previous states
      setUploadProgress(0);
      setUploadError(null);

      // Choose upload method based on type
      const uploadMethod = uploadType === 'monthly'
        ? contributionService.bulkCreateMonthlyContributions
        : contributionService.bulkCreateShareCapitalPayments;

      // Perform upload
      const response = await uploadMethod(formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      // Success handling
      if (response.status === 'success') {
        // Trigger parent component refresh
        onUploadComplete();
        // Close modal
        onClose();
        // Optional: show success toast
        // toast.success(`Successfully uploaded ${response.contributions.length} contributions`);
      }
    } catch (error) {
      // Error handling
      setUploadError(error.message || 'Upload failed');
      // Optional: show error toast
      // toast.error('Failed to upload contributions');
    }
  };

  // Prevent rendering if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bulk Upload Contributions</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Upload Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribution Type
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setUploadType('monthly')}
              className={`px-4 py-2 rounded-md ${
                uploadType === 'monthly' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Monthly Contributions
            </button>
            <button
              onClick={() => setUploadType('share-capital')}
              className={`px-4 py-2 rounded-md ${
                uploadType === 'share-capital' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Share Capital
            </button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV File
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex-grow">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-indigo-500">
                <div className="flex justify-center mb-2">
                  <FileSpreadsheetIcon className="h-10 w-10 text-gray-400" />
                </div>
                {selectedFile ? (
                  <p className="text-sm text-gray-700">{selectedFile.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to select CSV file
                  </p>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Progress and Error Display */}
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {uploadError && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-2 rounded mb-4">
            {uploadError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <div className="flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>Upload</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
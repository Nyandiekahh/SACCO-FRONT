import React, { useState } from 'react';

const DocumentUploadForm = ({ onUpload, loading, documents }) => {
  const [selectedType, setSelectedType] = useState('ID_FRONT');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  
  const documentTypes = [
    { value: 'ID_FRONT', label: 'ID Card (Front)' },
    { value: 'ID_BACK', label: 'ID Card (Back)' },
    { value: 'PASSPORT', label: 'Passport Photo' },
    { value: 'OTHER', label: 'Other Document' }
  ];
  
  const getDocumentStatus = (type) => {
    if (!documents) return { uploaded: false, verified: false };
    
    switch (type) {
      case 'ID_FRONT':
        return documents.id_front || { uploaded: false, verified: false };
      case 'ID_BACK':
        return documents.id_back || { uploaded: false, verified: false };
      case 'PASSPORT':
        return documents.passport || { uploaded: false, verified: false };
      default:
        return { uploaded: false, verified: false };
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setErrors({});
    
    // Create preview for images
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!file) {
      newErrors.file = 'Please select a file to upload';
    } else {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        newErrors.file = 'File size should not exceed 5MB';
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        newErrors.file = 'Only JPG, PNG, and PDF files are allowed';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onUpload({
        document_type: selectedType,
        document: file
      });
    }
  };

  return (
    <div className="w-full max-w-lg">
      <form 
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Upload Verification Documents</h2>
        
        {/* Document Status Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Document Status:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentTypes.map(docType => {
              const status = getDocumentStatus(docType.value);
              return (
                <div key={docType.value} className="flex items-center">
                  <div className="mr-2">
                    {status.uploaded ? (
                      status.verified ? (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1 3a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={status.verified ? 'text-green-600' : status.uploaded ? 'text-yellow-600' : 'text-gray-600'}>
                    {docType.label}: {status.verified ? 'Verified' : status.uploaded ? 'Pending Verification' : 'Not Uploaded'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Document Type Selection */}
        <div className="mb-4">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="documentType"
          >
            Document Type
          </label>
          <select
            className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            id="documentType"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {documentTypes.map(docType => (
              <option key={docType.value} value={docType.value}>
                {docType.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* File Upload */}
        <div className="mb-6">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="document"
          >
            Upload Document
          </label>
          <input
            className={`shadow border ${
              errors.file ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
            id="document"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
          />
          {errors.file && (
            <p className="text-red-500 text-xs italic mt-1">{errors.file}</p>
          )}
          <p className="text-gray-600 text-xs mt-1">
            Supported formats: JPG, PNG, PDF. Maximum size: 5MB
          </p>
        </div>
        
        {/* Image Preview */}
        {preview && (
          <div className="mb-6">
            <p className="block text-gray-700 text-sm font-bold mb-2">Preview:</p>
            <div className="border border-gray-300 rounded p-2">
              <img 
                src={preview} 
                alt="Document preview" 
                className="max-h-48 mx-auto" 
              />
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <p className="text-blue-700">
          <strong>Important:</strong> You need to upload both the front and back of your ID card for verification. Your account will be verified once an administrator reviews your documents.
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
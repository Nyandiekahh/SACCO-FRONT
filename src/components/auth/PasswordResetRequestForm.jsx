import React, { useState } from 'react';

const PasswordResetRequestForm = ({ onSubmit, loading, disabled = false }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(email);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you an OTP to reset your password
        </p>
        
        <div className="mb-6">
          <label 
            className="block text-gray-700 text-sm font-bold mb-2" 
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="button"
            onClick={handleSubmit}
            disabled={loading || disabled}
          >
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PasswordResetRequest = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // This function would normally import authService, but for demo purposes:
  const handlePasswordResetRequest = async (email) => {
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate API call - replace with: await authService.requestPasswordReset(email);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      setMessage('If a user with this email exists, an OTP has been sent.');
      
      // In real app: navigate('/auth/verify-otp', { state: { email, fromPasswordReset: true } });
      
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SACCO System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Reset your password
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`rounded-md p-4 ${
            isSuccess 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex">
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  isSuccess ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isSuccess ? 'Success!' : 'Error'}
                </h3>
                <div className={`mt-2 text-sm ${
                  isSuccess ? 'text-green-700' : 'text-red-700'
                }`}>
                  <p>{message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <PasswordResetRequestForm 
          onSubmit={handlePasswordResetRequest}
          loading={loading}
          disabled={loading}
        />

        {/* Back to Login Link */}
        <div className="text-center">
          <button className="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
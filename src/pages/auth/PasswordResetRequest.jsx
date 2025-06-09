import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import authService from '../../services/authService'; // Add this import

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // REMOVE this line: const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // CHANGE this line from: const result = await requestPasswordReset(email);
      const result = await authService.requestPasswordReset(email);
      
      setSuccess(true);
      // Navigate to OTP verification after a short delay
      setTimeout(() => {
        navigate('/auth/verify-otp', { state: { email, forPasswordReset: true } });
      }, 2000);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Password reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Your Password</h1>
        <p className="text-center text-gray-600">
          Enter your email address and we'll send you an OTP to reset your password
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded w-full max-w-md" role="alert">
          <span className="block sm:inline">
            If an account with this email exists, we've sent an OTP to reset your password. Redirecting to verification page...
          </span>
        </div>
      )}
      
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6">
            <label 
              className="block text-gray-700 text-sm font-bold mb-2" 
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                loading || success ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading || success}
            >
              {loading ? 'Sending...' : 'Send Reset OTP'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default PasswordResetRequest;
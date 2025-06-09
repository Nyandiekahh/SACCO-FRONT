import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import VerifyOTPForm from '../../components/auth/VerifyOTPForm';
import authService from '../../services/authService'; // Add this import

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forPasswordReset, setForPasswordReset] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  // REMOVE this line: const { verifyOTP } = useAuth();

  useEffect(() => {
    // Get email from location state (passed from password reset request or other flow)
    if (location.state?.email) {
      setEmail(location.state.email);
      setForPasswordReset(location.state.forPasswordReset || false);
    } else {
      // If no email in state, redirect to password reset request
      navigate('/auth/password-reset-request');
    }
  }, [location, navigate]);

  const handleVerify = async (email, otp) => {
    setLoading(true);
    setError(null);
    
    try {
      // CHANGE this line from: const result = await verifyOTP(email, otp);
      const result = await authService.verifyOTP(email, otp);
      
      if (forPasswordReset) {
        // If for password reset, navigate to reset password page
        navigate('/auth/reset-password', { 
          state: { 
            email,
            reset_token: result.reset_token 
          } 
        });
      } else {
        // If for other purpose, handle accordingly (e.g. verification success page)
        navigate('/auth/verification-success');
      }
    } catch (err) {
      // Handle different error formats from your authService
      if (err.data && err.data.error) {
        setError(err.data.error);
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect to appropriate page
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {forPasswordReset ? 'Verify OTP for Password Reset' : 'Verify OTP'}
        </h1>
        <p className="text-center text-gray-600">
          Enter the 6-digit OTP code sent to your email
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <VerifyOTPForm 
        email={email} 
        onSubmit={handleVerify} 
        loading={loading} 
      />
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <Link 
            to={forPasswordReset ? "/auth/password-reset-request" : "/auth/login"} 
            className="text-blue-600 hover:text-blue-800"
          >
            {forPasswordReset ? "Request a new OTP" : "Back to Login"}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
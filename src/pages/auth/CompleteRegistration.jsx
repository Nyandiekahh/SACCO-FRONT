import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import RegistrationForm from '../../components/auth/RegistrationForm';
import { useAuth } from '../../context/AuthContext';

const CompleteRegistration = () => {
  const { completeRegistration } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get email from location state (passed from OTP login)
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect to OTP login
      navigate('/auth/otp-login');
    }
  }, [location, navigate]);

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await completeRegistration(userData);
      
      if (result.success) {
        // If registration succeeded, redirect to document upload
        navigate('/auth/document-upload');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect to OTP login
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Complete Your Registration</h1>
        <p className="text-center text-gray-600">
          Please provide your details to complete the registration process
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-2xl mx-auto" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <RegistrationForm 
        email={email} 
        onSubmit={handleRegister} 
        loading={loading} 
      />
    </AuthLayout>
  );
};

export default CompleteRegistration;
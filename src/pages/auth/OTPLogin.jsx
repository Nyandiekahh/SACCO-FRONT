import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const OTPLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { loginWithOTP } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!otp) newErrors.otp = 'OTP is required';
    else if (otp.length !== 6 || !/^\d+$/.test(otp)) newErrors.otp = 'OTP must be 6 digits';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginWithOTP(email, otp);
      
      if (result.success) {
        if (result.user_exists) {
          // If user exists, redirect to dashboard
          navigate('/member/dashboard');
        } else {
          // If user doesn't exist, redirect to complete registration
          navigate('/auth/complete-registration', { 
            state: { 
              email, 
              invitation_id: result.invitation_id 
            } 
          });
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('OTP login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Access Your Account</h1>
        <p className="text-center text-gray-600">
          Use the 6-digit OTP code sent to your email during invitation
        </p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full max-w-md" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login with OTP</h2>
          <p className="mb-6 text-center text-gray-600">
            Enter the email address and the 6-digit OTP code from your invitation.
          </p>

          <div className="mb-4">
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
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label 
              className="block text-gray-700 text-sm font-bold mb-2" 
              htmlFor="otp"
            >
              OTP Code
            </label>
            <input
              className={`shadow appearance-none border ${
                errors.otp ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500`}
              id="otp"
              type="text"
              placeholder="6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs italic mt-1">{errors.otp}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Login with OTP'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-blue-600 hover:text-blue-800"
              >
                Login with password
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Not invited yet? Contact your SACCO administrator.
        </p>
      </div>
    </AuthLayout>
  );
};

export default OTPLogin;
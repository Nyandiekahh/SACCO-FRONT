// pages/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  ArrowDownTrayIcon,
  ArrowPathIcon,
  UserIcon, 
  BuildingOfficeIcon,
  BanknotesIcon,
  CogIcon, 
  BellIcon, 
  EnvelopeIcon,
  PhoneIcon, 
  LockClosedIcon, 
  CheckIcon, 
  NoSymbolIcon,
  CheckBadgeIcon,
  DocumentIcon, 
  PencilIcon, 
  ViewListIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/solid';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Authentication token handling
const getAuthToken = () => {
  console.log('Available localStorage keys:', Object.keys(localStorage));
  return localStorage.getItem('access_token');
};

// Axios instance with auth headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Full Request URL:', `${config.baseURL}${config.url}`);
    console.log('Headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Component for the Settings page
const Settings = () => {
  const navigate = useNavigate();
  
  // State for tab management
  const [activeTab, setActiveTab] = useState(0);
  
  // State for loading and alerts
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // State for SACCO settings
  const [saccoSettings, setSaccoSettings] = useState({
    sacco_name: '',
    share_value: 0,
    minimum_monthly_contribution: 0,
    loan_interest_rate: 0,
    maximum_loan_multiplier: 0,
    loan_processing_fee_percentage: 0,
    loan_insurance_percentage: 0,
    maximum_loan_term_months: 0,
    minimum_guarantors: 0,
    minimum_membership_period_months: 0,
    dividend_calculation_method: 'BOTH',
    enable_sms_notifications: true,
    enable_email_notifications: true,
    phone_number: '',
    email: '',
    postal_address: '',
    physical_address: ''
  });
  
  // State for users list
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Dialog states
  const [passwordResetDialog, setPasswordResetDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState(false);
  const [documentVerifyDialog, setDocumentVerifyDialog] = useState(false);
  const [massEmailDialog, setMassEmailDialog] = useState(false);
  
  // Mass email state
  const [massEmail, setMassEmail] = useState({
    subject: '',
    message: '',
    type: 'general'
  });
  
  // Status reason state
  const [statusReason, setStatusReason] = useState('');
  
  // Selected document state
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // Component did mount - fetch initial data
  useEffect(() => {
    fetchSaccoSettings();
    if (activeTab === 1) {
      fetchUsers();
    }
  }, [activeTab]);
  
  // Handle tab change
  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  // Fetch SACCO settings
  const fetchSaccoSettings = async () => {
    setLoading(true);
    try {
      console.log('Full API URL:', `${API_BASE_URL}/api/settings/sacco/current/`);
      const response = await api.get('/api/settings/sacco/current/');
      console.log('Response:', response);
      setSaccoSettings(response.data);
    } catch (error) {
      console.error('Full Error:', error.response ? error.response : error);
      setAlert({
        open: true,
        message: 'Failed to load SACCO settings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch users list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/settings/admin/users/');
      setUsers(response.data);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to load users',
        severity: 'error'
      });
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle SACCO settings input change
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSaccoSettings({
      ...saccoSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Save SACCO settings
  const saveSaccoSettings = async () => {
    setLoading(true);
    try {
      await api.post('/api/settings/sacco/', saccoSettings);
      setAlert({
        open: true,
        message: 'SACCO settings updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update SACCO settings',
        severity: 'error'
      });
      console.error('Error updating SACCO settings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle mass email input change
  const handleMassEmailChange = (e) => {
    const { name, value } = e.target;
    setMassEmail({
      ...massEmail,
      [name]: value
    });
  };
  
  // Send mass email
  const sendMassEmail = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/admin/send-mass-email/', massEmail);
      setAlert({
        open: true,
        message: 'Mass email sent successfully',
        severity: 'success'
      });
      setMassEmailDialog(false);
      // Reset form
      setMassEmail({
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to send mass email',
        severity: 'error'
      });
      console.error('Error sending mass email:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Send password reset OTP to user
  const sendPasswordResetOTP = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await api.post(`/api/settings/admin/${selectedUser.id}/reset-password/`);
      setAlert({
        open: true,
        message: `Password reset OTP sent to ${selectedUser.email}`,
        severity: 'success'
      });
      setPasswordResetDialog(false);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to send password reset OTP',
        severity: 'error'
      });
      console.error('Error sending password reset OTP:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle user status
  const toggleUserStatus = async () => {
    if (!selectedUser) return;
    
    setLoading(true);
    try {
      await api.post(`/api/settings/admin/${selectedUser.id}/toggle-status/`, {
        reason: statusReason
      });
      
      // Update user in the list
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            is_on_hold: !user.is_on_hold,
            on_hold_reason: !user.is_on_hold ? statusReason : ''
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setAlert({
        open: true,
        message: `User status updated successfully`,
        severity: 'success'
      });
      setStatusDialog(false);
      setStatusReason('');
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update user status',
        severity: 'error'
      });
      console.error('Error updating user status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Verify user document
  const verifyDocument = async () => {
    if (!selectedUser || !selectedDocument) return;
    
    setLoading(true);
    try {
      await api.post(`/api/settings/admin/${selectedUser.id}/verify-document/${selectedDocument}/`);
      
      // Update users list with new verification status
      fetchUsers();
      
      setAlert({
        open: true,
        message: 'Document verified successfully',
        severity: 'success'
      });
      setDocumentVerifyDialog(false);
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to verify document',
        severity: 'error'
      });
      console.error('Error verifying document:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Close alert
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  
  // Open password reset dialog
  const handleOpenPasswordReset = (user) => {
    setSelectedUser(user);
    setPasswordResetDialog(true);
  };
  
  // Open status change dialog
  const handleOpenStatusDialog = (user) => {
    setSelectedUser(user);
    setStatusReason('');
    setStatusDialog(true);
  };
  
  // Open document verification dialog
  const handleOpenDocumentVerify = (user, documentType) => {
    setSelectedUser(user);
    setSelectedDocument(documentType);
    setDocumentVerifyDialog(true);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };
  
  // Render content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 0:
        return renderGeneralSettings();
      case 1:
        return renderUserManagement();
      case 2: 
        return renderLoanSettings();
      case 3:
        return renderNotificationSettings();
      case 4:
        return renderContactSettings();
      default:
        return renderGeneralSettings();
    }
  };
  
  // General settings tab content
  const renderGeneralSettings = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Basic SACCO Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SACCO Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="sacco_name"
              value={saccoSettings.sacco_name}
              onChange={handleSettingsChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share Value
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">KES</span>
              </div>
              <input
                className="w-full border border-gray-300 rounded-md pl-12 p-2 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="share_value"
                value={saccoSettings.share_value}
                onChange={handleSettingsChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Monthly Contribution
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">KES</span>
              </div>
              <input
                className="w-full border border-gray-300 rounded-md pl-12 p-2 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="minimum_monthly_contribution"
                value={saccoSettings.minimum_monthly_contribution}
                onChange={handleSettingsChange}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dividend Calculation Method
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              name="dividend_calculation_method"
              value={saccoSettings.dividend_calculation_method}
              onChange={handleSettingsChange}
            >
              <option value="SHARES">Based on Shares</option>
              <option value="DEPOSITS">Based on Deposits</option>
              <option value="BOTH">Based on Both</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Membership Period (months)
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                className="w-full border border-gray-300 rounded-md p-2 pr-12 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="minimum_membership_period_months"
                value={saccoSettings.minimum_membership_period_months}
                onChange={handleSettingsChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">months</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            className="flex items-center px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={fetchSaccoSettings}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={saveSaccoSettings}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    );
  };
  
  // User management tab content
  const renderUserManagement = () => {
    return (
      <div>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              User Management
            </h2>
            <div>
              <button 
                className="flex items-center px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={fetchUsers}
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button 
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => setMassEmailDialog(true)}
              >
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Send Mass Email
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      {loading ? (
                        <div className="flex justify-center">
                          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        'No users found'
                      )}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.membership_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_on_hold ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <NoSymbolIcon className="w-3 h-3 mr-1" />
                            On Hold
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.is_verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckBadgeIcon className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            className="text-gray-600 hover:text-gray-900"
                            title="Reset Password"
                            onClick={() => handleOpenPasswordReset(user)}
                          >
                            <LockClosedIcon className="w-5 h-5" />
                          </button>
                          
                          <button 
                            className={user.is_on_hold ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"}
                            title={user.is_on_hold ? "Activate User" : "Deactivate User"}
                            onClick={() => handleOpenStatusDialog(user)}
                          >
                            {user.is_on_hold ? <CheckIcon className="w-5 h-5" /> : <NoSymbolIcon className="w-5 h-5" />}
                          </button>
                          
                          {!user.is_verified && (
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              title="Verify Documents"
                              onClick={() => handleOpenDocumentVerify(user, user.verification_status?.id_front ? null : 'ID_FRONT')}
                            >
                              <CheckBadgeIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Loan settings tab content
  const renderLoanSettings = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Loan Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Interest Rate
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                className="w-full border border-gray-300 rounded-md p-2 pr-12 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="loan_interest_rate"
                value={saccoSettings.loan_interest_rate}
                onChange={handleSettingsChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Loan Multiplier
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              name="maximum_loan_multiplier"
              value={saccoSettings.maximum_loan_multiplier}
              onChange={handleSettingsChange}
            />
            <p className="mt-1 text-sm text-gray-500">Multiple of member's shares</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Processing Fee
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                className="w-full border border-gray-300 rounded-md p-2 pr-12 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="loan_processing_fee_percentage"
                value={saccoSettings.loan_processing_fee_percentage}
                onChange={handleSettingsChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Insurance Fee
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                className="w-full border border-gray-300 rounded-md p-2 pr-12 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="loan_insurance_percentage"
                value={saccoSettings.loan_insurance_percentage}
                onChange={handleSettingsChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Loan Term
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                className="w-full border border-gray-300 rounded-md p-2 pr-16 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="maximum_loan_term_months"
                value={saccoSettings.maximum_loan_term_months}
                onChange={handleSettingsChange}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">months</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Guarantors Required
            </label>
            <input
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              name="minimum_guarantors"
              value={saccoSettings.minimum_guarantors}
              onChange={handleSettingsChange}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            className="flex items-center px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={fetchSaccoSettings}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={saveSaccoSettings}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    );
  };
  // Notification settings tab content
  const renderNotificationSettings = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Notification Settings
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center">
            <input
              id="enable_email_notifications"
              name="enable_email_notifications"
              type="checkbox"
              checked={saccoSettings.enable_email_notifications}
              onChange={handleSettingsChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enable_email_notifications" className="ml-2 block text-sm text-gray-900">
              Enable Email Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="enable_sms_notifications"
              name="enable_sms_notifications"
              type="checkbox"
              checked={saccoSettings.enable_sms_notifications}
              onChange={handleSettingsChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enable_sms_notifications" className="ml-2 block text-sm text-gray-900">
              Enable SMS Notifications
            </label>
          </div>
          
          <div className="mt-4">
            <div className="border border-gray-200 rounded-md">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <h3 className="text-lg font-medium text-gray-900">Notification Templates</h3>
              </div>
              <div className="px-4 py-3">
                <p className="text-sm text-gray-600">
                  Notification templates can be customized by editing the HTML templates in the 
                  templates/emails directory of the project.
                </p>
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-900">Available Templates:</h4>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    <li>Password Reset</li>
                    <li>Loan Notification</li>
                    <li>Contribution Reminder</li>
                    <li>Invitation</li>
                    <li>Mass Email</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            className="flex items-center px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={fetchSaccoSettings}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={saveSaccoSettings}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    );
  };
  
  // Contact settings tab content
  const renderContactSettings = () => {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="phone_number"
                value={saccoSettings.phone_number}
                onChange={handleSettingsChange}
                className="w-full border border-gray-300 rounded-md pl-10 p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+254700000000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={saccoSettings.email}
                onChange={handleSettingsChange}
                className="w-full border border-gray-300 rounded-md pl-10 p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="info@sacco.com"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Address
            </label>
            <input
              type="text"
              name="postal_address"
              value={saccoSettings.postal_address}
              onChange={handleSettingsChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="P.O. Box 12345, Nairobi"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              name="physical_address"
              value={saccoSettings.physical_address}
              onChange={handleSettingsChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main Street, Nairobi"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            className="flex items-center px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={fetchSaccoSettings}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button 
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={saveSaccoSettings}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <AdminLayout>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <CogIcon className="w-6 h-6 mr-2" />
          SACCO Settings
        </h1>
        <p className="text-gray-600">
          Manage system-wide settings and configurations for your SACCO.
        </p>
      </div>
      
      <div className="bg-white shadow mb-6 rounded-lg overflow-hidden">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange(0)}
          >
            <div className="flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              General
            </div>
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange(1)}
          >
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              User Management
            </div>
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange(2)}
          >
            <div className="flex items-center">
              <BanknotesIcon className="w-5 h-5 mr-2" />
              Loan Settings
            </div>
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 3 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange(3)}
          >
            <div className="flex items-center">
              <BellIcon className="w-5 h-5 mr-2" />
              Notifications
            </div>
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 4 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTabChange(4)}
          >
            <div className="flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2" />
              Contact Information
            </div>
          </button>
        </div>
      </div>
      
      {renderTabContent()}
      
      {/* Password Reset Dialog */}
      {passwordResetDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Reset User Password</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                This will send a password reset OTP to {selectedUser?.email}. The user will be able to use this OTP to set a new password.
              </p>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setPasswordResetDialog(false)}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={sendPasswordResetOTP}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Send OTP'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* User Status Dialog */}
      {statusDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">
                {selectedUser?.is_on_hold ? 'Activate User' : 'Deactivate User'}
              </h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                {selectedUser?.is_on_hold 
                  ? `This will activate the account for ${selectedUser?.email}.` 
                  : `This will put the account for ${selectedUser?.email} on hold. They will not be able to login or perform transactions until the account is activated again.`
                }
              </p>
              
              {!selectedUser?.is_on_hold && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for deactivation
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setStatusDialog(false)}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  selectedUser?.is_on_hold 
                    ? loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700' 
                    : loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={toggleUserStatus}
                disabled={loading || (!selectedUser?.is_on_hold && !statusReason)}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (selectedUser?.is_on_hold ? 'Activate User' : 'Deactivate User')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Verification Dialog */}
      {documentVerifyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Verify User Document</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                This will mark the document as verified for {selectedUser?.email}.
                {!selectedUser?.verification_status?.id_front && ' ID Front needs verification.'}
                {!selectedUser?.verification_status?.id_back && ' ID Back needs verification.'}
                {!selectedUser?.verification_status?.passport && ' Passport photo needs verification.'}
              </p>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setDocumentVerifyDialog(false)}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={verifyDocument}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Verify Document'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mass Email Dialog */}
      {massEmailDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium">Send Mass Email to Members</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                This will send an email to all active members of the SACCO.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    name="type"
                    value={massEmail.type}
                    onChange={handleMassEmailChange}
                  >
                    <option value="general">General Announcement</option>
                    <option value="contribution_reminder">Contribution Reminder</option>
                    <option value="dividend_announcement">Dividend Announcement</option>
                    <option value="meeting_notice">Meeting Notice</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    name="subject"
                    value={massEmail.subject}
                    onChange={handleMassEmailChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Message
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    name="message"
                    value={massEmail.message}
                    onChange={handleMassEmailChange}
                    rows={8}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setMassEmailDialog(false)}
              >
                Cancel
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={sendMassEmail}
                disabled={loading || !massEmail.subject || !massEmail.message}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alert Toast */}
      {alert.open && (
        <div className={`fixed bottom-4 right-4 z-50 rounded-md p-4 ${
          alert.severity === 'success' ? 'bg-green-50 border border-green-200' : 
          alert.severity === 'error' ? 'bg-red-50 border border-red-200' : 
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {alert.severity === 'success' && (
                <CheckIcon className="h-5 w-5 text-green-400" />
              )}
              {alert.severity === 'error' && (
                <NoSymbolIcon className="h-5 w-5 text-red-400" />
              )}
              {alert.severity === 'info' && (
                <BellIcon className="h-5 w-5 text-blue-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                alert.severity === 'success' ? 'text-green-800' : 
                alert.severity === 'error' ? 'text-red-800' : 
                'text-blue-800'
              }`}>
                {alert.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={handleCloseAlert}
                className={`inline-flex rounded-md p-1.5 ${
                  alert.severity === 'success' ? 'bg-green-50 text-green-500 hover:bg-green-100' : 
                  alert.severity === 'error' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 
                  'bg-blue-50 text-blue-500 hover:bg-blue-100'
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default Settings;
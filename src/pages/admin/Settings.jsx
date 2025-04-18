import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PencilIcon, 
  DocumentIcon, 
  CogIcon, 
  CurrencyDollarIcon, 
  BanknotesIcon,
  UserGroupIcon, 
  ChartPieIcon, 
  BellIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';
import AdminLayout from '../../layouts/AdminLayout';
import { toast } from 'react-toastify';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility to format currency
const formatCurrency = (value) => 
  new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES' 
  }).format(value || 0);

// Settings Section Component
const SettingsSection = ({ 
  title, 
  icon: Icon, 
  children, 
  onEdit, 
  lastUpdated 
}) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {onEdit && (
        <button 
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      )}
    </div>
    {children}
    {lastUpdated && (
      <div className="text-sm text-gray-500 mt-4">
        Last updated: {new Date(lastUpdated).toLocaleString()}
      </div>
    )}
  </div>
);

// Settings Detail Row
const SettingDetailRow = ({ label, value, helpText }) => (
  <div className="py-3 border-b border-gray-200 last:border-b-0">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {helpText && (
          <p className="text-xs text-gray-500 mt-1">{helpText}</p>
        )}
      </div>
      <span className="text-sm text-gray-900 font-semibold">
        {value}
      </span>
    </div>
  </div>
);

// Input field component for modal
const ModalInputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  helpText,
  min,
  step,
  checked,
  options
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {helpText && <span className="block text-xs text-gray-500 mt-1">{helpText}</span>}
    </label>
    {type === 'checkbox' ? (
      <label className="flex items-center">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="form-checkbox h-4 w-4 text-blue-600 rounded"
        />
        <span className="ml-2 text-sm text-gray-900">Enable</span>
      </label>
    ) : type === 'select' ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(
          type === 'number' ? parseFloat(e.target.value) : e.target.value
        )}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        min={min}
        step={step}
      />
    )}
  </div>
);

const SettingsPage = () => {
  // State for SACCO settings
  const [saccoSettings, setSaccoSettings] = useState({
    share_value: 0,
    minimum_monthly_contribution: 0,
    loan_interest_rate: 0,
    maximum_loan_multiplier: 0,
    loan_processing_fee_percentage: 0,
    loan_insurance_percentage: 0,
    maximum_loan_term_months: 0,
    minimum_guarantors: 0,
    minimum_membership_period_months: 0,
    dividend_calculation_method: '',
    enable_sms_notifications: false,
    enable_email_notifications: false,
    sacco_name: '',
    phone_number: '',
    email: '',
    postal_address: '',
    physical_address: '',
    updated_at: null,
    dividend_calculation_methods: []
  });

  // State for modals and editing
  const [editModal, setEditModal] = useState({
    open: false,
    section: null,
    data: {}
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fetch SACCO settings
  // In your React component or api service
// In your Settings component
const fetchSaccoSettings = async () => {
  try {
    setIsLoading(true);
    
    // Fetch current settings directly using axios
    const response = await axios.get('/api/settings/sacco/current/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    setSaccoSettings(prev => ({
      ...prev,
      ...response.data,
      dividend_calculation_methods: response.data.dividend_calculation_methods || [],
      updated_at: response.data.updated_at
    }));
  } catch (err) {
    // More specific error handling
    if (err.response && err.response.status === 401) {
      toast.error('Session expired. Please log in again.');
      // Implement your login redirect logic
    } else {
      toast.error('Failed to fetch SACCO settings');
    }
    console.error('Settings fetch error:', err);
  } finally {
    setIsLoading(false);
  }
};

const saveSettings = async () => {
  try {
    const sectionMap = {
      share_capital: ['share_value', 'minimum_monthly_contribution'],
      loan_settings: [
        'loan_interest_rate', 
        'maximum_loan_multiplier', 
        'loan_processing_fee_percentage', 
        'loan_insurance_percentage', 
        'maximum_loan_term_months', 
        'minimum_guarantors'
      ],
      member_settings: ['minimum_membership_period_months'],
      dividend_settings: ['dividend_calculation_method'],
      notification_settings: [
        'enable_sms_notifications', 
        'enable_email_notifications'
      ],
      contact_info: [
        'sacco_name', 
        'phone_number', 
        'email', 
        'postal_address', 
        'physical_address'
      ]
    };

    // Prepare payload with only the relevant fields for the current section
    const payload = sectionMap[editModal.section].reduce((acc, key) => {
      acc[key] = editModal.data[key];
      return acc;
    }, {});

    // Send update to backend
    const response = await axios.patch('/api/settings/sacco/', payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    // Update local state
    setSaccoSettings(prev => ({
      ...prev,
      ...payload,
      updated_at: new Date().toISOString()
    }));

    // Close modal and show success
    setEditModal({ open: false, section: null, data: {} });
    toast.success('Settings updated successfully');
  } catch (err) {
    // More specific error handling
    if (err.response && err.response.status === 401) {
      toast.error('Session expired. Please log in again.');
      // Implement your login redirect logic
    } else {
      toast.error('Failed to update settings');
    }
    console.error('Settings update error:', err);
  }
};

  // Initial data fetch
  useEffect(() => {
    fetchSaccoSettings();
  }, []);

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  // Render different setting sections
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center text-gray-800">
            <CogIcon className="h-8 w-8 mr-3 text-blue-600" />
            SACCO Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and configure your SACCO's global settings
          </p>
        </div>

        {/* Share Capital Settings */}
        <SettingsSection 
          title="Share Capital Settings" 
          icon={CurrencyDollarIcon}
          lastUpdated={saccoSettings.updated_at}
          onEdit={() => setEditModal({
            open: true,
            section: 'share_capital',
            data: {
              share_value: saccoSettings.share_value,
              minimum_monthly_contribution: saccoSettings.minimum_monthly_contribution
            }
          })}
        >
          <SettingDetailRow 
            label="Share Value" 
            value={formatCurrency(saccoSettings.share_value)}
            helpText="Value of a single share"
          />
          <SettingDetailRow 
            label="Minimum Monthly Contribution" 
            value={formatCurrency(saccoSettings.minimum_monthly_contribution)}
            helpText="Minimum required monthly contribution"
          />
        </SettingsSection>

        {/* Loan Settings */}
        <SettingsSection 
          title="Loan Settings" 
          icon={BanknotesIcon}
          lastUpdated={saccoSettings.updated_at}
          onEdit={() => setEditModal({
            open: true,
            section: 'loan_settings',
            data: {
              loan_interest_rate: saccoSettings.loan_interest_rate,
              maximum_loan_multiplier: saccoSettings.maximum_loan_multiplier,
              loan_processing_fee_percentage: saccoSettings.loan_processing_fee_percentage,
              loan_insurance_percentage: saccoSettings.loan_insurance_percentage,
              maximum_loan_term_months: saccoSettings.maximum_loan_term_months,
              minimum_guarantors: saccoSettings.minimum_guarantors
            }
          })}
        >
          <SettingDetailRow 
            label="Loan Interest Rate" 
            value={`${saccoSettings.loan_interest_rate}%`}
            helpText="Annual interest rate for loans"
          />
          <SettingDetailRow 
            label="Maximum Loan Multiplier" 
            value={`${saccoSettings.maximum_loan_multiplier}x`}
            helpText="Maximum loan amount as a multiple of shares"
          />
          <SettingDetailRow 
            label="Loan Processing Fee" 
            value={`${saccoSettings.loan_processing_fee_percentage}%`}
            helpText="Loan processing fee percentage"
          />
          <SettingDetailRow 
            label="Loan Insurance Fee" 
            value={`${saccoSettings.loan_insurance_percentage}%`}
            helpText="Loan insurance fee percentage"
          />
          <SettingDetailRow 
            label="Maximum Loan Term" 
            value={`${saccoSettings.maximum_loan_term_months} months`}
            helpText="Maximum loan repayment period"
          />
          <SettingDetailRow 
            label="Minimum Guarantors" 
            value={saccoSettings.minimum_guarantors}
            helpText="Minimum number of guarantors required"
          />
        </SettingsSection>

        {/* Member Settings */}
        <SettingsSection 
          title="Member Settings" 
          icon={UserGroupIcon}
          lastUpdated={saccoSettings.updated_at}
          onEdit={() => setEditModal({
            open: true,
            section: 'member_settings',
            data: {
              minimum_membership_period_months: saccoSettings.minimum_membership_period_months
            }
          })}
        >
          <SettingDetailRow 
            label="Minimum Membership Period" 
            value={`${saccoSettings.minimum_membership_period_months} months`}
            helpText="Minimum period of membership before loan eligibility"
          />
        </SettingsSection>

        {/* Dividend Settings */}
        <SettingsSection 
          title="Dividend Settings" 
          icon={ChartPieIcon}
          lastUpdated={saccoSettings.updated_at}
          onEdit={() => setEditModal({
            open: true,
            section: 'dividend_settings',
            data: {
              dividend_calculation_method: saccoSettings.dividend_calculation_method
            }
          })}
        >
          <SettingDetailRow 
            label="Dividend Calculation Method" 
            value={saccoSettings.dividend_calculation_method}
            helpText="Method for calculating dividends"
          />
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection 
          title="Notification Settings" 
          icon={BellIcon}
          lastUpdated={saccoSettings.updated_at}
          onEdit={() => setEditModal({
            open: true,
            section: 'notification_settings',
            data: {
              enable_sms_notifications: saccoSettings.enable_sms_notifications,
              enable_email_notifications: saccoSettings.enable_email_notifications
            }
          })}
        >
          <SettingDetailRow 
            label="SMS Notifications" 
            value={saccoSettings.enable_sms_notifications ? 'Enabled' : 'Disabled'}
            helpText="Enable SMS notifications for transactions"
          />
          <SettingDetailRow 
            label="Email Notifications" 
            value={saccoSettings.enable_email_notifications ? 'Enabled' : 'Disabled'}
            helpText="Enable email notifications for transactions"
          />
        </SettingsSection>

        {/* Contact Information */}
        <SettingsSection 
          title="Contact Information" 
          icon={PhoneIcon}
          lastUpdated={saccoSettings.updated_at}
          onEdit={() => setEditModal({
            open: true,
            section: 'contact_info',
            data: {
              sacco_name: saccoSettings.sacco_name,
              phone_number: saccoSettings.phone_number,
              email: saccoSettings.email,
              postal_address: saccoSettings.postal_address,
              physical_address: saccoSettings.physical_address
            }
          })}
        >
          <SettingDetailRow 
            label="SACCO Name" 
            value={saccoSettings.sacco_name}
            helpText="Official SACCO name"
          />
          <SettingDetailRow 
            label="Phone Number" 
            value={saccoSettings.phone_number}
            helpText="SACCO contact phone number"
          />
          <SettingDetailRow 
            label="Email" 
            value={saccoSettings.email}
            helpText="SACCO contact email"
          />
          <SettingDetailRow 
            label="Postal Address" 
            value={saccoSettings.postal_address}
            helpText="SACCO postal address"
          />
          <SettingDetailRow 
            label="Physical Address" 
            value={saccoSettings.physical_address}
            helpText="SACCO physical address"
          />
        </SettingsSection>

        {/* Edit Modal */}
        {editModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Edit {editModal.section.replace('_', ' ').toUpperCase()}
              </h2>
              
              {/* Dynamically render input fields based on section */}
              {editModal.section === 'share_capital' && (
                <>
                  <ModalInputField 
                    label="Share Value" 
                    type="number"
                    value={editModal.data.share_value}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, share_value: value }
                    }))}
                    helpText="Value of a single share"
                    min={0}
                    step={0.01}
                  />
                  <ModalInputField 
                    label="Minimum Monthly Contribution" 
                    type="number"
                    value={editModal.data.minimum_monthly_contribution}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, minimum_monthly_contribution: value }
                    }))}
                    helpText="Minimum required monthly contribution"
                    min={0}
                    step={0.01}
                  />
                </>
              )}

              {editModal.section === 'loan_settings' && (
                <>
                  <ModalInputField 
                    label="Loan Interest Rate" 
                    type="number"
                    value={editModal.data.loan_interest_rate}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, loan_interest_rate: value }
                    }))}
                    helpText="Annual interest rate for loans"
                    min={0}
                    step={0.01}
                  />
                  <ModalInputField 
                    label="Maximum Loan Multiplier" 
                    type="number"
                    value={editModal.data.maximum_loan_multiplier}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, maximum_loan_multiplier: value }
                    }))}
                    helpText="Maximum loan amount as a multiple of shares"
                    min={0}
                    step={0.1}
                  />
                  <ModalInputField 
                    label="Loan Processing Fee" 
                    type="number"
                    value={editModal.data.loan_processing_fee_percentage}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, loan_processing_fee_percentage: value }
                    }))}
                    helpText="Loan processing fee percentage"
                    min={0}
                    step={0.01}
                  />
                  <ModalInputField 
                    label="Loan Insurance Fee" 
                    type="number"
                    value={editModal.data.loan_insurance_percentage}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, loan_insurance_percentage: value }
                    }))}
                    helpText="Loan insurance fee percentage"
                    min={0}
                    step={0.01}
                  />
                  <ModalInputField 
                    label="Maximum Loan Term (Months)" 
                    type="number"
                    value={editModal.data.maximum_loan_term_months}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, maximum_loan_term_months: value }
                    }))}
                    helpText="Maximum loan repayment period"
                    min={0}
                  />
                  <ModalInputField 
                    label="Minimum Guarantors" 
                    type="number"
                    value={editModal.data.minimum_guarantors}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, minimum_guarantors: value }
                    }))}
                    helpText="Minimum number of guarantors required"
                    min={0}
                  />
                </>
              )}

              {editModal.section === 'member_settings' && (
                <ModalInputField 
                  label="Minimum Membership Period (Months)" 
                  type="number"
                  value={editModal.data.minimum_membership_period_months}
                  onChange={(value) => setEditModal(prev => ({
                    ...prev,
                    data: { ...prev.data, minimum_membership_period_months: value }
                  }))}
                  helpText="Minimum period of membership before loan eligibility"
                  min={0}
                />
              )}

{editModal.section === 'dividend_settings' && (
  <ModalInputField 
    label="Dividend Calculation Method" 
    type="select"
    value={editModal.data.dividend_calculation_method}
    onChange={(value) => setEditModal(prev => ({
      ...prev,
      data: { ...prev.data, dividend_calculation_method: value }
    }))}
    helpText="Method for calculating dividends"
    options={saccoSettings.dividend_calculation_methods}
  />
)}

              {editModal.section === 'notification_settings' && (
                <>
                  <ModalInputField 
                    label="SMS Notifications" 
                    type="checkbox"
                    checked={editModal.data.enable_sms_notifications}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, enable_sms_notifications: value }
                    }))}
                    helpText="Enable SMS notifications for transactions"
                  />
                  <ModalInputField 
                    label="Email Notifications" 
                    type="checkbox"
                    checked={editModal.data.enable_email_notifications}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, enable_email_notifications: value }
                    }))}
                    helpText="Enable email notifications for transactions"
                  />
                </>
              )}

              {editModal.section === 'contact_info' && (
                <>
                  <ModalInputField 
                    label="SACCO Name" 
                    type="text"
                    value={editModal.data.sacco_name}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, sacco_name: value }
                    }))}
                    helpText="Official SACCO name"
                  />
                  <ModalInputField 
                    label="Phone Number" 
                    type="text"
                    value={editModal.data.phone_number}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, phone_number: value }
                    }))}
                    helpText="SACCO contact phone number"
                  />
                  <ModalInputField 
                    label="Email" 
                    type="email"
                    value={editModal.data.email}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, email: value }
                    }))}
                    helpText="SACCO contact email"
                  />
                  <ModalInputField 
                    label="Postal Address" 
                    type="text"
                    value={editModal.data.postal_address}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, postal_address: value }
                    }))}
                    helpText="SACCO postal address"
                  />
                  <ModalInputField 
                    label="Physical Address" 
                    type="text"
                    value={editModal.data.physical_address}
                    onChange={(value) => setEditModal(prev => ({
                      ...prev,
                      data: { ...prev.data, physical_address: value }
                    }))}
                    helpText="SACCO physical address"
                  />
                </>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setEditModal({ open: false, section: null, data: {} })}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
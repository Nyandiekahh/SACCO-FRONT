import React, { useState, useEffect } from 'react';
import contributionService from '../../../services/contributionService';
import memberService from '../../../services/memberService';

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];

const ContributionModal = ({ 
  isOpen, 
  onClose, 
  onContributionAdded 
}) => {
  const [contributionType, setContributionType] = useState('monthly');
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [formData, setFormData] = useState({
    member: '',
    amount: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    transaction_date: new Date().toISOString().split('T')[0],
    reference_number: '',
    transaction_code: '',
    transaction_message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch members when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        setLoadingMembers(true);
        setError('');
        try {
          const response = await memberService.getMembers();
          console.log('Members API response:', response); // Debug log
          
          // Check what structure the response has
          if (Array.isArray(response)) {
            setMembers(response);
          } else if (response && Array.isArray(response.data)) {
            setMembers(response.data);
          } else if (response && response.results && Array.isArray(response.results)) {
            setMembers(response.results);
          } else {
            console.error('Unexpected members response format:', response);
            setError('Could not parse member list. Please check console.');
            setMembers([]);
          }
        } catch (err) {
          console.error('Failed to fetch members:', err);
          setError('Failed to load member list: ' + (err.message || 'Unknown error'));
          setMembers([]);
        } finally {
          setLoadingMembers(false);
        }
      };
      
      fetchMembers();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.member) errors.member = 'Member is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = 'Valid amount is required';
    if (!formData.transaction_date) errors.transaction_date = 'Transaction date is required';
    
    // Validate based on contribution type
    if (contributionType === 'monthly') {
      if (!formData.year) errors.year = 'Year is required';
      if (!formData.month) errors.month = 'Month is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create a copy of the form data with properly formatted values
      const contributionData = {
        ...formData,
        // Ensure numeric fields are properly formatted
        amount: parseFloat(formData.amount),
        year: parseInt(formData.year),
        month: parseInt(formData.month)
      };
      
      console.log('Submitting contribution data:', contributionData); // Debug log
      
      const submitMethod = contributionType === 'monthly' 
        ? contributionService.createMonthlyContribution
        : contributionService.createShareCapitalPayment;

      const response = await submitMethod(contributionData);
      console.log('Contribution submission response:', response); // Debug log
      
      onContributionAdded?.();
      onClose();
    } catch (err) {
      console.error('Failed to add contribution:', err);
      
      // Check for specific error response format
      if (err.response && err.response.data) {
        // Handle validation errors from backend
        if (typeof err.response.data === 'object') {
          setValidationErrors(err.response.data);
          setError('Please correct the errors and try again.');
        } else {
          setError(err.response.data || 'Failed to add contribution. Please try again.');
        }
      } else {
        setError(err.message || 'Failed to add contribution. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Record Contribution</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {/* Contribution Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contribution Type
            </label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
              disabled={loading}
            >
              <option value="monthly">Monthly Contribution</option>
              <option value="share-capital">Share Capital</option>
            </select>
          </div>

          {/* Member */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Member
            </label>
            {loadingMembers ? (
              <div className="mt-1 text-sm text-gray-500">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="mt-1 text-sm text-red-500">No members found. Please add members first.</div>
            ) : (
              <select
                name="member"
                value={formData.member}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md ${
                  validationErrors.member ? 'border-red-500' : 'border-gray-300'
                }`}
                required
                disabled={loading}
              >
                <option value="">Select Member</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email || member.membership_number || 'Unnamed Member'}
                  </option>
                ))}
              </select>
            )}
            {validationErrors.member && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.member}</p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              {members.length > 0 ? `${members.length} members available` : ''}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md ${
                validationErrors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={loading}
              step="0.01"
              min="0"
            />
            {validationErrors.amount && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.amount}</p>
            )}
          </div>

          {/* Conditional Month for Monthly Contributions */}
          {contributionType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md ${
                  validationErrors.month ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              {validationErrors.month && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.month}</p>
              )}
            </div>
          )}

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md ${
                validationErrors.year ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={loading}
              min="2000"
              max="2100"
            />
            {validationErrors.year && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.year}</p>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Date
            </label>
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md ${
                validationErrors.transaction_date ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              disabled={loading}
            />
            {validationErrors.transaction_date && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.transaction_date}</p>
            )}
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reference Number
            </label>
            <input
              type="text"
              name="reference_number"
              value={formData.reference_number}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md ${
                validationErrors.reference_number ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {validationErrors.reference_number && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.reference_number}</p>
            )}
          </div>

          {/* Transaction Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Code
            </label>
            <input
              type="text"
              name="transaction_code"
              value={formData.transaction_code}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md ${
                validationErrors.transaction_code ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {validationErrors.transaction_code && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.transaction_code}</p>
            )}
          </div>

          {/* Transaction Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction Message (Optional)
            </label>
            <textarea
              name="transaction_message"
              value={formData.transaction_message}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md ${
                validationErrors.transaction_message ? 'border-red-500' : 'border-gray-300'
              }`}
              rows="2"
              disabled={loading}
            />
            {validationErrors.transaction_message && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.transaction_message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading || loadingMembers || members.length === 0}
            >
              {loading ? 'Saving...' : 'Save Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;
import React, { useState } from 'react';
import contributionService from '../../../services/contributionService';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitMethod = contributionType === 'monthly' 
        ? contributionService.createMonthlyContribution
        : contributionService.createShareCapitalPayment;

      await submitMethod(formData);
      onContributionAdded?.();
      onClose();
    } catch (error) {
      console.error('Failed to add contribution:', error);
      alert('Failed to add contribution. Please try again.');
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
          {/* Contribution Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contribution Type
            </label>
            <select
              value={contributionType}
              onChange={(e) => setContributionType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
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
            <input
              type="text"
              name="member"
              value={formData.member}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
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
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
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
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Contribution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionModal;
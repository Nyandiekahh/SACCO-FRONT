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

const ContributionReminderModal = ({ 
  isOpen, 
  onClose 
}) => {
  const [reminderData, setReminderData] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReminderData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitReminder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await contributionService.sendContributionReminders(reminderData);
      
      alert(`Reminders sent successfully. ${response.successful_count} members notified.`);
      onClose();
    } catch (error) {
      console.error('Failed to send contribution reminders:', error);
      alert('Failed to send reminders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetMessage = (type) => {
    const month = monthOptions.find(m => m.value === reminderData.month).label;
    const templates = {
      standard: `Dear Member,\n\nThis is a gentle reminder that your monthly contribution for ${month} ${reminderData.year} is due. Kindly make your contribution as soon as possible.\n\nThank you for your continued support.`,
      urgent: `URGENT: Overdue Contribution\n\nDear Member,\n\nOur records show that you have not yet made your monthly contribution for ${month} ${reminderData.year}. Please settle your contribution immediately to avoid any penalties.\n\nRegards,\nSACCO Management`
    };

    setReminderData(prev => ({ ...prev, message: templates[type] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Send Contribution Reminders</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmitReminder} className="p-4 space-y-4">
          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={reminderData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              name="month"
              value={reminderData.month}
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

          {/* Reminder Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reminder Message
            </label>
            <textarea
              name="message"
              value={reminderData.message}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300"
              rows={6}
              required
            />
          </div>

          {/* Preset Message Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handlePresetMessage('standard')}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-sm"
            >
              Standard Reminder
            </button>
            <button
              type="button"
              onClick={() => handlePresetMessage('urgent')}
              className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md text-sm"
            >
              Urgent Reminder
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reminders'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContributionReminderModal;
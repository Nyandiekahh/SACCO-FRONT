import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
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

const MissingContributionsModal = ({ 
  isOpen, 
  onClose 
}) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [missingContributions, setMissingContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch missing contributions
  const fetchMissingContributions = async () => {
    setIsLoading(true);
    try {
      const response = await contributionService.getMissingContributions(year, month);
      setMissingContributions(response.missing_members || []);
    } catch (error) {
      console.error('Failed to fetch missing contributions:', error);
      alert('Failed to fetch missing contributions');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when year or month changes
  useEffect(() => {
    if (isOpen) {
      fetchMissingContributions();
    }
  }, [year, month, isOpen]);

  // Prepare bulk reminder message
  const handleSendBulkReminders = async () => {
    try {
      const reminderData = {
        year,
        month,
        message: `Reminder: Your monthly contribution for ${
          monthOptions.find(m => m.value === month).label
        } ${year} is overdue. Please make your contribution as soon as possible.`
      };

      const response = await contributionService.sendContributionReminders(reminderData);
      
      alert(`Reminders sent successfully to ${response.successful_count} members.`);
    } catch (error) {
      console.error('Failed to send bulk reminders:', error);
      alert('Failed to send bulk reminders');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Missing Contributions</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          {/* Filters */}
          <div className="flex space-x-4 mb-4">
            {/* Year */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                {[2023, 2024, 2025].map(yr => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                {monthOptions.map(monthOption => (
                  <option 
                    key={monthOption.value} 
                    value={monthOption.value}
                  >
                    {monthOption.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Reminder Button */}
            <div className="self-end">
              <button
                onClick={handleSendBulkReminders}
                disabled={missingContributions.length === 0}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
              >
                <Mail className="mr-2 h-5 w-5" />
                Send Bulk Reminders
              </button>
            </div>
          </div>

          {/* Missing Contributions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Membership Number</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Full Name</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-600">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {missingContributions.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{member.membership_number}</td>
                    <td className="p-3">{member.full_name}</td>
                    <td className="p-3">{member.email}</td>
                    <td className="p-3">{member.phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Members Found */}
          {missingContributions.length === 0 && !isLoading && (
            <div className="text-center py-4 text-gray-500">
              No members missing contributions for the selected month.
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">
              Loading missing contributions...
            </div>
          )}

          {/* Summary */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total Active Members: {missingContributions.length} missing contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingContributionsModal;
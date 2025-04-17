// components/admin/loans/DuePayments.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Calendar, 
  RefreshCw, 
  Bell, 
  ChevronDown,
  ChevronUp,
  User,
  Phone
} from 'lucide-react';
import { loanService } from '../../../services';

const DuePayments = () => {
  const [duePayments, setDuePayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderType, setReminderType] = useState('all');
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminders, setSendingReminders] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    fetchDuePayments();
  }, []);

  const fetchDuePayments = async () => {
    try {
      setLoading(true);
      const response = await loanService.getDuePayments();
      setDuePayments(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching due payments:', err);
      setError('Failed to load due payments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (loanId) => {
    setExpandedItems(prev => ({
      ...prev,
      [loanId]: !prev[loanId]
    }));
  };

  const handleSendReminders = async (e) => {
    e.preventDefault();
    try {
      setSendingReminders(true);
      const response = await loanService.sendPaymentReminders({
        type: reminderType,
        message: reminderMessage
      });
      
      // Show success message
      alert(`Reminders sent successfully: ${response.sent_count} sent, ${response.failed_count} failed`);
      
      setShowReminderModal(false);
      setReminderType('all');
      setReminderMessage('');
      
      // Refresh the list
      fetchDuePayments();
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Failed to send reminders. Please try again.');
    } finally {
      setSendingReminders(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!duePayments.length) {
    return (
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No payments due</h3>
        <p className="mt-1 text-sm text-gray-500">
          There are no upcoming or overdue loan payments at this time.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Upcoming & Overdue Payments</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchDuePayments}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
          <button
            onClick={() => setShowReminderModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Bell className="h-4 w-4 mr-1" />
            Send Reminders
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {duePayments.map((item) => (
          <div key={item.loan_id} className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-medium">{item.member.full_name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{item.member.full_name}</div>
                    <div className="text-xs text-gray-500">{item.member.membership_number}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Link 
                    to={`/admin/loans/${item.loan_id}`}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-3"
                  >
                    View Loan
                  </Link>
                  <button
                    onClick={() => toggleExpand(item.loan_id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {expandedItems[item.loan_id] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs font-medium text-gray-500">LOAN AMOUNT</div>
                  <div className="text-sm font-medium">
                    KES {parseFloat(item.amount).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500">REMAINING BALANCE</div>
                  <div className="text-sm font-medium">
                    KES {parseFloat(item.remaining_balance).toLocaleString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-500">DISBURSEMENT DATE</div>
                  <div className="text-sm font-medium">
                    {new Date(item.disbursement_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              {expandedItems[item.loan_id] && (
                <div className="mt-4">
                  <div className="mb-3">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-500">Member Details</span>
                    </div>
                    <div className="ml-5 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="text-sm">
                        <Phone className="h-3 w-3 text-gray-400 inline mr-1" />
                        {item.member.phone_number || 'No phone number'}
                      </div>
                      <div className="text-sm">{item.member.email || 'No email'}</div>
                    </div>
                  </div>
                  
                  {item.overdue_payments.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-red-600 mb-2">Overdue Payments:</div>
                      <div className="bg-red-50 rounded-md overflow-hidden">
                        <div className="min-w-full divide-y divide-red-200">
                          <div className="bg-red-100 text-xs">
                            <div className="grid grid-cols-4 text-left px-2 py-1">
                              <div className="font-medium text-red-900">Installment</div>
                              <div className="font-medium text-red-900">Due Date</div>
                              <div className="font-medium text-red-900">Amount</div>
                              <div className="font-medium text-red-900">Overdue</div>
                            </div>
                          </div>
                          <div className="divide-y divide-red-200 bg-white">
                            {item.overdue_payments.map((payment, idx) => (
                              <div key={idx} className="grid grid-cols-4 text-sm text-red-800 px-2 py-1">
                                <div>#{payment.installment_number}</div>
                                <div>{new Date(payment.due_date).toLocaleDateString()}</div>
                                <div>KES {parseFloat(payment.remaining_amount).toLocaleString()}</div>
                                <div className="font-medium">{payment.days_overdue} days</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {item.upcoming_payments.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-yellow-600 mb-2">Upcoming Payments:</div>
                      <div className="bg-yellow-50 rounded-md overflow-hidden">
                        <div className="min-w-full divide-y divide-yellow-200">
                          <div className="bg-yellow-100 text-xs">
                            <div className="grid grid-cols-3 text-left px-2 py-1">
                              <div className="font-medium text-yellow-900">Installment</div>
                              <div className="font-medium text-yellow-900">Due Date</div>
                              <div className="font-medium text-yellow-900">Amount</div>
                            </div>
                          </div>
                          <div className="divide-y divide-yellow-200 bg-white">
                            {item.upcoming_payments.map((payment, idx) => (
                              <div key={idx} className="grid grid-cols-3 text-sm text-yellow-800 px-2 py-1">
                                <div>#{payment.installment_number}</div>
                                <div>{new Date(payment.due_date).toLocaleDateString()}</div>
                                <div>KES {parseFloat(payment.remaining_amount).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Send Reminders Modal */}
      {showReminderModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Send Payment Reminders
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Send payment reminders to members with upcoming or overdue loan payments.
                      </p>
                      
                      <form onSubmit={handleSendReminders} className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Reminder Type
                          </label>
                          <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={reminderType}
                            onChange={(e) => setReminderType(e.target.value)}
                          >
                            <option value="all">All Payments (Upcoming & Overdue)</option>
                            <option value="overdue">Overdue Payments Only</option>
                            <option value="upcoming">Upcoming Payments Only</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="reminder-message" className="block text-sm font-medium text-gray-700">
                            Custom Message (Optional)
                          </label>
                          <textarea
                            id="reminder-message"
                            name="reminder-message"
                            rows={3}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Leave blank to use default reminder message"
                            value={reminderMessage}
                            onChange={(e) => setReminderMessage(e.target.value)}
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            If left blank, a default message will be sent with payment details.
                          </p>
                        </div>
                        
                        <div className="sm:flex sm:flex-row-reverse">
                          <button 
                            type="submit"
                            disabled={sendingReminders}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                          >
                            {sendingReminders ? (
                              <>
                                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                                Sending...
                              </>
                            ) : (
                              'Send Reminders'
                            )}
                          </button>
                          <button 
                            type="button"
                            disabled={sendingReminders}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                            onClick={() => setShowReminderModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuePayments;
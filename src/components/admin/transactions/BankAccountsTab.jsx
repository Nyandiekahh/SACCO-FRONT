// components/admin/transactions/BankAccountsTab.jsx
import React, { useState, useEffect } from 'react';
import transactionService from '../../../services/transactionService';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

// Format date string
const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString() : '-';
};

const BankAccountsTab = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await transactionService.getBankAccounts();
      setAccounts(response);
    } catch (error) {
      console.error('Failed to fetch bank accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (account = null) => {
    setCurrentAccount(account);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentAccount) {
        await transactionService.updateBankAccount(currentAccount.id, formData);
      } else {
        await transactionService.createBankAccount(formData);
      }
      setShowModal(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error saving bank account:', error);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await transactionService.setAsPrimaryAccount(id);
      fetchAccounts();
    } catch (error) {
      console.error('Error setting primary account:', error);
    }
  };

  if (isLoading) {
    return <div className="py-10 text-center">Loading bank accounts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Bank Accounts</h2>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Bank Account
        </button>
      </div>

      {/* Bank Accounts Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {accounts.map(account => (
          <div key={account.id} className={`bg-white rounded-lg shadow overflow-hidden ${account.is_primary ? 'border-2 border-indigo-500' : ''}`}>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{account.bank_name}</h3>
                  <p className="text-sm text-gray-500">{account.account_name}</p>
                </div>
                {account.is_primary && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">Primary</span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="text-base font-medium">{account.account_number}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(account.current_balance)}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-sm">{account.account_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Reconciled</p>
                  <p className="text-sm">{formatDate(account.last_reconciled)}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex justify-between">
              <button
                onClick={() => handleOpenModal(account)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Edit
              </button>
              {!account.is_primary && (
                <button
                  onClick={() => handleSetPrimary(account.id)}
                  className="text-green-600 hover:text-green-900 text-sm font-medium"
                >
                  Set as Primary
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No bank accounts found. Add one to get started.</p>
        </div>
      )}

      {/* Modal for adding/editing bank account */}
      {showModal && (
        <BankAccountModal 
          account={currentAccount} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleSubmit} 
        />
      )}
    </div>
  );
};

// Bank Account Form Modal Component
const BankAccountModal = ({ account, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    account_name: account?.account_name || '',
    bank_name: account?.bank_name || '',
    account_number: account?.account_number || '',
    branch: account?.branch || '',
    account_type: account?.account_type || '',
    is_primary: account?.is_primary || false,
    is_active: account?.is_active !== undefined ? account.is_active : true,
    contact_person: account?.contact_person || '',
    contact_email: account?.contact_email || '',
    contact_phone: account?.contact_phone || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {account ? 'Edit Bank Account' : 'Add New Bank Account'}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Account Name</label>
                  <input
                    type="text"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    value={formData.account_number}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Account Type</label>
                  <input
                    type="text"
                    name="account_type"
                    value={formData.account_type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center h-full mt-6">
                    <input
                      type="checkbox"
                      name="is_primary"
                      checked={formData.is_primary}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Set as primary account
                    </label>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center h-full mt-6">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Account is active
                    </label>
                  </div>
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium text-gray-700 mt-2">Contact Information</h4>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                // components/admin/transactions/BankAccountsTab.jsx (continued)
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BankAccountsTab;
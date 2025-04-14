// pages/admin/Transactions.jsx
import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import ExpensesTab from '../../components/admin/transactions/ExpensesTab';
import IncomeTab from '../../components/admin/transactions/IncomeTab';
import BatchesTab from '../../components/admin/transactions/BatchesTab';
import BankAccountsTab from '../../components/admin/transactions/BankAccountsTab';
import BankTransactionsTab from '../../components/admin/transactions/BankTransactionsTab';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('expenses');

  const tabs = [
    { id: 'expenses', label: 'Expenses' },
    { id: 'income', label: 'Income' },
    { id: 'batches', label: 'Transaction Batches' },
    { id: 'bank-accounts', label: 'Bank Accounts' },
    { id: 'bank-transactions', label: 'Bank Transactions' }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-bold text-gray-900">Financial Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all SACCO financial transactions, expenses, income, and bank accounts.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'expenses' && <ExpensesTab />}
          {activeTab === 'income' && <IncomeTab />}
          {activeTab === 'batches' && <BatchesTab />}
          {activeTab === 'bank-accounts' && <BankAccountsTab />}
          {activeTab === 'bank-transactions' && <BankTransactionsTab />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Transactions;
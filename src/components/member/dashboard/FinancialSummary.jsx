// components/member/dashboard/FinancialSummary.jsx
import React, { useState, useEffect } from 'react';
import transactionService from '../../../services/transactionService';

// Utility to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

const FinancialSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    monthlyContributions: 0,
    shareCapital: 0,
    totalInvestments: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await transactionService.calculateTotalInvestments();
        setFinancialData(data);
      } catch (error) {
        console.error('Failed to fetch financial summary data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Monthly Contributions</p>
            <p className="mt-2 text-3xl font-bold text-blue-800">
              {formatCurrency(financialData.monthlyContributions)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Share Capital</p>
            <p className="mt-2 text-3xl font-bold text-green-800">
              {formatCurrency(financialData.shareCapital)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-purple-600">Total Investments</p>
            <p className="mt-2 text-3xl font-bold text-purple-800">
              {formatCurrency(financialData.totalInvestments)}
            </p>
            <p className="mt-1 text-xs text-purple-600">
              (Contributions + Share Capital)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
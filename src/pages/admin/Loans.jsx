// pages/admin/Loans.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  AlertCircle,
  Search,
  Filter,
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  CreditCard,
  Percent,
  Bell,
  FileCheck,
  FileX,
  Clipboard,
  UserPlus,
  Edit,
  Coins
} from 'lucide-react';
import { loanService } from '../../services';
import DuePayments from '../../components/admin/loans/DuePayments';

// Tab component for better organization
const Tab = ({ title, active, onClick, count }) => (
  <button
    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
      active 
        ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    {title}
    {count !== undefined && count > 0 && (
      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
        active ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const LoanStatusBadge = ({ status }) => {
  let color, icon, label;
  
  switch (status.toUpperCase()) {
    case 'PENDING':
      color = 'bg-yellow-100 text-yellow-800';
      icon = <Clock className="h-4 w-4 mr-1" />;
      label = 'Pending Review';
      break;
    case 'APPROVED':
      color = 'bg-blue-100 text-blue-800';
      icon = <CheckCircle className="h-4 w-4 mr-1" />;
      label = 'Approved';
      break;
    case 'REJECTED':
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="h-4 w-4 mr-1" />;
      label = 'Rejected';
      break;
    case 'DISBURSED':
      color = 'bg-green-100 text-green-800';
      icon = <DollarSign className="h-4 w-4 mr-1" />;
      label = 'Disbursed';
      break;
    case 'SETTLED':
      color = 'bg-purple-100 text-purple-800';
      icon = <CheckCircle className="h-4 w-4 mr-1" />;
      label = 'Fully Paid';
      break;
    case 'CANCELLED':
      color = 'bg-gray-100 text-gray-800';
      icon = <XCircle className="h-4 w-4 mr-1" />;
      label = 'Cancelled';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
      icon = <AlertCircle className="h-4 w-4 mr-1" />;
      label = status;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
};

const LoanCard = ({ loan, onDisburseLoan, onAddRepayment, onViewSchedule, onGenerateStatement }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Loan - {loan.member_name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Applied on {new Date(loan.application_date).toLocaleDateString()}
            </p>
          </div>
          <LoanStatusBadge status={loan.status} />
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Loan Amount</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">KES {parseFloat(loan.amount).toLocaleString()}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Term</dt>
            <dd className="mt-1 text-sm text-gray-900">{loan.term_months} months</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
            <dd className="mt-1 text-sm text-gray-900">{loan.interest_rate}% per annum</dd>
          </div>
          
          {(loan.status === 'DISBURSED' || loan.status === 'SETTLED') && (
            <>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Disbursed Amount</dt>
                <dd className="mt-1 text-sm text-gray-900">KES {parseFloat(loan.disbursed_amount)?.toLocaleString() || parseFloat(loan.amount).toLocaleString()}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Total Repaid</dt>
                <dd className="mt-1 text-sm text-gray-900">KES {parseFloat(loan.total_repaid)?.toLocaleString() || '0'}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Remaining Balance</dt>
                <dd className="mt-1 text-sm text-gray-900">KES {parseFloat(loan.remaining_balance)?.toLocaleString() || parseFloat(loan.amount).toLocaleString()}</dd>
              </div>
            </>
          )}
          
          {expanded && (
            <>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Member ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.member}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Approval Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.approval_date ? new Date(loan.approval_date).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Disbursement Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {loan.disbursement_date ? new Date(loan.disbursement_date).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              
              <div className="sm:col-span-3">
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900">{loan.purpose}</dd>
              </div>
              
              {loan.status === 'REJECTED' && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
                  <dd className="mt-1 text-sm text-red-600">{loan.rejection_reason || 'No reason provided'}</dd>
                </div>
              )}
            </>
          )}
        </dl>
        
        {/* Loan actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          {loan.status === 'APPROVED' && (
            <button
              type="button"
              onClick={() => onDisburseLoan(loan)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Disburse Loan
            </button>
          )}
          
          {loan.status === 'DISBURSED' && (
            <button
              type="button"
              onClick={() => onAddRepayment(loan)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Add Repayment
            </button>
          )}
          
          {(loan.status === 'DISBURSED' || loan.status === 'SETTLED') && (
            <>
              <button
                type="button"
                onClick={() => onViewSchedule(loan)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Calendar className="h-4 w-4 mr-1" />
                View Schedule
              </button>
              
              <button
                type="button"
                onClick={() => onGenerateStatement(loan)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-1" />
                Generate Statement
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="px-4 py-4 sm:px-6 bg-gray-50">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Details
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ApplicationCard = ({ application, onApprove, onReject }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Application - {application.member_name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Applied on {new Date(application.application_date).toLocaleDateString()}
            </p>
          </div>
          <LoanStatusBadge status={application.status} />
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Amount Requested</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">KES {parseFloat(application.amount).toLocaleString()}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Term Requested</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.term_months} months</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Has Guarantor</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.has_guarantor ? 'Yes' : 'No'}</dd>
          </div>
          
          {expanded && (
            <>
              {application.has_guarantor && (
                <>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.guarantor_name}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.guarantor_contact}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Relationship</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.guarantor_relationship}</dd>
                  </div>
                </>
              )}
              
              <div className="sm:col-span-3">
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.purpose}</dd>
              </div>
              
              {application.status === 'REJECTED' && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
                  <dd className="mt-1 text-sm text-red-600">{application.rejection_reason || 'No reason provided'}</dd>
                </div>
              )}
              
              {application.application_document && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Supporting Document</dt>
                  <dd className="mt-1 text-sm text-blue-600">
                    <a 
                      href={application.application_document} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Document
                    </a>
                  </dd>
                </div>
              )}
            </>
          )}
        </dl>
        
        {/* Application actions */}
        {application.status === 'PENDING' && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onApprove(application)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </button>
            
            <button
              type="button"
              onClick={() => onReject(application)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </button>
          </div>
        )}
      </div>
      
      <div className="px-4 py-4 sm:px-6 bg-gray-50">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show Details
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const LoanStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Loans</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.activeLoans}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Outstanding Balance</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">KES {stats.outstandingAmount?.toLocaleString() || '0'}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clipboard className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Applications</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.pendingApplications || 0}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Overdue Loans</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.overdueLoans}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeLoans: 0,
    pendingApplications: 0,
    totalLoansAmount: 0,
    totalDisbursedAmount: 0,
    totalRepaidAmount: 0,
    outstandingAmount: 0,
    overdueLoans: 0,
    fullyPaidLoans: 0,
    repaymentRate: 0
  });
  
  const [filters, setFilters] = useState({
    status: '',
    searchTerm: ''
  });
  
  // Tab state
  const [activeTab, setActiveTab] = useState('applications');
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDisburseModal, setShowDisburseModal] = useState(false);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interestRate, setInterestRate] = useState(12);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [disbursementData, setDisbursementData] = useState({
    destination_account: '',
    payment_method: 'BANK_TRANSFER',
    transaction_cost: 0,
    reference_number: '',
    description: ''
  });
  
  const [repaymentData, setRepaymentData] = useState({
    amount: '',
    reference_number: '',
    transaction_code: '',
    transaction_message: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });
  
  const [bankAccounts, setBankAccounts] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchLoans();
    fetchLoanStats();
    fetchBankAccounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, loans, applications, activeTab]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoanApplications();
      setApplications(response || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch loan applications:', err);
      setError('Could not load loan applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoans();
      setLoans(response || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      setError('Could not load loans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoanStats = async () => {
    try {
      const stats = await loanService.getLoanStats();
      setStats(stats);
    } catch (err) {
      console.error('Failed to fetch loan stats:', err);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      // This would be replaced with your actual bank account API
      const response = await fetch('/api/transactions/bank-accounts');
      const data = await response.json();
      setBankAccounts(data || []);
    } catch (err) {
      console.error('Failed to fetch bank accounts:', err);
      // Use a fallback if needed
      setBankAccounts([
        { id: 'default', bank_name: 'Default Bank', account_name: 'SACCO Account' }
      ]);
    }
  };

  const applyFilters = () => {
    if (activeTab === 'applications') {
      let result = [...applications];
      
      // Filter by status if set
      if (filters.status) {
        result = result.filter(app => app.status === filters.status);
      }
      
      // Search by term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        result = result.filter(
          app => 
            app.member_name?.toLowerCase().includes(searchLower) ||
            app.purpose?.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredApplications(result);
    } else {
      let result = [...loans];
      
      // Apply tab filters first
      if (activeTab !== 'all' && activeTab !== 'due') {
        result = result.filter(loan => loan.status === activeTab.toUpperCase());
      }
      
      // Then apply manual filters
      if (filters.status && activeTab === 'all') {
        result = result.filter(loan => loan.status === filters.status);
      }
      
      // Search by term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        result = result.filter(
          loan => 
            loan.member_name?.toLowerCase().includes(searchLower) ||
            loan.purpose?.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredLoans(result);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setInterestRate(12); // Default interest rate
    setShowApproveModal(true);
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleDisburseClick = (loan) => {
    setSelectedLoan(loan);
    // Reset disbursement data with defaults
    setDisbursementData({
      destination_account: bankAccounts.length > 0 ? bankAccounts[0].id : '',
      payment_method: 'BANK_TRANSFER',
      transaction_cost: 0,
      reference_number: '',
      description: `Loan disbursement to ${loan.member_name}`
    });
    setShowDisburseModal(true);
  };

  const handleAddRepaymentClick = (loan) => {
    setSelectedLoan(loan);
    setRepaymentData({
      amount: '',
      reference_number: '',
      transaction_code: '',
      transaction_message: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
    setShowRepaymentModal(true);
  };

  const handleViewScheduleClick = async (loan) => {
    setSelectedLoan(loan);
    setActionLoading(true);
    try {
      const response = await loanService.getLoanRepaymentSchedule(loan.id);
      setSchedule(response);
      setShowScheduleModal(true);
    } catch (err) {
      console.error('Failed to fetch repayment schedule:', err);
      alert('Could not load repayment schedule. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateStatementClick = async (loan) => {
    try {
      const response = await loanService.generateLoanStatement(loan.id);
      
      // In a real app, you might handle downloading or displaying the statement
      alert('Loan statement generated successfully!');
      
      // Refresh loans to get updated data
      fetchLoans();
    } catch (err) {
      console.error('Failed to generate loan statement:', err);
      alert('Could not generate loan statement. Please try again.');
    }
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      await loanService.approveLoanApplication(selectedApplication.id, { interest_rate: interestRate });
      
      // Refresh data
      await Promise.all([fetchApplications(), fetchLoans(), fetchLoanStats()]);
      setShowApproveModal(false);
      
      // Show success message
      alert('Loan application approved successfully!');
    } catch (err) {
      console.error('Failed to approve loan application:', err);
      alert(err.response?.data?.message || 'Failed to approve loan application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedApplication || !rejectionReason.trim()) return;
    
    setActionLoading(true);
    try {
      await loanService.rejectLoanApplication(selectedApplication.id, { rejection_reason: rejectionReason });
      
      // Refresh data
      await Promise.all([fetchApplications(), fetchLoanStats()]);
      setShowRejectModal(false);
      
      // Show success message
      alert('Loan application rejected successfully!');
    } catch (err) {
      console.error('Failed to reject loan application:', err);
      alert(err.response?.data?.message || 'Failed to reject loan application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisburseSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLoan || !disbursementData.reference_number) return;
    
    setActionLoading(true);
    try {
      // First, disburse the loan through loan service
      const loanResponse = await loanService.disburseLoan(selectedLoan.id);
      
      // Then, record the bank transaction
      await fetch('/api/transactions/bank-transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: disbursementData.destination_account,
          transaction_date: new Date().toISOString().split('T')[0],
          transaction_type: 'WITHDRAWAL',
          amount: selectedLoan.amount,
          description: disbursementData.description,
          reference_number: disbursementData.reference_number,
          transaction_cost: parseFloat(disbursementData.transaction_cost) || 0
        }),
      });
      
      // Create an expense record for the transaction cost if > 0
      if (parseFloat(disbursementData.transaction_cost) > 0) {
        await fetch('/api/transactions/expenses/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expense_date: new Date().toISOString().split('T')[0],
            amount: parseFloat(disbursementData.transaction_cost),
            description: `Transaction cost for loan disbursement to ${selectedLoan.member_name}`,
            category: 'BANKING',
            payment_method: disbursementData.payment_method,
            reference_number: disbursementData.reference_number
          }),
        });
      }
      
      // Refresh data
      await Promise.all([fetchLoans(), fetchLoanStats()]);
      setShowDisburseModal(false);
      
      // Show success message
      alert('Loan disbursed successfully!');
    } catch (err) {
      console.error('Failed to disburse loan:', err);
      alert(err.response?.data?.message || 'Failed to disburse loan. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRepaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLoan || !repaymentData.amount || !repaymentData.reference_number) return;
    
    setActionLoading(true);
    try {
      await loanService.addLoanRepayment(selectedLoan.id, repaymentData);
      
      // Refresh data
      await Promise.all([fetchLoans(), fetchLoanStats()]);
      setShowRepaymentModal(false);
      
      // Show success message
      alert('Loan repayment added successfully!');
    } catch (err) {
      console.error('Failed to add loan repayment:', err);
      alert(err.response?.data?.message || 'Failed to add loan repayment. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Loans Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage loan applications, approvals, disbursements and repayments.
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/loans/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              New Loan
            </Link>
          </div>
        </div>
        
        {/* Loan statistics */}
        <LoanStats stats={stats} />
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto pb-1">
            <Tab 
              title="Applications" 
              active={activeTab === 'applications'} 
              onClick={() => setActiveTab('applications')} 
              count={applications.filter(app => app.status === 'PENDING').length}
            />
            <Tab 
              title="Approved" 
              active={activeTab === 'approved'} 
              onClick={() => setActiveTab('approved')} 
              count={loans.filter(loan => loan.status === 'APPROVED').length}
            />
            <Tab 
              title="Disbursed" 
              active={activeTab === 'disbursed'} 
              onClick={() => setActiveTab('disbursed')} 
              count={loans.filter(loan => loan.status === 'DISBURSED').length}
            />
            <Tab
              title="Due Payments"
              active={activeTab === 'due'}
              onClick={() => setActiveTab('due')}
              count={stats.overdueLoans}
            />
            <Tab 
              title="Settled" 
              active={activeTab === 'settled'} 
              onClick={() => setActiveTab('settled')} 
              count={loans.filter(loan => loan.status === 'SETTLED').length}
            />
            <Tab 
              title="All Loans" 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')}
            />
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {/* Render Due Payments component */}
          {activeTab === 'due' ? (
            <DuePayments />
          ) : (
            /* All other tabs (applications or loan lists) */
            <div className="bg-white shadow overflow-hidden rounded-md">
              <div className="flex flex-col sm:flex-row p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-grow space-x-2 mb-4 sm:mb-0">
                  <div className="relative rounded-md shadow-sm flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder={activeTab === 'applications' ? "Search applications..." : "Search loans..."}
                      value={filters.searchTerm}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    />
                  </div>
                  
                  {activeTab === 'all' && (
                    <div className="relative inline-block text-left">
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="APPROVED">Approved</option>
                        <option value="DISBURSED">Disbursed</option>
                        <option value="SETTLED">Settled</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div className="relative inline-block text-left">
                      <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="">All Applications</option>
                        <option value="PENDING">Pending Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={() => {
                      fetchApplications();
                      fetchLoans();
                      fetchLoanStats();
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-y-6">
                  {/* Applications Tab Content */}
                  {activeTab === 'applications' && (
                    filteredApplications.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          There are no loan applications matching your filters.
                        </p>
                      </div>
                    ) : (
                      filteredApplications.map((application) => (
                        <ApplicationCard 
                          key={application.id} 
                          application={application}
                          onApprove={handleApproveClick}
                          onReject={handleRejectClick}
                        />
                      ))
                    )
                  )}
                  
                  {/* Loans Tab Content */}
                  {activeTab !== 'applications' && activeTab !== 'due' && (
                    filteredLoans.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          There are no loans matching your filters.
                        </p>
                      </div>
                    ) : (
                      filteredLoans.map((loan) => (
                        <LoanCard 
                          key={loan.id} 
                          loan={loan}
                          onDisburseLoan={handleDisburseClick}
                          onAddRepayment={handleAddRepaymentClick}
                          onViewSchedule={handleViewScheduleClick}
                          onGenerateStatement={handleGenerateStatementClick}
                        />
                      ))
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Approve Application Modal */}
      {showApproveModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Approve Loan Application
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You are about to approve a loan application for{' '}
                      <span className="font-medium text-gray-900">
                        KES {parseFloat(selectedApplication.amount).toLocaleString()}
                      </span>{' '}
                      from{' '}
                      <span className="font-medium text-gray-900">
                        {selectedApplication.member_name}
                      </span>.
                    </p>
                    
                    <form onSubmit={handleApproveSubmit} className="mt-5">
                      <div className="mb-4">
                        <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          name="interest-rate"
                          id="interest-rate"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="0.5"
                          required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          This is the annual interest rate that will be applied to this loan.
                        </p>
                      </div>
                      
                      <div className="sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {actionLoading ? (
                            <>
                              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                              Processing...
                            </>
                          ) : (
                            'Approve Loan'
                          )}
                        </button>
                        <button
                          type="button"
                          disabled={actionLoading}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                          onClick={() => setShowDisburseModal(false)}
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
      )}
      
      {/* Add Repayment Modal */}
      {showRepaymentModal && selectedLoan && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add Loan Repayment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Recording a payment for {selectedLoan.member_name}'s loan. Remaining balance: KES {parseFloat(selectedLoan.remaining_balance)?.toLocaleString() || parseFloat(selectedLoan.amount).toLocaleString()}.
                    </p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleRepaymentSubmit} className="mt-5 sm:mt-4">
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Payment Amount (KES)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">KES</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      min="1"
                      max={selectedLoan.remaining_balance || selectedLoan.amount}
                      required
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      value={repaymentData.amount}
                      onChange={(e) => setRepaymentData({...repaymentData, amount: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="reference_number"
                    id="reference_number"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Payment reference number"
                    value={repaymentData.reference_number}
                    onChange={(e) => setRepaymentData({...repaymentData, reference_number: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    name="transaction_date"
                    id="transaction_date"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={repaymentData.transaction_date}
                    onChange={(e) => setRepaymentData({...repaymentData, transaction_date: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="transaction_code" className="block text-sm font-medium text-gray-700">
                    Transaction Code
                  </label>
                  <input
                    type="text"
                    name="transaction_code"
                    id="transaction_code"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="M-Pesa transaction code"
                    value={repaymentData.transaction_code}
                    onChange={(e) => setRepaymentData({...repaymentData, transaction_code: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="transaction_message" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="transaction_message"
                    id="transaction_message"
                    rows="2"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Any additional information"
                    value={repaymentData.transaction_message}
                    onChange={(e) => setRepaymentData({...repaymentData, transaction_message: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={actionLoading || !repaymentData.amount}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Record Payment'
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    onClick={() => setShowRepaymentModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* View Schedule Modal */}
      {showScheduleModal && selectedLoan && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Loan Repayment Schedule
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Repayment schedule for {selectedLoan.member_name}'s loan of KES {parseFloat(selectedLoan.amount).toLocaleString()}.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5">
                  {actionLoading ? (
                    <div className="flex justify-center items-center py-4">
                      <RefreshCw className="animate-spin h-6 w-6 text-blue-500" />
                    </div>
                  ) : schedule ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Principal
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Interest
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Due
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Paid
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {schedule.schedule?.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.installment_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(item.due_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {parseFloat(item.principal_amount).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {parseFloat(item.interest_amount).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {parseFloat(item.amount_due).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {parseFloat(item.amount_paid).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${item.status === 'PAID' 
                                    ? 'bg-green-100 text-green-800' 
                                    : item.status === 'PARTIAL' 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : item.status === 'OVERDUE'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                  }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No schedule information available</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Loans;
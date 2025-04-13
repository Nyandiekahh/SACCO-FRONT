import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw,
  AlertCircle,
  DollarSign,
  ChevronDown,
  ChevronUp,
  FileText, 
  Check,
  X
} from 'lucide-react';
import { loanService } from '../../services';

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

const ApplicationCard = ({ application, onApprove, onReject }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Loan Application - {application.member_name}
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
            <dd className="mt-1 text-lg font-semibold text-gray-900">KES {application.amount.toLocaleString()}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Membership #</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.member_name}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Term</dt>
            <dd className="mt-1 text-sm text-gray-900">{application.term_months} months</dd>
          </div>
          
          {expanded && (
            <>
              <div className="sm:col-span-3">
                <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                <dd className="mt-1 text-sm text-gray-900">{application.purpose}</dd>
              </div>
              
              {application.has_guarantor && (
                <>
                  <div className="sm:col-span-3">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Information</dt>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.guarantor_name || 'Not provided'}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Guarantor Contact</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.guarantor_contact || 'Not provided'}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Relationship</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.guarantor_relationship || 'Not provided'}</dd>
                  </div>
                </>
              )}
              
              {application.status === 'REJECTED' && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
                  <dd className="mt-1 text-sm text-red-600">{application.rejection_reason || 'No reason provided'}</dd>
                </div>
              )}
              
              {application.application_document && (
                <div className="sm:col-span-3">
                  <dt className="text-sm font-medium text-gray-500">Supporting Document</dt>
                  <dd className="mt-1">
                    <a 
                      href={application.application_document} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
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
        
        {application.status === 'PENDING' && (
          <div className="mt-6 flex space-x-3 justify-end">
            <button
              type="button"
              onClick={() => onReject(application)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-1 text-red-500" />
              Reject
            </button>
            
            <button
              type="button"
              onClick={() => onApprove(application)}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
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

const LoanApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'PENDING',
    searchTerm: ''
  });
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interestRate, setInterestRate] = useState(15);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoanApplications();
      setApplications(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch loan applications:', err);
      setError('Could not load loan applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...applications];
    
    // Filter by status
    if (filters.status && filters.status !== 'ALL') {
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
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApproveClick = (application) => {
    setSelectedApplication(application);
    setInterestRate(15); // Default interest rate
    setShowApproveModal(true);
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      await loanService.approveLoanApplication(selectedApplication.id, {
        interest_rate: interestRate
      });
      
      // Refresh the list
      fetchApplications();
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
    
    if (!selectedApplication || !rejectionReason) return;
    
    setActionLoading(true);
    try {
      await loanService.rejectLoanApplication(selectedApplication.id, {
        rejection_reason: rejectionReason
      });
      
      // Refresh the list
      fetchApplications();
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
            <h1 className="text-2xl font-semibold text-gray-900">Loan Applications</h1>
            <p className="mt-2 text-sm text-gray-700">
              Review and manage all loan applications from members.
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 bg-white shadow overflow-hidden rounded-md">
          <div className="flex flex-col sm:flex-row p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-grow space-x-2 mb-4 sm:mb-0">
              <div className="relative rounded-md shadow-sm flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search applications..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
              
              <div className="relative inline-block text-left">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={() => fetchApplications()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6">
              {filteredApplications.length === 0 ? (
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
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Approve Loan Modal */}
      {showApproveModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Approve Loan Application
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You are about to approve a loan application for {selectedApplication.member_name} worth KES {selectedApplication.amount.toLocaleString()}. Please confirm the details below.
                    </p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleApproveSubmit} className="mt-5 sm:mt-4">
                <div className="mb-4">
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    name="interestRate"
                    id="interestRate"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                
                <div className="sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
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
                    onClick={() => setShowApproveModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Loan Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Reject Loan Application
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You are about to reject the loan application for {selectedApplication.member_name}. Please provide a reason for the rejection.
                    </p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleRejectSubmit} className="mt-5 sm:mt-4">
                <div className="mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                    Rejection Reason
                  </label>
                  <textarea
                    id="rejectionReason"
                    name="rejectionReason"
                    rows="4"
                    required
                    className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this loan application is being rejected..."
                  ></textarea>
                </div>
                
                <div className="sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Reject Application'
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LoanApplications;
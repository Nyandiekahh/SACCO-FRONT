import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MemberLayout from '../../layouts/MemberLayout';
import { 
  CreditCard, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  DollarSign, 
  FileText, 
  Percent,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw
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

const LoanCard = ({ loan }) => {
  const [expanded, setExpanded] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);

  const toggleExpanded = async () => {
    if (!expanded && !schedule && loan.status === 'DISBURSED') {
      // Load repayment schedule when expanding
      try {
        setScheduleLoading(true);
        const response = await loanService.getLoanRepaymentSchedule(loan.id);
        setSchedule(response);
        setError(null);
      } catch (err) {
        console.error('Failed to load repayment schedule:', err);
        setError('Could not load repayment schedule.');
      } finally {
        setScheduleLoading(false);
      }
    }
    
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {loan.purpose ? loan.purpose.substring(0, 50) + (loan.purpose.length > 50 ? '...' : '') : 'Loan'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Applied on {new Date(loan.application_date).toLocaleDateString()}
            </p>
          </div>
          <LoanStatusBadge status={loan.status} />
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Loan Amount</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">KES {loan.amount.toLocaleString()}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Term</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">{loan.term_months} months</dd>
          </div>
          
          {loan.status === 'DISBURSED' || loan.status === 'SETTLED' ? (
            <>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Remaining Balance</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">KES {loan.remaining_balance?.toLocaleString() || '0'}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Total Repaid</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">KES {loan.total_repaid?.toLocaleString() || '0'}</dd>
              </div>
            </>
          ) : null}
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
            <dd className="mt-1 text-sm text-gray-900">{loan.interest_rate}% per annum</dd>
          </div>
          
          {loan.status === 'DISBURSED' || loan.status === 'SETTLED' ? (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Disbursement Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{loan.disbursement_date ? new Date(loan.disbursement_date).toLocaleDateString() : 'Not disbursed yet'}</dd>
            </div>
          ) : null}
          
          {loan.status === 'REJECTED' && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
              <dd className="mt-1 text-sm text-red-600">{loan.rejection_reason || 'No reason provided'}</dd>
            </div>
          )}
        </dl>
        
        {expanded && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            {scheduleLoading ? (
              <div className="flex justify-center items-center py-4">
                <RefreshCw className="animate-spin h-6 w-6 text-blue-500" />
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : schedule ? (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Repayment Schedule</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Installment
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedule.schedule.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            #{item.installment_number}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            KES {item.amount_due.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
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
                              {item.status === 'PARTIAL' && ` (KES ${item.remaining_amount.toLocaleString()} remaining)`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No repayment schedule available
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="px-4 py-4 sm:px-6 bg-gray-50">
        <button
          type="button"
          onClick={toggleExpanded}
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
              {loan.status === 'DISBURSED' ? 'View Repayment Schedule' : 'View Details'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Loans = () => {
  const [activeTab, setActiveTab] = useState('loans');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both loans and applications in parallel
        const [loansResponse, applicationsResponse] = await Promise.all([
          loanService.getLoans(),
          loanService.getLoanApplications()
        ]);
        
        setLoans(loansResponse.data || []);
        setApplications(applicationsResponse.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch loan data:', err);
        setError('Could not load your loans and applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter applications that don't have an associated loan
  const pendingApplications = applications.filter(app => 
    !app.loan && (app.status === 'PENDING' || app.status === 'REJECTED' || app.status === 'CANCELLED')
  );

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
          <Link
            to="/member/loan-application"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply for a Loan <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('loans')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'loans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Active Loans
              {loans.length > 0 && (
                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                  activeTab === 'loans' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {loans.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('applications')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'applications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Applications
              {pendingApplications.length > 0 && (
                <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                  activeTab === 'applications' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {pendingApplications.length}
                </span>
              )}
            </button>
          </nav>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            {loans.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Active Loans</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any active loans at the moment.
                </p>
                <div className="mt-6">
                  <Link
                    to="/member/loan-application"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply for a Loan
                  </Link>
                </div>
              </div>
            ) : (
              loans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))
            )}
          </div>
        )}
        
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {pendingApplications.length === 0 ? (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Pending Applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any pending loan applications at the moment.
                </p>
                <div className="mt-6">
                  <Link
                    to="/member/loan-application"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply for a Loan
                  </Link>
                </div>
              </div>
            ) : (
              pendingApplications.map((application) => (
                <div key={application.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Loan Application
                    </h3>
                    <LoanStatusBadge status={application.status} />
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Amount Requested</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">KES {application.amount.toLocaleString()}</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Term</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">{application.term_months} months</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Application Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{new Date(application.application_date).toLocaleDateString()}</dd>
                      </div>
                      
                      {application.reviewed_date && (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">Reviewed On</dt>
                          <dd className="mt-1 text-sm text-gray-900">{new Date(application.reviewed_date).toLocaleDateString()}</dd>
                        </div>
                      )}
                      
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                        <dd className="mt-1 text-sm text-gray-900">{application.purpose}</dd>
                      </div>
                      
                      {application.status === 'REJECTED' && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Rejection Reason</dt>
                          <dd className="mt-1 text-sm text-red-600">{application.rejection_reason || 'No reason provided'}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'loans' && loans.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Need Help with Your Loan?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>If you need help or have questions about your loans, please contact our customer service team.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

// FallbackIcon for information circle since it wasn't imported from lucide
const InformationCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Loans;
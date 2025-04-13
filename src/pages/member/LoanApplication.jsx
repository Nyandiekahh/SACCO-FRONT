import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberLayout from '../../layouts/MemberLayout';
import { 
  CreditCard, 
  AlertCircle, 
  CheckCircle,
  ArrowRight, 
  FileText, 
  UserCheck, 
  DollarSign, 
  Calendar,
  Clock,
  Info,
  Upload
} from 'lucide-react';
import { loanService } from '../../services';

const LoanApplication = () => {
  const navigate = useNavigate();
  
  // Application states
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    term_months: 12,
    has_guarantor: false,
    guarantor_name: '',
    guarantor_contact: '',
    guarantor_relationship: '',
    application_document: null
  });

  // Eligibility check
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setLoading(true);
        const response = await loanService.checkEligibility();
        setEligibility(response);
      } catch (err) {
        console.error('Failed to check loan eligibility:', err);
        setError('Could not check loan eligibility. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === 'amount') {
      // Ensure amount is a valid number and within the eligible range
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue <= 0) {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else if (eligibility && numValue > eligibility.max_loan_amount) {
        setFormData(prev => ({ ...prev, [name]: eligibility.max_loan_amount.toString() }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      // Prepare form data for submission
      const applicationData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'application_document' && formData[key]) {
          applicationData.append(key, formData[key]);
        } else if (key !== 'application_document') {
          applicationData.append(key, formData[key]);
        }
      });
      
      // Submit application
      const response = await loanService.submitApplication(applicationData);
      
      setSuccess({
        message: 'Your loan application has been submitted successfully.',
        applicationId: response.id
      });
      
      // Reset form
      setFormData({
        amount: '',
        purpose: '',
        term_months: 12,
        has_guarantor: false,
        guarantor_name: '',
        guarantor_contact: '',
        guarantor_relationship: '',
        application_document: null
      });
      
      // Move to success step
      setStep(4);
    } catch (err) {
      console.error('Failed to submit loan application:', err);
      setError(err.response?.data?.error || 'Failed to submit loan application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Continue to next step
  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  // Back to previous step
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Render loading state
  if (loading) {
    return (
      <MemberLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </MemberLayout>
    );
  }

  // Render eligibility check result (Step 1)
  const renderEligibilityCheck = () => {
    if (!eligibility) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">Could not check loan eligibility. Please try again later.</p>
          </div>
        </div>
      );
    }

    if (!eligibility.eligible) {
      return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-red-50 border-b border-red-100">
            <h3 className="text-lg leading-6 font-medium text-red-800">Loan Eligibility Check</h3>
            <p className="mt-1 text-sm text-red-600">
              Sorry, you are not currently eligible for a loan.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Eligibility Issue</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{eligibility.reason}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-500">Share Capital Complete:</div>
                <div className="flex items-center">
                  {eligibility.share_capital_complete ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className={eligibility.share_capital_complete ? "text-green-700" : "text-red-700"}>
                    {eligibility.share_capital_complete ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-500">KYC Verification:</div>
                <div className="flex items-center">
                  {eligibility.is_verified ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className={eligibility.is_verified ? "text-green-700" : "text-red-700"}>
                    {eligibility.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-500">Account Status:</div>
                <div className="flex items-center">
                  {!eligibility.is_on_hold ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className={!eligibility.is_on_hold ? "text-green-700" : "text-red-700"}>
                    {!eligibility.is_on_hold ? "Active" : "On Hold"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-500">Outstanding Loans:</div>
                <div className="flex items-center">
                  {!eligibility.has_active_loans || eligibility.outstanding_loans < eligibility.deposits * 3 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                  )}
                  <span className={!eligibility.has_active_loans ? "text-green-700" : "text-yellow-700"}>
                    {eligibility.has_active_loans ? `KES ${eligibility.outstanding_loans.toLocaleString()}` : "None"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm font-medium text-gray-500">Total Deposits:</div>
                <span className="text-gray-900 font-medium">
                  KES {eligibility.deposits.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
              <button
                type="button"
                onClick={() => navigate('/member/profile')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
              <button
                type="button"
                onClick={() => navigate('/member/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-green-100">
          <h3 className="text-lg leading-6 font-medium text-green-800">Loan Eligibility Check</h3>
          <p className="mt-1 text-sm text-green-600">
            Congratulations! You are eligible to apply for a loan.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-blue-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Loan Eligibility Details</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Based on your deposits of KES {eligibility.deposits.toLocaleString()}, you can borrow up to:</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 bg-white rounded-lg border border-green-200 shadow-sm">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Maximum Loan Amount</p>
                <p className="text-3xl font-bold text-gray-900">KES {eligibility.max_loan_amount.toLocaleString()}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600">
                  {eligibility.multiplier}x Multiplier
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue to Application <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render loan application form (Step 2)
  const renderLoanApplicationForm = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg leading-6 font-medium text-blue-800">Loan Application</h3>
          <p className="mt-1 text-sm text-blue-600">
            Please fill out the loan application form below.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Loan Amount (KES)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">KES</span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1000"
                    max={eligibility?.max_loan_amount || 1000000}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Maximum amount: KES {eligibility?.max_loan_amount.toLocaleString() || '0'}
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="term_months" className="block text-sm font-medium text-gray-700">
                  Loan Term (Months)
                </label>
                <select
                  id="term_months"
                  name="term_months"
                  value={formData.term_months}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                  Loan Purpose
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows="4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Explain the purpose of this loan..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render guarantor and documents form (Step 3)
  const renderGuarantorForm = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
          <h3 className="text-lg leading-6 font-medium text-blue-800">Loan Guarantor &amp; Documents</h3>
          <p className="mt-1 text-sm text-blue-600">
            Add guarantor information and upload supporting documents.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    id="has_guarantor"
                    name="has_guarantor"
                    type="checkbox"
                    checked={formData.has_guarantor}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="has_guarantor" className="font-medium text-gray-700">
                    I have a guarantor for this loan
                  </label>
                </div>
                
                {formData.has_guarantor && (
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="guarantor_name" className="block text-sm font-medium text-gray-700">
                        Guarantor Name
                      </label>
                      <input
                        type="text"
                        name="guarantor_name"
                        id="guarantor_name"
                        value={formData.guarantor_name}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required={formData.has_guarantor}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="guarantor_contact" className="block text-sm font-medium text-gray-700">
                        Guarantor Contact
                      </label>
                      <input
                        type="text"
                        name="guarantor_contact"
                        id="guarantor_contact"
                        value={formData.guarantor_contact}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required={formData.has_guarantor}
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="guarantor_relationship" className="block text-sm font-medium text-gray-700">
                        Relationship to Guarantor
                      </label>
                      <input
                        type="text"
                        name="guarantor_relationship"
                        id="guarantor_relationship"
                        value={formData.guarantor_relationship}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required={formData.has_guarantor}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Supporting Documents</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload any supporting documents for your loan application (optional).
                </p>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Application Document</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="application_document"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="application_document"
                            name="application_document"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  {formData.application_document && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected file: {formData.application_document.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Display any error message */}
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Render success message (Step 4)
  const renderSuccessMessage = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-green-100">
          <h3 className="text-lg leading-6 font-medium text-green-800">Application Submitted</h3>
          <p className="mt-1 text-sm text-green-600">
            Your loan application has been submitted successfully.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Thank You!</h3>
            <p className="mt-1 text-gray-500">
              Your loan application has been received and is now under review. 
              You will receive updates on the status of your application.
            </p>
          </div>
          
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Amount Requested</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date().toLocaleDateString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Pending Review
              </dd>
            </div>
          </dl>
          
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => navigate('/member/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/member/loans')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View My Loans
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render loan application steps
  const renderSteps = () => {
    return (
      <nav aria-label="Progress" className="mb-8">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          <li className="md:flex-1">
            <button
              onClick={() => setStep(1)}
              disabled={step === 1}
              className={`group pl-4 py-2 flex flex-col border-l-4 hover:border-blue-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 w-full text-left ${
                step >= 1
                  ? 'border-blue-600 md:border-blue-600'
                  : 'border-gray-200 md:border-gray-200'
              }`}
            >
              <span className={`text-xs font-semibold tracking-wide uppercase ${
                step >= 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Step 1
              </span>
              <span className="text-sm font-medium">Eligibility Check</span>
            </button>
          </li>

          <li className="md:flex-1">
            <button
              onClick={() => eligibility?.eligible && setStep(2)}
              disabled={!eligibility?.eligible || step === 2}
              className={`group pl-4 py-2 flex flex-col border-l-4 hover:border-blue-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 w-full text-left ${
                step >= 2
                  ? 'border-blue-600 md:border-blue-600'
                  : 'border-gray-200 md:border-gray-200'
              }`}
            >
              <span className={`text-xs font-semibold tracking-wide uppercase ${
                step >= 2 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Step 2
              </span>
              <span className="text-sm font-medium">Loan Details</span>
            </button>
          </li>

          <li className="md:flex-1">
            <button
              onClick={() => eligibility?.eligible && formData.amount && setStep(3)}
              disabled={!eligibility?.eligible || !formData.amount || step === 3}
              className={`group pl-4 py-2 flex flex-col border-l-4 hover:border-blue-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 w-full text-left ${
                step >= 3
                  ? 'border-blue-600 md:border-blue-600'
                  : 'border-gray-200 md:border-gray-200'
              }`}
            >
              <span className={`text-xs font-semibold tracking-wide uppercase ${
                step >= 3 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Step 3
              </span>
              <span className="text-sm font-medium">Guarantor & Documents</span>
            </button>
          </li>

          <li className="md:flex-1">
            <button
              disabled={true}
              className={`group pl-4 py-2 flex flex-col border-l-4 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 w-full text-left ${
                step >= 4
                  ? 'border-blue-600 md:border-blue-600'
                  : 'border-gray-200 md:border-gray-200'
              }`}
            >
              <span className={`text-xs font-semibold tracking-wide uppercase ${
                step >= 4 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                Step 4
              </span>
              <span className="text-sm font-medium">Confirmation</span>
            </button>
          </li>
        </ol>
      </nav>
    );
  };

  return (
    <MemberLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Loan Application</h1>
        </div>
        
        {renderSteps()}
        
        {step === 1 && renderEligibilityCheck()}
        {step === 2 && renderLoanApplicationForm()}
        {step === 3 && renderGuarantorForm()}
        {step === 4 && renderSuccessMessage()}
      </div>
    </MemberLayout>
  );
};

export default LoanApplication;
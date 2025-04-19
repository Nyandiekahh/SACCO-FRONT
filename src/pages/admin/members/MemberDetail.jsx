// pages/admin/members/MemberDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminLayout from '../../../layouts/AdminLayout';
import memberService from '../../../services/memberService';
import authService from '../../../services/authService';

const MemberDetail = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Transform documents list to an object for easier access
  const transformDocuments = (documents) => {
    const docMap = {
      id_front: { uploaded: false, verified: false },
      id_back: { uploaded: false, verified: false },
      passport: { uploaded: false, verified: false }
    };

    if (documents && documents.length > 0) {
      documents.forEach(doc => {
        switch(doc.document_type) {
          case 'ID_FRONT':
            docMap.id_front = { 
              uploaded: true, 
              verified: doc.is_verified,
              document_url: doc.document_url
            };
            break;
          case 'ID_BACK':
            docMap.id_back = { 
              uploaded: true, 
              verified: doc.is_verified,
              document_url: doc.document_url
            };
            break;
          case 'PASSPORT':
            docMap.passport = { 
              uploaded: true, 
              verified: doc.is_verified,
              document_url: doc.document_url
            };
            break;
        }
      });
    }

    return docMap;
  };

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setIsLoading(true);
        const memberData = await memberService.getMemberById(memberId);
        
        // Transform documents if they exist
        if (memberData.documents) {
          memberData.documents = transformDocuments(memberData.documents);
        }

        setMember(memberData);
      } catch (error) {
        console.error('Failed to fetch member details:', error);
        toast.error('Could not load member details');
      } finally {
        setIsLoading(false);
      }
    };

    if (memberId) {
      fetchMemberDetails();
    }
  }, [memberId]);

  const handleVerifyDocument = async (documentType) => {
    try {
      console.log('Verifying document:', documentType, 'for member ID:', memberId);
      
      // Pass the member ID to the verifyDocumentByType function
      const response = await authService.verifyDocumentByType(documentType, memberId);
      toast.success('Document verified successfully');
      
      // Refresh member data to show updated verification status
      const memberData = await memberService.getMemberById(memberId);
      memberData.documents = transformDocuments(memberData.documents);
      setMember(memberData);
    } catch (error) {
      console.error('Failed to verify document. Error details:', error);
      
      // Try to extract and display the specific error message
      let errorMessage = 'Could not verify document';
      if (error.data && typeof error.data === 'object') {
        errorMessage += ': ' + (error.data.error || JSON.stringify(error.data));
      } else if (error.message) {
        errorMessage += ': ' + error.message;
      }
      
      toast.error(errorMessage);
    }
  };
  
  const handleToggleUserStatus = async () => {
    try {
      const reason = member.is_on_hold ? '' : prompt('Please provide a reason for putting this member on hold:');
      
      // If user cancels the prompt when putting on hold
      if (!member.is_on_hold && !reason) return;
      
      await memberService.toggleMemberStatus(memberId, reason);
      toast.success(`Member ${member.is_on_hold ? 'activated' : 'put on hold'} successfully`);
      
      // Refresh member data
      const memberData = await memberService.getMemberById(memberId);
      memberData.documents = transformDocuments(memberData.documents);
      setMember(memberData);
    } catch (error) {
      console.error('Failed to toggle member status:', error);
      toast.error('Could not update member status');
    }
  };

  const handleResetPassword = async () => {
    try {
      await authService.adminResetUserOTP(memberId);
      toast.success('Password reset OTP sent to the member');
    } catch (error) {
      console.error('Failed to send password reset OTP:', error);
      toast.error('Could not send password reset OTP');
    }
  };

  // Wrap entire component with AdminLayout
  return (
    <AdminLayout>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : !member ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>Member not found or you don't have permission to view this member.</p>
          <button 
            onClick={() => navigate('/admin/members')}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Members
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header with basic info */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{member.full_name}</h2>
                <p className="text-gray-600">Member ID: {member.membership_number}</p>
              </div>
              <div className="mt-2 md:mt-0 flex space-x-2">
                <button
                  onClick={handleToggleUserStatus}
                  className={`px-4 py-2 rounded-md text-white ${
                    member.is_on_hold 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {member.is_on_hold ? 'Activate Member' : 'Put on Hold'}
                </button>
                <button
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="px-6 py-2 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {member.is_active ? 'Active' : 'Inactive'}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              member.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {member.is_verified ? 'Verified' : 'Unverified'}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              member.is_on_hold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {member.is_on_hold ? 'On Hold' : 'Active Status'}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                KYC Documents
              </button>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'contributions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contributions
              </button>
              <button
                onClick={() => setActiveTab('loans')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'loans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Loans
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">KYC Documents</h3>
                
                {!member.documents || Object.keys(member.documents).length === 0 ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                    <p className="text-yellow-700">This member has not uploaded any verification documents yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ID Front */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium">ID Card (Front)</h4>
                      </div>
                      <div className="p-4">
                        {member.documents.id_front?.uploaded ? (
                          <>
                            <div className="mb-3 flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                member.documents.id_front.verified ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></span>
                              <span className={member.documents.id_front.verified ? 'text-green-700' : 'text-yellow-700'}>
                                {member.documents.id_front.verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                            {!member.documents.id_front.verified && (
                              <button
                                onClick={() => handleVerifyDocument('ID_FRONT')}
                                className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Verify Document
                              </button>
                            )}
                            {member.documents.id_front.document_url && (
                              <a 
                                href={member.documents.id_front.document_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-600 hover:underline text-center"
                              >
                                View Document
                              </a>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Not uploaded</p>
                        )}
                      </div>
                    </div>
                    
                    {/* ID Back */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium">ID Card (Back)</h4>
                      </div>
                      <div className="p-4">
                        {member.documents.id_back?.uploaded ? (
                          <>
                            <div className="mb-3 flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                member.documents.id_back.verified ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></span>
                              <span className={member.documents.id_back.verified ? 'text-green-700' : 'text-yellow-700'}>
                                {member.documents.id_back.verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                            {!member.documents.id_back.verified && (
                              <button
                                onClick={() => handleVerifyDocument('ID_BACK')}
                                className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Verify Document
                              </button>
                            )}
                            {member.documents.id_back.document_url && (
                              <a 
                                href={member.documents.id_back.document_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-600 hover:underline text-center"
                              >
                                View Document
                              </a>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Not uploaded</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Passport Photo */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium">Passport Photo</h4>
                      </div>
                      <div className="p-4">
                        {member.documents.passport?.uploaded ? (
                          <>
                            <div className="mb-3 flex items-center">
                              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                member.documents.passport.verified ? 'bg-green-500' : 'bg-yellow-500'
                              }`}></span>
                              <span className={member.documents.passport.verified ? 'text-green-700' : 'text-yellow-700'}>
                                {member.documents.passport.verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                            {!member.documents.passport.verified && (
                              <button
                                onClick={() => handleVerifyDocument('PASSPORT')}
                                className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Verify Document
                              </button>
                            )}
                            {member.documents.passport.document_url && (
                              <a 
                                href={member.documents.passport.document_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-600 hover:underline text-center"
                              >
                                View Document
                              </a>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Not uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Verification Status</h4>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      member.is_verified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></span>
                    <span className={member.is_verified ? 'text-green-700' : 'text-yellow-700'}>
                      {member.is_verified ? 'Fully Verified' : 'Pending Complete Verification'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-blue-600">
                    {member.is_verified 
                      ? 'This member has completed KYC verification.' 
                      : 'This member needs to complete KYC verification by uploading and getting verification for their ID card (front and back).'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'contributions' && (
              <div className="text-center py-8 text-gray-500">
                <p>Contributions tab is under development.</p>
                <p>View member contributions in the Contributions section.</p>
              </div>
            )}

            {activeTab === 'loans' && (
              <div className="text-center py-8 text-gray-500">
                <p>Loans tab is under development.</p>
                <p>View member loans in the Loans section.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default MemberDetail;
// components/admin/members/InviteMemberModal.jsx
import React, { useState } from 'react';
import memberService from '../../../services/memberService';

const InviteMemberModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [shareCapitalTerm, setShareCapitalTerm] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await memberService.inviteMember({
        email,
        share_capital_term: parseInt(shareCapitalTerm)
      });
      
      setSuccess(true);
      setEmail('');
      // Reset form
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000); // Close after 2 seconds
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Invite New Member</h3>
          
          <div className="mt-4">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                <p>Invitation sent successfully!</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="member@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="shareCapitalTerm">
                  Share Capital Term
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="shareCapitalTerm"
                  value={shareCapitalTerm}
                  onChange={(e) => setShareCapitalTerm(e.target.value)}
                  required
                >
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
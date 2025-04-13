// pages/admin/Members.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { memberService } from '../../services';
import { MemberFilters, MembersTable, MemberActionButtons } from '../../components/admin/members';

const Members = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // all, active, inactive, on-hold, pending-verification
    shareCapital: 'all', // all, completed, in-progress, not-started
    sortBy: 'name' // name, number, date, share_completion
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await memberService.getMembers();
        setMembers(response);
        
        // Calculate pagination
        const totalItems = response.length;
        const totalPages = Math.ceil(totalItems / pagination.pageSize);
        
        setPagination({
          ...pagination,
          totalPages,
          totalItems
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch members:', err);
        setError('Could not load members. Please try again later.');
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Apply filters when filters or members change
  useEffect(() => {
    if (!members.length) return;
    
    let result = [...members];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(member => 
        member.full_name?.toLowerCase().includes(search) ||
        member.email?.toLowerCase().includes(search) ||
        member.membership_number?.toLowerCase().includes(search) ||
        member.phone_number?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      switch(filters.status) {
        case 'active':
          result = result.filter(member => member.is_active && !member.is_on_hold);
          break;
        case 'inactive':
          result = result.filter(member => !member.is_active);
          break;
        case 'on-hold':
          result = result.filter(member => member.is_on_hold);
          break;
        case 'pending-verification':
          result = result.filter(member => !member.is_verified);
          break;
        default:
          break;
      }
    }
    
    // Apply share capital filter
    if (filters.shareCapital !== 'all') {
      switch(filters.shareCapital) {
        case 'completed':
          result = result.filter(member => 
            member.share_summary?.share_capital_completion_percentage === 100
          );
          break;
        case 'in-progress':
          result = result.filter(member => {
            const completion = member.share_summary?.share_capital_completion_percentage || 0;
            return completion > 0 && completion < 100;
          });
          break;
        case 'not-started':
          result = result.filter(member => 
            !member.share_summary || member.share_summary.share_capital_completion_percentage === 0
          );
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch(filters.sortBy) {
        case 'name':
          return (a.full_name || '').localeCompare(b.full_name || '');
        case 'number':
          return (a.membership_number || '').localeCompare(b.membership_number || '');
        case 'date':
          return new Date(b.date_joined) - new Date(a.date_joined);
        case 'share_completion':
          const aCompletion = a.share_summary?.share_capital_completion_percentage || 0;
          const bCompletion = b.share_summary?.share_capital_completion_percentage || 0;
          return bCompletion - aCompletion;
        default:
          return 0;
      }
    });
    
    // Update pagination
    const totalFilteredItems = result.length;
    const totalPages = Math.ceil(totalFilteredItems / pagination.pageSize);
    
    setPagination({
      ...pagination,
      page: 1, // Reset to first page when filters change
      totalPages,
      totalItems: totalFilteredItems
    });
    
    setFilteredMembers(result);
  }, [filters, members]);

  // Get current page of members
  const getCurrentPageMembers = () => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredMembers.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({
        ...pagination,
        page: newPage
      });
    }
  };

  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Handle member status toggle
  const handleToggleActive = async (memberId) => {
    try {
      await memberService.toggleMemberActiveStatus(memberId);
      
      // Update the member in the list
      const updatedMembers = members.map(member => {
        if (member.id === memberId) {
          return { ...member, is_active: !member.is_active };
        }
        return member;
      });
      
      setMembers(updatedMembers);
    } catch (err) {
      console.error('Failed to toggle member status:', err);
      // Show error message to user
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

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Members
          </h2>
          
          <MemberActionButtons />
        </div>
        
        <MemberFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          totalMembers={pagination.totalItems}
        />
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <MembersTable 
          members={getCurrentPageMembers()} 
          onToggleActive={handleToggleActive}
        />
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.pageSize) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalItems}</span> members
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        pagination.page === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.page === pagination.totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Members;
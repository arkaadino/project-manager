// pages/UsersPage.tsx
import { useState, useEffect } from 'react';
import { Plus, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { UserTable } from '@/components/users-page/UserTable';
import { UserFilters } from '@/components/users-page/UserFilters';
import { CreateUserDialog } from '@/components/users-page/CreateUserDialog';

import type{ 
  User, 
  UserFilters as UserFiltersType, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '@/types/index';
import { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  toggleUserStatus,
  formatApiError 
} from '@/utils/userApi';

export const UsersPage = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Fetch users data
  const fetchUsers = async (filters: UserFiltersType = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getUsers({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
        ...filters
      });

      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter, fetchUsers]);

  // Show success message temporarily
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handlers
  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setError(null);
      const response = await createUser(userData);
      setSuccessMessage(response.message);
      
      // Refresh users list
      await fetchUsers();
      
      // Reset to first page if not there
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      throw err; // Re-throw to let dialog handle it
    }
  };

  const handleUpdateUser = async (id: string, userData: UpdateUserRequest) => {
    try {
      setError(null);
      const response = await updateUser(id, userData);
      setSuccessMessage(response.message);
      
      // Update user in local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === id ? response.user : user
        )
      );
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      throw err;
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setError(null);
      const response = await deleteUser(id);
      setSuccessMessage(response.message);
      
      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      
      // Adjust pagination if necessary
      const newTotal = totalUsers - 1;
      const newTotalPages = Math.ceil(newTotal / limit);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else {
        // Refresh to get accurate counts
        await fetchUsers();
      }
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setError(null);
      const response = await toggleUserStatus(id);
      setSuccessMessage(response.message);
      
      // Update user in local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === id ? response.user : user
        )
      );
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate active filters count
  const activeFiltersCount = [
    searchTerm,
    roleFilter !== 'all' ? roleFilter : '',
    statusFilter !== 'all' ? statusFilter : ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      
      <div className="ml-64 p-6">
        <Header 
          title="User Management"
          description="Manage team members, clients, and their permissions"
        />
        
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Users className="w-7 h-7 text-cyan-400" />
                Users
              </h1>
              <p className="text-slate-400">
                Manage your team members and clients
              </p>
            </div>
            
            <CreateUserDialog onCreateUser={handleCreateUser} />
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <UserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-slate-400">
              Showing {users.length} of {totalUsers} users
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
            {totalPages > 1 && (
              <p className="text-slate-400">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Users Table */}
          <UserTable
            users={users}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onToggleStatus={handleToggleStatus}
          />

          {/* Empty State */}
          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
              <p className="text-slate-400 mb-4">
                {activeFiltersCount > 0 
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first user"
                }
              </p>
              {activeFiltersCount === 0 && (
                <CreateUserDialog 
                  onCreateUser={handleCreateUser}
                  trigger={
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First User
                    </Button>
                  }
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
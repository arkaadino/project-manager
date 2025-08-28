// components/users/UserTable.tsx
import { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Shield, 
  User, 
  Users, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

import { EditUserDialog } from './EditUserDialog';
import type { User as UserType, UpdateUserRequest } from '@/types/index';
import { getFullName, getRoleDisplay, getRoleColor } from '@/types/index';

interface UserTableProps {
  users: UserType[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateUser: (id: string, userData: UpdateUserRequest) => Promise<void>;
  onDeleteUser: (id: string) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
}

export const UserTable = ({
  users,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateUser,
  onDeleteUser,
  onToggleStatus
}: UserTableProps) => {
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
  };

  const handleDelete = async (user: UserType) => {
    try {
      setActionLoading(`delete-${user._id}`);
      await onDeleteUser(user._id);
      setDeletingUser(null);
    } catch (error) {
      // Error is handled by parent component
      console.log('Delete error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (user: UserType) => {
    try {
      setActionLoading(`toggle-${user._id}`);
      await onToggleStatus(user._id);
    } catch (error) {
      // Error is handled by parent component
      console.log('Toggle status error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="ml-3 text-slate-300">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">User</th>
                <th className="text-left p-4 text-slate-300 font-medium">Role</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Company</th>
                <th className="text-left p-4 text-slate-300 font-medium">Created</th>
                <th className="text-right p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user._id} 
                  className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{getFullName(user)}</p>
                        <p className="text-slate-400 text-sm">@{user.username}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getRoleColor(user.role)} border`}>
                      {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role === 'team' && <Users className="w-3 h-3 mr-1" />}
                      {user.role === 'client' && <User className="w-3 h-3 mr-1" />}
                      {getRoleDisplay(user.role)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`${
                      user.isActive 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    } border`}>
                      {user.isActive ? (
                        <><CheckCircle className="w-3 h-3 mr-1" />Active</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" />Inactive</>
                      )}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-300">
                      {user.company || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-400 text-sm">
                      {formatDate(user.createdAt)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem 
                          onClick={() => handleEdit(user)}
                          className="text-white hover:bg-slate-700"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoading === `toggle-${user._id}`}
                          className="text-white hover:bg-slate-700"
                        >
                          {actionLoading === `toggle-${user._id}` ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : user.isActive ? (
                            <XCircle className="w-4 h-4 mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        <DropdownMenuItem 
                          onClick={() => setDeletingUser(user)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {users.map((user) => (
            <div 
              key={user._id}
              className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{getFullName(user)}</p>
                    <p className="text-slate-400 text-sm">@{user.username}</p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem 
                      onClick={() => handleEdit(user)}
                      className="text-white hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handleToggleStatus(user)}
                      className="text-white hover:bg-slate-700"
                    >
                      {user.isActive ? (
                        <><XCircle className="w-4 h-4 mr-2" />Deactivate</>
                      ) : (
                        <><CheckCircle className="w-4 h-4 mr-2" />Activate</>
                      )}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-slate-700" />
                    
                    <DropdownMenuItem 
                      onClick={() => setDeletingUser(user)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-slate-400">
                  <span className="text-slate-300">Email:</span> {user.email}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Role:</span>
                  <Badge className={`${getRoleColor(user.role)} border text-xs`}>
                    {getRoleDisplay(user.role)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Status:</span>
                  <Badge className={`${
                    user.isActive 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  } border text-xs`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {user.company && (
                  <p className="text-slate-400">
                    <span className="text-slate-300">Company:</span> {user.company}
                  </p>
                )}
                <p className="text-slate-400">
                  <span className="text-slate-300">Created:</span> {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + Math.max(1, currentPage - 2);
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 p-0 ${
                      page === currentPage 
                        ? "bg-cyan-600 hover:bg-cyan-700" 
                        : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUpdateUser={onUpdateUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete <strong>{deletingUser && getFullName(deletingUser)}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-slate-300 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUser && handleDelete(deletingUser)}
              disabled={actionLoading === `delete-${deletingUser?._id}`}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading === `delete-${deletingUser?._id}` ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
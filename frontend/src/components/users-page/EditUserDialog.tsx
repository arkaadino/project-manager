// components/users/EditUserDialog.tsx
import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

import type { User, UpdateUserRequest } from '@/types/index';
import { getFullName } from '@/types/index'; 
import { validateUserData, formatApiError } from '@/utils/userApi';

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (id: string, userData: UpdateUserRequest) => Promise<void>;
}

export const EditUserDialog = ({ 
  user, 
  open, 
  onOpenChange, 
  onUpdateUser 
}: EditUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    company: user.company || '',
    isActive: user.isActive,
    password: ''
  });

  // Reset form when user changes
  useEffect(() => {
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company || '',
      isActive: user.isActive,
      password: ''
    });
    setError(null);
    setChangePassword(false);
    setShowPassword(false);
  }, [user]);

  const handleInputChange = (field: keyof UpdateUserRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data to send
    const updateData: UpdateUserRequest = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: formData.role,
      company: formData.company,
      isActive: formData.isActive
    };

    // Include password only if changing
    if (changePassword && formData.password) {
      updateData.password = formData.password;
    }

    // Client-side validation
    const validationErrors = validateUserData(updateData);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    // Check required fields
    if (!updateData.username || !updateData.email || !updateData.firstName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onUpdateUser(user._id, updateData);
      
      // Close dialog
      onOpenChange(false);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      company: user.company || '',
      isActive: user.isActive,
      password: ''
    });
    setError(null);
    setChangePassword(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Edit User - {getFullName(user)}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="edit-username" className="text-white">
                Username <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-white">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                required
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-firstName" className="text-white">
                First Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="edit-lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="text-white">
                Role <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white 
                                       focus:border-cyan-500 focus:ring-cyan-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="admin" className="text-white hover:bg-slate-700">
                    Administrator
                  </SelectItem>
                  <SelectItem value="team" className="text-white hover:bg-slate-700">
                    Team Member
                  </SelectItem>
                  <SelectItem value="client" className="text-white hover:bg-slate-700">
                    Client
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-white">Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked === true)}
                  className="border-slate-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                />
                <Label htmlFor="edit-isActive" className="text-sm text-slate-300">
                  User is active
                </Label>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="edit-company" className="text-white">
              Company
            </Label>
            <Input
              id="edit-company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white 
                       focus:border-cyan-500 focus:ring-cyan-500/20"
              placeholder="Enter company name (optional)"
            />
          </div>

          {/* Password Section */}
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <div className="flex items-center space-x-2">
                <Checkbox
                id="changePassword"
                checked={changePassword}
                onCheckedChange={(checked) => {
                    if (checked === "indeterminate") return;
                    setChangePassword(checked);
                }}
                className="border-slate-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                />
                <Label htmlFor="changePassword" className="text-white">
                Change Password
                </Label>            
            </div>
            {changePassword && (
              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-white">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white pr-12
                             focus:border-cyan-500 focus:ring-cyan-500/20"
                    placeholder="Enter new password (min. 6 characters)"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-slate-400">
                  Leave blank to keep current password
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
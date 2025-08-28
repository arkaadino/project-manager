// components/users/CreateUserDialog.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Plus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Alert, AlertDescription } from '@/components/ui/alert';

import type { CreateUserRequest } from '@/types';
// You'll need to create these utility functions
// import { validateUserData, formatApiError } from '@/utils/userApi';

interface CreateUserDialogProps {
  onCreateUser: (userData: CreateUserRequest) => Promise<void>;
  trigger?: ReactNode;
}

// Placeholder validation function - replace with actual implementation
const validateUserData = (data: CreateUserRequest): string[] => {
  const errors: string[] = [];
  if (!data.email?.includes('@')) {
    errors.push('Please enter a valid email address');
  }
  if (data.password && data.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  return errors;
};

// Placeholder error formatting function - replace with actual implementation
const formatApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const CreateUserDialog = ({ 
  onCreateUser, 
  trigger 
}: CreateUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'client',
    company: ''
  });

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateUserData(formData);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    // Check required fields
    if (!formData.username || !formData.email || !formData.password || !formData.firstName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onCreateUser(formData);
      
      // Reset form and close dialog
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'client',
        company: ''
      });
      setOpen(false);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'client',
      company: ''
    });
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create New User</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new team member or client to the system
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
              <Label htmlFor="username" className="text-white">
                Username <span className="text-red-400">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                placeholder="Enter email address"
                required
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">
                First Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                placeholder="Enter first name"
                required
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white 
                         focus:border-cyan-500 focus:ring-cyan-500/20"
                placeholder="Enter last name"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password <span className="text-red-400">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white pr-12
                           focus:border-cyan-500 focus:ring-cyan-500/20"
                  placeholder="Enter password (min. 6 characters)"
                  required
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
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
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
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">
              Company
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white 
                       focus:border-cyan-500 focus:ring-cyan-500/20"
              placeholder="Enter company name (optional)"
            />
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
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
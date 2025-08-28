// components/users/UserFilters.tsx
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const UserFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onClearFilters,
  activeFiltersCount
}: UserFiltersProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search by name, username, or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 
                     focus:border-cyan-500 focus:ring-cyan-500/20"
          />
        </div>

        {/* Role Filter */}
        <div className="w-full lg:w-48">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white 
                                   focus:border-cyan-500 focus:ring-cyan-500/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Filter by role" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                All Roles
              </SelectItem>
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

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white 
                                   focus:border-cyan-500 focus:ring-cyan-500/20">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                All Status
              </SelectItem>
              <SelectItem value="active" className="text-white hover:bg-slate-700">
                Active
              </SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-slate-700">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="w-full lg:w-48">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white 
                                   focus:border-cyan-500 focus:ring-cyan-500/20">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="createdAt" className="text-white hover:bg-slate-700">
                Newest First
              </SelectItem>
              <SelectItem value="firstName" className="text-white hover:bg-slate-700">
                Name A-Z
              </SelectItem>
              <SelectItem value="email" className="text-white hover:bg-slate-700">
                Email A-Z
              </SelectItem>
              <SelectItem value="role" className="text-white hover:bg-slate-700">
                Role
              </SelectItem>
              <SelectItem value="lastLogin" className="text-white hover:bg-slate-700">
                Last Login
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full lg:w-auto border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <div className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Search: "{searchTerm}"
                <button 
                  onClick={() => onSearchChange('')}
                  className="hover:text-cyan-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {roleFilter !== 'all' && (
              <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Role: {roleFilter === 'admin' ? 'Administrator' : 
                       roleFilter === 'team' ? 'Team Member' : 'Client'}
                <button 
                  onClick={() => onRoleFilterChange('all')}
                  className="hover:text-blue-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {statusFilter !== 'all' && (
              <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Status: {statusFilter === 'active' ? 'Active' : 'Inactive'}
                <button 
                  onClick={() => onStatusFilterChange('all')}
                  className="hover:text-green-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
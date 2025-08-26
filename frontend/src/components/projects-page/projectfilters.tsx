import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  clientFilter: string;
  onClientFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  clients: string[];
  activeFiltersCount: number;
}

export const ProjectFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortChange,
  onClearFilters,
  clients,
  activeFiltersCount
}: ProjectFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-cyan-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="all">All Status</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="Planning">Planning</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="In Progress">In Progress</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="Review">Review</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="Completed">Completed</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={clientFilter} onValueChange={onClientFilterChange}>
          <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="all">All Clients</SelectItem>
            {clients.map(client => (
              <SelectItem className="text-white focus:bg-blue-600 focus:text-white" key={client} value={client}>{client}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-[120px] bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="all">All Priority</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="High">High</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="Medium">Medium</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700/50 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="name">Name</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="deadline">Deadline</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="progress">Progress</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="priority">Priority</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="status">Status</SelectItem>
            <SelectItem className="text-white focus:bg-blue-600 focus:text-white" value="created">Created Date</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
              {activeFiltersCount} active
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilter !== 'all' && (
          <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600">
            Status: {statusFilter}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-slate-400 hover:text-white"
              onClick={() => onStatusFilterChange('all')}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )}
        
        {clientFilter !== 'all' && (
          <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600">
            Client: {clientFilter}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-slate-400 hover:text-white"
              onClick={() => onClientFilterChange('all')}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )}
        
        {priorityFilter !== 'all' && (
          <Badge variant="outline" className="bg-slate-800/50 text-slate-300 border-slate-600">
            Priority: {priorityFilter}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 text-slate-400 hover:text-white"
              onClick={() => onPriorityFilterChange('all')}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
};
import { useState } from 'react';
import { Plus, X, Check, ChevronLeft, ChevronRight, Search, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface NewProject {
  id: number;
  name: string;
  description: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed';
  progress: number;
  deadline: string;
  team: Array<{ id: string; name: string; avatar: string; }>;
  priority: 'High' | 'Medium' | 'Low';
  budget: number;
  commentsCount: number;
  filesCount: number;
  createdAt: string;
  tags: string[];
  requirements: string;
  deliverables: string;
}

interface CreateProjectDialogProps {
  onCreateProject: (project: NewProject) => void;
  clients: Client[];
  teamMembers: TeamMember[];
  trigger?: React.ReactNode;
}

export const CreateProjectDialog = ({ 
  onCreateProject, 
  clients, 
  teamMembers, 
  trigger 
}: CreateProjectDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [clientComboOpen, setClientComboOpen] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState({
    company: '',
    name: '',
    email: ''
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientId: '',
    priority: '',
    budget: '',
    deadline: '',
    status: 'Planning',
    selectedTeam: [] as string[],
    tags: [] as string[],
    requirements: '',
    deliverables: ''
  });

  const [newTag, setNewTag] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      clientId: '',
      priority: '',
      budget: '',
      deadline: '',
      status: 'Planning',
      selectedTeam: [],
      tags: [],
      requirements: '',
      deliverables: ''
    });
    setCurrentTab('basic');
    setNewTag('');
    setShowNewClientForm(false);
    setNewClientData({ company: '', name: '', email: '' });
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const toggleTeamMember = (memberId: string) => {
    const isSelected = formData.selectedTeam.includes(memberId);
    if (isSelected) {
      handleInputChange('selectedTeam', formData.selectedTeam.filter(id => id !== memberId));
    } else {
      handleInputChange('selectedTeam', [...formData.selectedTeam, memberId]);
    }
  };

  const addNewClient = () => {
    if (!newClientData.company.trim() || !newClientData.name.trim() || !newClientData.email.trim()) {
      alert('Please fill in all client fields');
      return;
    }

    const newClient = {
      id: Date.now().toString(),
      ...newClientData
    };

    // Add to clients array (in real app, this would be handled by parent component)
    clients.push(newClient);
    
    handleInputChange('clientId', newClient.id);
    setShowNewClientForm(false);
    setNewClientData({ company: '', name: '', email: '' });
    setClientComboOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.clientId || !formData.priority) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedClient = clients.find((c: Client) => c.id === formData.clientId);
      const selectedTeamData = teamMembers.filter(member => 
        formData.selectedTeam.includes(member.id)
      );

      const newProject = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        client: selectedClient?.company || '',
        status: formData.status as 'Planning' | 'In Progress' | 'Review' | 'On Hold' | 'Completed',
        progress: 0,
        deadline: formData.deadline,
        team: selectedTeamData.map(member => ({
          id: member.id,
          name: member.name,
          avatar: member.avatar
        })),
        priority: formData.priority as 'High' | 'Medium' | 'Low',
        budget: parseFloat(formData.budget) || 0,
        commentsCount: 0,
        filesCount: 0,
        createdAt: new Date().toISOString(),
        tags: formData.tags,
        requirements: formData.requirements,
        deliverables: formData.deliverables
      };

      await onCreateProject(newProject);
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = (tab: string) => {
    switch (tab) {
      case 'basic':
        return formData.name.trim() && formData.description.trim();
      case 'client':
        return formData.clientId && formData.priority && formData.budget;
      case 'team':
        return formData.selectedTeam.length > 0;
      default:
        return true;
    }
  };

  const getSelectedClient = () => {
    return clients.find((c: Client) => c.id === formData.clientId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Review':
        return 'bg-purple-500';
      case 'On Hold':
        return 'bg-yellow-500';
      case 'Planning':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const tabs = ['basic', 'client', 'team', 'details'];
  const currentTabIndex = tabs.indexOf(currentTab);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-800/95 backdrop-blur-sm border-slate-700/50">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-white">
            Create New Project
          </DialogTitle>
          <p className="text-slate-400 mt-2">Fill in the details to create your new project</p>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 p-1">
            <TabsTrigger 
              value="basic" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-slate-100 transition-all duration-200"
            >
              Basic Info
            </TabsTrigger>
            <TabsTrigger 
              value="client" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-slate-100 transition-all duration-200"
            >
              Client & Budget
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-slate-100 transition-all duration-200"
            >
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="details" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-300 hover:text-slate-100 transition-all duration-200"
            >
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Project Name <span className="text-cyan-400">*</span>
                </label>
                <Input
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Description <span className="text-cyan-400">*</span>
                </label>
                <Textarea
                  placeholder="Describe the project goals and requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 min-h-[120px] transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Status</label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-100 focus:border-cyan-500 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Planning" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor('Planning')}`} />
                          Planning
                        </div>
                      </SelectItem>
                      <SelectItem value="In Progress" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor('In Progress')}`} />
                          In Progress
                        </div>
                      </SelectItem>
                      <SelectItem value="Review" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor('Review')}`} />
                          Review
                        </div>
                      </SelectItem>
                      <SelectItem value="On Hold" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor('On Hold')}`} />
                          On Hold
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Deadline</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="client" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Select Client <span className="text-cyan-400">*</span>
                </label>
                <Popover open={clientComboOpen} onOpenChange={setClientComboOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientComboOpen}
                      className="w-full justify-between bg-slate-700/50 border-slate-600/50 text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                    >
                      {formData.clientId
                        ? clients.find((client) => client.id === formData.clientId)?.company || "Select client..."
                        : "Select client..."}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700">
                    <Command className='bg-slate-700'>
                      <CommandInput 
                        placeholder="Search clients..." 
                        className="h-9 bg-transparent border-0 text-slate-100 placeholder:text-slate-400"
                      />
                      <CommandEmpty className="py-6 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Building2 className="h-8 w-8 text-slate-500" />
                          <p>No clients found.</p>
                        </div>
                      </CommandEmpty>
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.company}
                            onSelect={() => {
                              handleInputChange('clientId', client.id);
                              setClientComboOpen(false);
                            }}
                            className="text-slate-100 hover:bg-slate-700 cursor-pointer"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                {client.company[0]}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{client.company}</span>
                                <span className="text-sm text-slate-400">{client.name} • {client.email}</span>
                              </div>
                            </div>
                            <Check
                              className={`ml-auto h-4 w-4 ${
                                client.id === formData.clientId ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </CommandItem>
                        ))}
                        <CommandItem
                          onSelect={() => {
                            setShowNewClientForm(true);
                            setClientComboOpen(false);
                          }}
                          className="text-cyan-400 hover:bg-slate-700 cursor-pointer border-t border-slate-700 mt-1"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Client
                        </CommandItem>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* New Client Form */}
                {showNewClientForm && (
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-200">Add New Client</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewClientForm(false);
                          setNewClientData({ company: '', name: '', email: '' });
                        }}
                        className="text-slate-400 hover:text-slate-200 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Company Name <span className="text-cyan-400">*</span>
                        </label>
                        <Input
                          placeholder="Enter company name"
                          value={newClientData.company}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, company: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Contact Name <span className="text-cyan-400">*</span>
                        </label>
                        <Input
                          placeholder="Enter contact name"
                          value={newClientData.name}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Email <span className="text-cyan-400">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          value={newClientData.email}
                          onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 h-8 text-sm"
                        />
                      </div>
                      <Button
                        onClick={addNewClient}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white h-8 text-sm"
                        disabled={!newClientData.company.trim() || !newClientData.name.trim() || !newClientData.email.trim()}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Client
                      </Button>
                    </div>
                  </div>
                )}
                
                {getSelectedClient() && !showNewClientForm && (
                  <div className="mt-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-medium">
                        {getSelectedClient()?.company[0]}
                      </div>
                      <div>
                        <p className="text-slate-100 font-medium">{getSelectedClient()?.company}</p>
                        <p className="text-slate-400 text-sm">{getSelectedClient()?.name} • {getSelectedClient()?.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Priority <span className="text-cyan-400">*</span>
                  </label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-100 focus:border-cyan-500 transition-all duration-200">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="High" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          High Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="Low" className="text-slate-100 hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          Low Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Budget (IDR)</label>
                  <Input
                    type="number"
                    placeholder="Enter budget amount"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-200">
                  Select Team Members <span className="text-cyan-400">*</span>
                </label>
                <span className="text-sm text-slate-400">
                  {formData.selectedTeam.length} selected
                </span>
              </div>
              
              <ScrollArea className="h-80 pr-4">
                <div className="grid grid-cols-1 gap-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`group p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-slate-700/50 ${
                        formData.selectedTeam.includes(member.id)
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-slate-700/30 border-slate-600/50 hover:border-slate-600'
                      }`}
                      onClick={() => toggleTeamMember(member.id)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-slate-600 group-hover:border-cyan-500/50 transition-colors duration-200">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-slate-700 text-slate-300 font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-100 font-medium truncate">{member.name}</p>
                          <p className="text-slate-400 text-sm truncate">{member.role}</p>
                          <p className="text-slate-500 text-xs truncate">{member.email}</p>
                        </div>
                        {formData.selectedTeam.includes(member.id) && (
                          <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {formData.selectedTeam.length > 0 && (
                <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <p className="text-sm font-medium text-slate-200 mb-3">Selected Team Members:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedTeam.map(memberId => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return member ? (
                        <Badge key={memberId} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors duration-200">
                          {member.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-200">Project Tags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 flex-1 transition-all duration-200"
                  />
                  <Button 
                    type="button" 
                    onClick={addTag} 
                    variant="outline" 
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 transition-all duration-200"
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    {formData.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer transition-colors duration-200"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Requirements</label>
                <Textarea
                  placeholder="List project requirements and specifications..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 min-h-[100px] transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">Deliverables</label>
                <Textarea
                  placeholder="List expected deliverables and outcomes..."
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange('deliverables', e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 min-h-[100px] transition-all duration-200"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t border-slate-700/50 mt-8">
          <div className="flex items-center gap-2">
            {currentTabIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentTab(tabs[currentTabIndex - 1]);
                }}
                className="bg-gray-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 hover:border-slate-600 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              {tabs.map((tab, index) => (
                <div
                  key={tab}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index <= currentTabIndex 
                      ? 'bg-cyan-500' 
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {currentTabIndex < tabs.length - 1 ? (
              <Button
                type="button"
                onClick={() => {
                  setCurrentTab(tabs[currentTabIndex + 1]);
                }}
                disabled={!canProceed(currentTab)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || formData.selectedTeam.length === 0 || !canProceed(currentTab)}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {currentTab === 'details' && formData.name && (
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <h4 className="text-sm font-medium text-slate-200 mb-3">Project Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Name:</span>
                <span className="text-slate-200 ml-2">{formData.name}</span>
              </div>
              <div>
                <span className="text-slate-400">Client:</span>
                <span className="text-slate-200 ml-2">{getSelectedClient()?.company || 'Not selected'}</span>
              </div>
              <div>
                <span className="text-slate-400">Priority:</span>
                <span className="text-slate-200 ml-2">
                  {formData.priority && (
                    <Badge className={`${getPriorityColor(formData.priority)} text-xs ml-1`}>
                      {formData.priority}
                    </Badge>
                  )}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Team:</span>
                <span className="text-slate-200 ml-2">{formData.selectedTeam.length} members</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
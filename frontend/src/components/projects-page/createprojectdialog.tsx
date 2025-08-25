import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  priority: 'High' | 'Medium' | 'Low';   // <-- not string anymore
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

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.clientId || !formData.priority) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
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
    return clients.find(c => c.id === formData.clientId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Create New Project</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger  value="basic" className="data-[state=active]:bg-cyan-600 text-white focus:ring-2 focus:ring-cyan-500/40">Basic Info</TabsTrigger>
            <TabsTrigger value="client" className="data-[state=active]:bg-cyan-600 text-white focus:ring-2 focus:ring-cyan-500/40">Client & Budget</TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-cyan-600 text-white focus:ring-2 focus:ring-cyan-500/40">Team</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-cyan-600 text-white focus:ring-2 focus:ring-cyan-500/40">Details</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name *
                </label>
                <Input
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe the project..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Client & Budget Tab */}
          <TabsContent value="client" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Client *
                </label>
                <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Choose client" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{client.company}</span>
                          <span className="text-sm text-slate-400">{client.name} - {client.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {getSelectedClient() && (
                  <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getSelectedClient()?.company[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium">{getSelectedClient()?.company}</p>
                        <p className="text-slate-400 text-sm">{getSelectedClient()?.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Priority *
                  </label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Budget (IDR)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Select Team Members *
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.selectedTeam.includes(member.id)
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
                    }`}
                    onClick={() => toggleTeamMember(member.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-slate-600">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-slate-700 text-slate-300">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-slate-400 text-sm">{member.role} • {member.email}</p>
                      </div>
                      {formData.selectedTeam.includes(member.id) && (
                        <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {formData.selectedTeam.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-slate-400 mb-2">Selected: {formData.selectedTeam.length} members</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedTeam.map(memberId => {
                      const member = teamMembers.find(m => m.id === memberId);
                      return member ? (
                        <Badge key={memberId} className="bg-cyan-500/20 text-cyan-400">
                          {member.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="bg-slate-800 border-slate-700 text-white flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="border-slate-700">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-slate-700 text-slate-300 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Requirements
                </label>
                <Textarea
                  placeholder="List project requirements..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Deliverables
                </label>
                <Textarea
                  placeholder="List expected deliverables..."
                  value={formData.deliverables}
                  onChange={(e) => handleInputChange('deliverables', e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation & Submit */}
        <div className="flex justify-between pt-4 border-t border-slate-700">
          <div className="flex gap-2">
            {currentTab !== 'basic' && (
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ['basic', 'client', 'team', 'details'];
                  const currentIndex = tabs.indexOf(currentTab);
                  setCurrentTab(tabs[currentIndex - 1]);
                }}
                className="border-slate-700 text-slate-300"
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {currentTab !== 'details' ? (
              <Button
                onClick={() => {
                  const tabs = ['basic', 'client', 'team', 'details'];
                  const currentIndex = tabs.indexOf(currentTab);
                  setCurrentTab(tabs[currentIndex + 1]);
                }}
                disabled={!canProceed(currentTab)}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.selectedTeam.length === 0}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
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
      </DialogContent>
    </Dialog>
  );
};
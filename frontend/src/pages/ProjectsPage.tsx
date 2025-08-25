import { useState } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Layout components
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';

// Import our custom components
import { ProjectCard } from '@/components/projects-page/projectscard';
import { ProjectFilters } from '@/components/projects-page/projectfilters';
import { CommentProject } from '@/components/projects-page/commentproject';
import { CreateProjectDialog } from '@/components/projects-page/createprojectdialog';

// Types
interface Project {
  id: number;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed' | 'On Hold';
  progress: number;
  deadline: string;
  team: Array<{ id: string; name: string; avatar: string; }>;
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  budget: number;
  commentsCount: number;
  filesCount: number;
  createdAt: string;
}

interface Comment {
  id: number;
  projectId: number;
  author: { 
    id: string;
    name: string; 
    avatar: string; 
    role: string;
  };
  content: string;
  timestamp: string;
  attachments?: Array<{ 
    id: string;
    name: string; 
    size: string; 
    type: 'image' | 'file';
    url: string;
  }>;
  isEdited?: boolean;
}

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

export const ProjectsPage = () => {
  // Mock Data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Brand Identity Design",
      client: "TechCorp Inc.",
      status: "In Progress",
      progress: 75,
      deadline: "2025-09-15",
      team: [
        { id: "1", name: "John Doe", avatar: "" },
        { id: "2", name: "Sarah Miller", avatar: "" },
        { id: "3", name: "Alex Lee", avatar: "" }
      ],
      priority: "High",
      description: "Complete brand identity redesign including logo, color scheme, and brand guidelines for TechCorp Inc.",
      budget: 50000000,
      commentsCount: 8,
      filesCount: 12,
      createdAt: "2025-08-01T10:00:00Z"
    },
    {
      id: 2,
      name: "Website Redesign",
      client: "StartupXYZ",
      status: "Review",
      progress: 90,
      deadline: "2025-09-08",
      team: [
        { id: "3", name: "Alex Lee", avatar: "" },
        { id: "4", name: "Rachel Kim", avatar: "" }
      ],
      priority: "Medium",
      description: "Modern website redesign with improved UX/UI and mobile responsiveness.",
      budget: 75000000,
      commentsCount: 15,
      filesCount: 8,
      createdAt: "2025-07-20T14:30:00Z"
    },
    {
      id: 3,
      name: "Social Media Campaign",
      client: "Fashion Brand",
      status: "Planning",
      progress: 25,
      deadline: "2025-09-30",
      team: [
        { id: "2", name: "Sarah Miller", avatar: "" },
        { id: "1", name: "John Doe", avatar: "" },
        { id: "5", name: "Mike Wilson", avatar: "" }
      ],
      priority: "Low",
      description: "Comprehensive social media campaign for fall collection launch.",
      budget: 30000000,
      commentsCount: 3,
      filesCount: 5,
      createdAt: "2025-08-10T09:15:00Z"
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      projectId: 1,
      author: { id: "1", name: "John Doe", avatar: "", role: "Designer" },
      content: "Initial brand concepts are ready for review. I've created 3 different directions focusing on modern, professional aesthetics.",
      timestamp: "2025-08-23T10:30:00Z",
      attachments: [
        { id: "1", name: "brand_concepts_v1.pdf", size: "2048000", type: "file", url: "#" }
      ]
    },
    {
      id: 2,
      projectId: 1,
      author: { id: "client1", name: "Mike Johnson", avatar: "", role: "Client" },
      content: "Love the direction of concept #2! Can we explore some variations with different color schemes?",
      timestamp: "2025-08-23T14:20:00Z"
    }
  ]);

  const clients: Client[] = [
    { id: "1", name: "Mike Johnson", email: "mike@techcorp.com", company: "TechCorp Inc." },
    { id: "2", name: "Lisa Chen", email: "lisa@startupxyz.com", company: "StartupXYZ" },
    { id: "3", name: "Emma Davis", email: "emma@fashionbrand.com", company: "Fashion Brand" },
    { id: "4", name: "David Wilson", email: "david@retailco.com", company: "Retail Co." }
  ];

  const teamMembers: TeamMember[] = [
    { id: "1", name: "John Doe", avatar: "", role: "Senior Designer", email: "john@agency.com" },
    { id: "2", name: "Sarah Miller", avatar: "", role: "UI/UX Designer", email: "sarah@agency.com" },
    { id: "3", name: "Alex Lee", avatar: "", role: "Developer", email: "alex@agency.com" },
    { id: "4", name: "Rachel Kim", avatar: "", role: "Project Manager", email: "rachel@agency.com" },
    { id: "5", name: "Mike Wilson", avatar: "", role: "Creative Director", email: "mike@agency.com" }
  ];

  const currentUser = {
    id: "1",
    name: "John Doe",
    avatar: "",
    role: "Senior Designer"
  };

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dialog states
  const [selectedProjectForComments, setSelectedProjectForComments] = useState<number | null>(null);

  // Filter logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesClient = clientFilter === 'all' || project.client === clientFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesClient && matchesPriority;
  });

  // Sort logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'priority': {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'status':
        return a.status.localeCompare(b.status);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Actions
  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleViewComments = (projectId: number) => {
    setSelectedProjectForComments(projectId);
  };

  const handleEditProject = (projectId: number) => {
    console.log('Edit project:', projectId);
    // Implement edit logic
  };

  const handleDeleteProject = (projectId: number) => {
    console.log('Delete project:', projectId);
    // Implement delete logic
  };

  const handleAddComment = async (projectId: number, content: string, attachments?: File[]) => {
    const newComment: Comment = {
      id: Date.now(),
      projectId,
      author: currentUser,
      content,
      timestamp: new Date().toISOString(),
      attachments: attachments?.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size.toString(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file)
      }))
    };

    setComments(prev => [...prev, newComment]);
    
    // Update comment count
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, commentsCount: project.commentsCount + 1 }
        : project
    ));
  };

  const handleEditComment = async (commentId: number, content: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, content, isEdited: true }
        : comment
    ));
  };

  const handleDeleteComment = async (commentId: number) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      
      // Update comment count
      setProjects(prev => prev.map(project => 
        project.id === comment.projectId 
          ? { ...project, commentsCount: Math.max(0, project.commentsCount - 1) }
          : project
      ));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setClientFilter('all');
    setPriorityFilter('all');
  };

  const activeFiltersCount = [
    searchTerm,
    statusFilter !== 'all' ? statusFilter : '',
    clientFilter !== 'all' ? clientFilter : '',
    priorityFilter !== 'all' ? priorityFilter : ''
  ].filter(Boolean).length;

  const uniqueClients = [...new Set(projects.map(p => p.client))];

  const selectedProject = selectedProjectForComments 
    ? projects.find(p => p.id === selectedProjectForComments)
    : null;

  const projectComments = selectedProjectForComments 
    ? comments.filter(c => c.projectId === selectedProjectForComments)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar />
      
      <div className="ml-64 p-6">
        <Header 
          title="Projects Management"
          description="Create, manage, and collaborate on your creative projects"
        />
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
              <p className="text-slate-400">
                Manage your creative projects and collaborate with your team
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
                <div className="flex items-center bg-slate-800 rounded-full p-1">
                {['grid', 'list'].map(mode => (
                    <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'grid' | 'list')}
                    className={`
                        flex items-center justify-center w-10 h-10 rounded-full transition
                        ${viewMode === mode ? 'bg-cyan-600 text-white' : 'text-slate-400'}
                    `}
                    >
                    {mode === 'grid' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    </button>
                ))}
                </div>

              <CreateProjectDialog
                onCreateProject={handleCreateProject}
                clients={clients}
                teamMembers={teamMembers}
              />
            </div>
          </div>

          {/* Filters */}
          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            clientFilter={clientFilter}
            onClientFilterChange={setClientFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
            clients={uniqueClients}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Projects Grid/List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-400">
                Showing {sortedProjects.length} of {projects.length} projects
              </p>
            </div>

            {sortedProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
                <p className="text-slate-400 mb-4">
                  {activeFiltersCount > 0 
                    ? "Try adjusting your filters or search terms"
                    : "Get started by creating your first project"
                  }
                </p>
                {activeFiltersCount === 0 && (
                  <CreateProjectDialog
                    onCreateProject={handleCreateProject}
                    clients={clients}
                    teamMembers={teamMembers}
                    trigger={
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Project
                      </Button>
                    }
                  />
                )}
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {sortedProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewComments={handleViewComments}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Comments Dialog */}
          <Dialog open={selectedProjectForComments !== null} onOpenChange={(open) => {
            if (!open) setSelectedProjectForComments(null);
          }}>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-900 border-slate-700">
              {selectedProject && (
                <CommentProject
                  projectId={selectedProject.id}
                  projectName={selectedProject.name}
                  comments={projectComments}
                  currentUser={currentUser}
                  onAddComment={handleAddComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
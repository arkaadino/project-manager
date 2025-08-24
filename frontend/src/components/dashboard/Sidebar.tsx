import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  MessageCircle,
  Calendar,
  Activity,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = "" }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Activity, label: 'Activity', path: '/activity' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50 ${className}`}>
      <div className="p-6">
        <div 
          className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">b</span>
          </div>
          <span className="text-white font-semibold text-xl">Briefly</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`w-full justify-start gap-3 h-11 ${
                isActive(item.path)
                  ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500 rounded-l-none hover:bg-blue-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-3 h-11 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
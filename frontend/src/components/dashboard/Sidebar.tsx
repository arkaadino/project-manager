import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  FolderOpen,
  User,
  Activity,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { logout } from '../../utils/auth';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = "" }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FolderOpen, label: 'Projects', path: '/projects' },
    { icon: User, label: 'User', path: '/user' },
    { icon: Activity, label: 'Activity', path: '/activity' },

  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    setUser(null);
    logout();
    setOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50 ${className}`}>
      <div className="p-6">
        <div className="flex justify-center items-center w-full">
          <img src="/Briefly-ext.svg" alt="Logo" className="w-40 h-40" />
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
                  ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500 rounded-l-none hover:bg-blue-500/30 hover:text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* Logout Dialog */}
        <div className="absolute bottom-6 left-6 right-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-11 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px] bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50 text-white">
              <DialogHeader>
                <DialogTitle>Logout</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-slate-400">
                Are you sure you want to log out from your account?
              </p>
              <DialogFooter className="mt-4">
                <Button variant="default" onClick={() => setOpen(false)} className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

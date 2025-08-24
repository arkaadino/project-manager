import { Search, Bell, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  description?: string;
  className?: string;
}

export const Header = ({ 
  title = "Project Dashboard", 
  description = "Manage your creative projects efficiently",
  className = ""
}: HeaderProps) => {
  return (
    <header className={`flex items-center justify-between mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400">{description}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <Input 
            type="text" 
            placeholder="Search projects..."
            className="pl-10 w-64 bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          <Bell size={20} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          <User size={20} />
        </Button>
      </div>
    </header>
  );
};
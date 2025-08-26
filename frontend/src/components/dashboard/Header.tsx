import { Bell, User } from 'lucide-react';
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
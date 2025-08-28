// components/dashboard/Header.tsx - Simple version
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/utils/authApi';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types/auth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userProfile = await getCurrentUser(); // ✅ Benar
        setUser(userProfile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Handle error - maybe redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';

  return (
    <header className={`flex items-center justify-between mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400">{description}</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Bungkus dua span jadi kolom */}
        <div className="flex flex-col items-end leading-tight">
          {!loading && (
            <span className="text-slate-300">Hello, {userName}</span>
          )}
          <span className="text-slate-400 text-sm">{user?.role}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={userName}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white">
                  {userInitials}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  );
};
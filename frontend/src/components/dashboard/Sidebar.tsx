import React from 'react';
import { Calendar, Activity, Settings, Home, FolderOpen, MessageCircle } from 'lucide-react';

// Definisikan props untuk Sidebar
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: FolderOpen, label: 'Projects', id: 'projects' },
    { icon: MessageCircle, label: 'Messages', id: 'messages' },
    { icon: Calendar, label: 'Calendar', id: 'calendar' },
    { icon: Activity, label: 'Activity', id: 'activity' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900/90 backdrop-blur-sm border-r border-slate-700/50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">b</span>
          </div>
          <span className="text-white font-semibold text-xl">Briefly</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

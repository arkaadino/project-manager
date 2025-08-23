import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Definisikan props untuk StatsCard
interface StatsCardProps {
  icon: LucideIcon;   // tipe khusus untuk icon dari lucide-react
  label: string;
  value: string | number;
  change: string;
  color: string;      // contoh: "from-blue-500 to-cyan-500"
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, change, color }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <TrendingUp size={16} className="text-green-400" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-xs text-green-400">{change}</p>
      </div>
    </div>
  );
};

export default StatsCard;

import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  color: string;
  className?: string;
}

export const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  change, 
  color,
  className = ""
}: StatsCardProps) => {
  return (
    <Card className={`bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/50 transition-all ${className}`}>
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  );
};
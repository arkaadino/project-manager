import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';

interface ActivityItem {
  action: string;
  project: string;
  time: string;
  type: 'success' | 'warning' | 'info' | string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}


const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: 'success' | 'warning' | 'info' | string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-400" />;
      case 'info': return <Clock size={16} className="text-blue-400" />;
      default: return <Activity size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity: ActivityItem, index: number) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
            <div className="mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.action}</p>
              <p className="text-slate-400 text-xs">{activity.project}</p>
            </div>
            <span className="text-xs text-slate-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
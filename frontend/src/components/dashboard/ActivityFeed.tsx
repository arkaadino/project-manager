import { CheckCircle, AlertCircle, Clock, Activity, FileUp, MessageSquare, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ActivityItem } from '@/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

export const ActivityFeed = ({ activities, className = "" }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertCircle size={16} className="text-yellow-400" />;
      case 'info': return <Clock size={16} className="text-blue-400" />;
      default: return <Activity size={16} className="text-slate-400" />;
    }
  };

  // Map activity types to icons for more context
  const getActivityTypeIcon = (action: string) => {
    if (action.toLowerCase().includes('file') || action.toLowerCase().includes('upload')) {
      return <FileUp size={16} className="text-purple-400" />;
    }
    if (action.toLowerCase().includes('comment') || action.toLowerCase().includes('feedback')) {
      return <MessageSquare size={16} className="text-blue-400" />;
    }
    if (action.toLowerCase().includes('assign') || action.toLowerCase().includes('team')) {
      return <UserPlus size={16} className="text-cyan-400" />;
    }
    return getActivityIcon('default');
  };

  return (
    <Card className={`bg-slate-800/30 backdrop-blur-sm border-slate-700/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-white">Recent Activity</CardTitle>
          <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors">
              <div className="mt-1">
                {getActivityTypeIcon(activity.action)}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.action}</p>
                <p className="text-slate-400 text-xs">{activity.project}</p>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
import { CheckCircle, AlertCircle, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  action: string;
  project: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'default';
}

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
        {activities.map((activity, index) => (
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
      </CardContent>
    </Card>
  );
};
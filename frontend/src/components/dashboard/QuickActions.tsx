import { Plus, Users, MessageCircle, Calendar} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  className?: string;
  onActionClick?: (action: string) => void;
}

export const QuickActions = ({ className = "", onActionClick }: QuickActionsProps) => {
  const actions: QuickAction[] = [
    { 
      icon: Plus, 
      label: 'New Project', 
      color: 'from-blue-500 to-cyan-500',
      onClick: () => onActionClick?.('new-project')
    },
    { 
      icon: Users, 
      label: 'Invite Team', 
      color: 'from-purple-500 to-pink-500',
      onClick: () => onActionClick?.('invite-team')
    },
    { 
      icon: MessageCircle, 
      label: 'Send Message', 
      color: 'from-green-500 to-emerald-500',
      onClick: () => onActionClick?.('send-message')
    },
    { 
      icon: Calendar, 
      label: 'Schedule Meeting', 
      color: 'from-yellow-500 to-orange-500',
      onClick: () => onActionClick?.('schedule-meeting')
    }
  ];

  return (
    <Card className={`bg-slate-800/30 backdrop-blur-sm border-slate-700/50 ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Quick Actions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 h-auto bg-slate-900/30 hover:bg-slate-900/50 transition-all group justify-start"
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon size={20} className="text-white" />
              </div>
              <span className="text-white font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
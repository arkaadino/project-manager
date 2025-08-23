import React, { useState } from 'react';
import { Plus, Users, Calendar, MessageCircle } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { icon: Plus, label: 'New Project', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Invite Team', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, label: 'Send Message', color: 'from-green-500 to-emerald-500' },
    { icon: Calendar, label: 'Schedule Meeting', color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button key={index} className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-all group">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon size={20} className="text-white" />
            </div>
            <span className="text-white font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
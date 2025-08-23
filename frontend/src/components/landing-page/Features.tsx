import { CheckCircle, Clock, BarChart3, Layers } from 'lucide-react';
import React from 'react';

const Features: React.FC = () => (
  <section id="features" className="py-16 bg-gray-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Our Features</h2>
        <p className="text-xl text-gray-300">Everything you need to manage creative projects efficiently</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-900/80 rounded-xl p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
            <Layers className="text-blue-400" size={32} />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Centralized Collaboration</h3>
          <p className="text-gray-300 mb-6">Centralized team-client collaboration portal with structured brief input and revision tracking</p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Structured brief input
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Revision tracking
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              File version control
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-900/80 rounded-xl p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
            <Clock className="text-blue-400" size={32} />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Visual Timeline</h3>
          <p className="text-gray-300 mb-6">Project visual timeline & automatic status updates with per-task/file commenting</p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Real-time status updates
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Task commenting system
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Progress visualization
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-900/80 rounded-xl p-8 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
            <BarChart3 className="text-blue-400" size={32} />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Auto Portfolio & Reports</h3>
          <p className="text-gray-300 mb-6">Automatic project portfolio gallery with financial reporting</p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Automated portfolio generation
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Financial reporting
            </li>
            <li className="flex items-center text-sm text-gray-400">
              <CheckCircle className="text-green-400 mr-2" size={16} />
              Performance analytics
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>);

export default Features;

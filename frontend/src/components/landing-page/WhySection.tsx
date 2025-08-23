import { Users, FileText, MessageSquare, BarChart3 } from 'lucide-react';

const WhySection = () => (
  <section id="why" className="py-16 bg-gray-800">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">
          Why We Built <span className="bg-gradient-to-rbg-clip-text text-blue-400">Briefly</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          We understand the pain points of creative teams and clients. Based on our research, here are the main challenges we solve:
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gray-900/80 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <FileText className="text-blue-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Unstructured Briefs & Revisions</h3>
          <p className="text-gray-400">Revisions are sent through multiple channels, making it hard to track the latest version.</p>
        </div>
        
        <div className="bg-gray-900/80 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <MessageSquare className="text-blue-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Often Miscommunications</h3>
          <p className="text-gray-400">Teams and clients use different platforms, causing miscommunication.</p>
        </div>
        
        <div className="bg-gray-900/80 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <BarChart3 className="text-blue-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Undocumented Workflow</h3>
          <p className="text-gray-400">Project progress is hard to track and tasks are poorly distributed.</p>
        </div>
        
        <div className="bg-gray-900/80 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all border border-gray-700">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <Users className="text-blue-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Clients Struggle to Access Deliverables</h3>
          <p className="text-gray-400">There is no centralized portal to upload and preview project files.</p>
        </div>
      </div>
    </div>
  </section>
);
export default WhySection;

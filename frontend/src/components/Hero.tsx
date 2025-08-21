// components/Hero.jsx
import React from 'react';
import { Users, CheckCircle, Clock } from 'lucide-react';
import Dither
 from '../reactbits/Dither/Dither';
const Hero = () => (
  <section className="relative pt-24 pb-16 bg-gray-900 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Dither
        waveColor={[0, 0.5, 1]}
        disableAnimation={false}
        enableMouseInteraction={false}
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
      />
    </div>

    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-blue-900/20 z-5"></div>

    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 bg-blue-900/50 backdrop-blur-sm text-blue-300 rounded-full text-sm mb-6 border border-blue-700/50">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            More than 25,000 teams use Briefly
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            We're here to
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Increase your
            </span>
            <span className="block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Productivity
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Centralized creative project management platform that streamlines collaboration between teams and clients. 
            Say goodbye to scattered communications and lost revisions.
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg shadow-blue-600/25">
              Get Started Free
            </button>
            <button className="bg-gray-800/80 backdrop-blur-sm text-gray-200 px-8 py-4 rounded-xl border-2 border-gray-700 hover:border-blue-500 transition-all font-semibold shadow-lg">
              Watch Demo
            </button>
          </div> */}
        </div>
        
        <div className="relative">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <Users className="text-blue-400" size={20} />
                  </div>
                  <span className="font-semibold text-white">Creative Team Portal</span>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="text-sm text-gray-300">Brief submitted successfully</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-400" size={16} />
                  <span className="text-sm text-gray-300">Revision tracking enabled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-orange-400" size={16} />
                  <span className="text-sm text-gray-300">Timeline updated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
export default Hero;
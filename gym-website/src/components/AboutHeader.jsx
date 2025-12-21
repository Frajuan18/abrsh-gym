import React from 'react';
import { Users, Target, Heart } from 'lucide-react';

const AboutHeader = () => {
  return (
    <div className="relative pt-28 pb-12 overflow-hidden">
      {/* Orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"></div>
      
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 translate-y-32"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            About Us
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Meet the team dedicated to your success
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                <Users size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-sm text-orange-100 font-medium">Expert Trainers</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                <Target size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-orange-100 font-medium">Success Rate</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                <Heart size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">5,000+</div>
              <div className="text-sm text-orange-100 font-medium">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default AboutHeader;
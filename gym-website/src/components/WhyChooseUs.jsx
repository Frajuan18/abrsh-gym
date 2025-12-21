import React from 'react';
import { Target, Users, Trophy, Sparkles, Star, Award, Shield, Heart, Zap, ArrowRight } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Target size={28} />,
      title: 'Personalized Programs',
      description: 'Custom fitness plans tailored to your goals and fitness level. Every program is uniquely designed for maximum results.',
      color: 'from-orange-500 to-orange-600',
      badge: 'Tailored'
    },
    {
      icon: <Users size={28} />,
      title: 'Expert Trainers',
      description: 'Certified professionals with years of experience. Our trainers are dedicated to your success and safety.',
      color: 'from-blue-500 to-blue-600',
      badge: 'Certified'
    },
    {
      icon: <Trophy size={28} />,
      title: 'Proven Results',
      description: 'Track record of helping clients achieve their goals. Join thousands who have transformed their lives.',
      color: 'from-emerald-500 to-emerald-600',
      badge: 'Guaranteed'
    }
  ];

  const stats = [
    { value: '98%', label: 'Client Satisfaction', icon: <Heart size={16} /> },
    { value: '15+', label: 'Years Experience', icon: <Award size={16} /> },
    { value: '5,000+', label: 'Success Stories', icon: <Sparkles size={16} /> },
    { value: '50+', label: 'Expert Trainers', icon: <Shield size={16} /> },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="text-orange-500" />
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Why Choose Us</span>
            <Sparkles className="text-orange-500" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                FitnessPro
              </span>
              <span className="absolute -top-2 -right-6">
                <Zap size={24} className="text-yellow-500 fill-yellow-500" />
              </span>
            </span>
            ?
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            We're committed to helping you achieve{' '}
            <span className="relative font-semibold text-gray-900">
              lasting results
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></span>
            </span>
          </p>

          {/* Stats Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg shadow-gray-200 group-hover:shadow-xl group-hover:shadow-gray-300 transition-all duration-300 mb-4 group-hover:-translate-y-1">
                    <div className="text-orange-600 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium group-hover:text-gray-700 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fancy Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Decorative connecting lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-blue-200 to-emerald-200 transform -translate-y-1/2"></div>
          
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              {/* Floating badge */}
              <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.badge}
              </div>
              
              {/* Main Card - Pure White Background */}
              <div className={`relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-300 h-full`}>
                
                {/* Card Content */}
                <div className="relative p-8">
                  {/* Icon Container */}
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-8 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  
                  {/* Simple divider */}
                  <div className="w-12 h-1 bg-gradient-to-r from-gray-200 to-transparent mb-8"></div>
                  
                  {/* Feature Highlights */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-gray-700">✓</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Quality</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-gray-700">★</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Expertise</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-gray-700">⚡</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Results</span>
                    </div>
                  </div>
                </div>
                
                {/* Card Footer - Light gray background */}
                <div className={`px-8 py-6 bg-gray-50 border-t border-gray-200 relative`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">Learn More</span>
                    <button className="text-gray-700 hover:text-gray-900 font-bold text-sm flex items-center group/button">
                      <span>Explore</span>
                      <ArrowRight size={16} className="ml-2 group-hover/button:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                
                {/* Border glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                     style={{
                       boxShadow: `0 0 20px 2px ${index === 0 ? '#fb923c' : index === 1 ? '#3b82f6' : '#10b981'}15`
                     }}>
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-orange-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-3 group-hover:right-3"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-orange-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-3 group-hover:left-3"></div>
            </div>
          ))}
        </div>

        
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
};

export default WhyChooseUs;
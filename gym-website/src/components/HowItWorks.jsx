import React from 'react';
import { Calendar, ClipboardCheck, FileText, Play, ArrowRight, Sparkles, Clock, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      title: 'Free Consultation',
      description: 'Schedule a free consultation to discuss your goals',
      icon: <Calendar size={24} />,
      color: 'from-orange-500 to-orange-600',
      duration: '15-20 min',
      details: 'Meet with our expert trainers to understand your needs'
    },
    {
      number: '2',
      title: 'Health Assessment',
      description: 'Complete our health questionnaire',
      icon: <ClipboardCheck size={24} />,
      color: 'from-blue-500 to-blue-600',
      duration: '10-15 min',
      details: 'Comprehensive evaluation of your current fitness level'
    },
    {
      number: '3',
      title: 'Custom Plan',
      description: 'Receive your personalized training program',
      icon: <FileText size={24} />,
      color: 'from-emerald-500 to-emerald-600',
      duration: '48 hours',
      details: 'Tailored workout and nutrition plan created just for you'
    },
    {
      number: '4',
      title: 'Start Training',
      description: 'Begin your transformation journey',
      icon: <Play size={24} />,
      color: 'from-purple-500 to-purple-600',
      duration: 'Ongoing',
      details: 'Regular sessions with progress tracking and adjustments'
    }
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      
     
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="text-orange-500" />
            <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Our Process</span>
            <Sparkles className="text-orange-500" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            How It{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Works
              </span>
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Getting started is{' '}
            <span className="relative font-semibold text-gray-900">
              easy
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></span>
            </span>
          </p>

          
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-4 gap-8 relative mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Number Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className={`text-2xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                  {step.number}
                </span>
              </div>
              
              {/* Step Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden group-hover:shadow-2xl group-hover:-translate-y-3 transition-all duration-300 h-full pt-8">
                {/* Card Content */}
                <div className="p-6">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-gray-800 transition-colors">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-center mb-4 group-hover:text-gray-700 transition-colors">
                    {step.description}
                  </p>
                  
                  {/* Duration Badge */}
                  <div className="inline-flex items-center justify-center w-full mb-6">
                    <div className="inline-flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">{step.duration}</span>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{step.details}</p>
                  </div>
                  
                  {/* Progress indicators */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md">
                        <ArrowRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Step Progress Line */}
                <div className="relative">
                  <div className={`h-1 bg-gradient-to-r ${step.color} opacity-20`}></div>
                  <div className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${step.color} w-0 group-hover:w-full transition-all duration-1000 ease-out`}></div>
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
          ))}
        </div>

       

       
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HowItWorks;
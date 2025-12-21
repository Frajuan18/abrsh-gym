import React from 'react';
import { ArrowRight, CheckCircle, Calendar, Sparkles } from 'lucide-react';

const ReadyToStartBanner = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50"></div>
      
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100 shadow-sm">
            <Sparkles size={16} className="text-orange-500" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Ready to Start Your{' '}
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Fitness Journey
            </span>
            ?
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Book your free consultation today and take the first step towards a{' '}
            <span className="relative font-semibold text-gray-900">
              healthier, stronger you
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></span>
            </span>
            .
          </p>

          {/* Features List */}
          <div className="max-w-md mx-auto mb-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">No commitment</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Expert trainers</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Personalized advice</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={14} className="text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">Learn programs</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button className="group relative bg-gradient-to-br from-orange-600 to-orange-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/25 hover:shadow-2xl hover:shadow-orange-600/40 hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-3">
            <Calendar size={20} />
            <span>Schedule Your Free Consultation</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Bottom text */}
          <p className="mt-6 text-sm text-gray-600">
            No credit card required • Limited spots available
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStartBanner;
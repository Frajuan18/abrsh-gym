import React from 'react';
import { Check, ArrowRight, Star, Target, Trophy, Users, Heart, Dumbbell, Clock, Award, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const specializations = [
    { title: 'Weight Loss', icon: <Target size={18} />, color: 'from-orange-500 to-orange-600' },
    { title: 'Muscle Building', icon: <Dumbbell size={18} />, color: 'from-blue-500 to-blue-600' },
    { title: 'Senior Fitness', icon: <Heart size={18} />, color: 'from-emerald-500 to-emerald-600' },
    { title: 'Sports Performance', icon: <Trophy size={18} />, color: 'from-purple-500 to-purple-600' },
    { title: 'Injury Recovery', icon: <Users size={18} />, color: 'from-amber-500 to-amber-600' },
    { title: 'Nutrition Coaching', icon: <Award size={18} />, color: 'from-rose-500 to-rose-600' },
    { title: 'Online Training', icon: <Clock size={18} />, color: 'from-cyan-500 to-cyan-600' },
    { title: 'In-Home Training', icon: <Star size={18} />, color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 pt-28 pb-16 lg:pt-36 lg:pb-20">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Content - Takes 7 columns */}
          <div className="lg:col-span-7 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                ))}
              </div>
              <span className="text-sm font-semibold">Rated 4.9/5 by 2,500+ Clients</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Body
              </span>
              , Transform Your{' '}
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Life
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl">
              Expert personal training and nutrition coaching tailored to your unique goals. 
              Start your fitness journey today with a free consultation.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {[
                'Certified Professional Trainers',
                'Personalized Workout Plans',
                'Nutrition & Diet Guidance',
                'Progress Tracking Tools',
                'Flexible Scheduling',
                'Money-Back Guarantee'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="group relative bg-gradient-to-br from-orange-600 to-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-600/25 hover:shadow-2xl hover:shadow-orange-600/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center space-x-3">
                  <span>Schedule Free Consultation</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </div>
              </button>
              
              <button className="group relative bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <span>Take Health Assessment</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="text-center px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-900 mb-1">5,000+</div>
                <div className="text-sm text-gray-600 font-medium">Happy Clients</div>
              </div>
              <div className="text-center px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-900 mb-1">15+</div>
                <div className="text-sm text-gray-600 font-medium">Years Experience</div>
              </div>
              <div className="text-center px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Specializations - Takes 5 columns */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Our Specializations
                </h2>
                <button className="text-orange-600 hover:text-orange-700 font-bold text-sm flex items-center group">
                  View All Services
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform ml-1" />
                </button>
              </div>

              {/* Specializations Grid - 4 columns x 2 rows */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Row 1 */}
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-2">
                    <Target size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Weight Loss</span>
                </div>
                
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2">
                    <Dumbbell size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Muscle Building</span>
                </div>
                
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2">
                    <Heart size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Senior Fitness</span>
                </div>
                
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Sports Performance</span>
                </div>

                {/* Row 2 */}
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-2">
                    <Users size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Injury Recovery</span>
                </div>
                
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-2">
                    <Award size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Nutrition Coaching</span>
                </div>
                
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-2">
                    <Clock size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">Online Training</span>
                </div>
                
                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2">
                    <Star size={20} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900 text-center text-sm">In-Home Training</span>
                </div>
              </div>

              {/* Callout Box */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Free Assessment Session</h3>
                      <p className="text-xs text-gray-700">Get started with no commitment</p>
                    </div>
                  </div>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
import React from 'react';
import { Target, Heart, Users, Award, Calendar, TrendingUp } from 'lucide-react';

const OurStory = () => {
  const milestones = [
    { year: '2015', title: 'Founded', desc: 'Started as a one-person operation', icon: <Calendar size={20} /> },
    { year: '2017', title: 'First Expansion', desc: 'Added 5 certified trainers', icon: <Users size={20} /> },
    { year: '2019', title: '500 Clients', desc: 'Reached milestone of 500 clients', icon: <Award size={20} /> },
    { year: '2022', title: 'Team Growth', desc: 'Grew to 50+ expert trainers', icon: <TrendingUp size={20} /> },
    { year: '2023', title: '5,000+ Success', desc: 'Helped 5,000+ clients transform', icon: <Heart size={20} /> },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Section Header */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-4 border border-orange-100">
                <Target size={16} className="text-orange-600" />
                <span className="text-sm font-semibold">Our Journey</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
            </div>

            {/* Story Content - NO VERTICAL LINE */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-900">FitnessPro Training</span> was founded in 2015 with a simple mission: to make professional fitness training accessible, effective, and personalized for everyone. What started as a one-person operation has grown into a team of dedicated fitness professionals serving hundreds of clients.
                </p>
              </div>
              
              <div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe that fitness is not one-size-fits-all. Every person has unique goals, challenges, and circumstances. That's why we take the time to understand your individual needs and create customized programs that work for your life.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mt-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Our Philosophy</h3>
                    <p className="text-gray-700">
                      Our approach combines evidence-based training methods with genuine care for our clients. We're not just here to count reps – we're here to support you through every step of your fitness journey, celebrating victories and working through challenges together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Milestones */}
          <div className="space-y-8">
            {/* Milestones Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Milestones</h3>
              
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative group">
                    {/* Timeline connector */}
                    {index < milestones.length - 1 && (
                      <div className="absolute left-7 top-14 bottom-0 w-0.5 bg-gray-200 group-last:hidden"></div>
                    )}
                    
                    <div className="flex items-start space-x-6">
                      {/* Year Circle */}
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">{milestone.year}</span>
                        </div>
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{milestone.title}</h4>
                        <p className="text-gray-600">{milestone.desc}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="text-orange-600">
                            {milestone.icon}
                          </div>
                          <span className="text-sm text-gray-500">Milestone achieved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">8+</div>
            <div className="text-gray-600 font-medium">Years of Excellence</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600 font-medium">Expert Trainers</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Client Satisfaction</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
            <div className="text-gray-600 font-medium">Success Stories</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
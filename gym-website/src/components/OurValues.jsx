import React from 'react';
import { Heart, Target, Award, Users } from 'lucide-react';

const OurValues = () => {
  const values = [
    {
      title: 'Client-Centered',
      description: 'Your goals, challenges, and progress are at the heart of everything we do.',
      icon: <Heart size={24} />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Results-Driven',
      description: 'We use proven methods and track progress to ensure you achieve real results.',
      icon: <Target size={24} />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Professional Excellence',
      description: 'All our trainers are certified professionals who stay current with industry standards.',
      icon: <Award size={24} />,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Community Focus',
      description: 'We build a supportive community where everyone feels welcome and motivated.',
      icon: <Users size={24} />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Our Values
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            The principles that guide everything we do at FitnessPro
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                <div className="text-white">
                  {value.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            These core values shape our approach to fitness and ensure we deliver the best experience for every client.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
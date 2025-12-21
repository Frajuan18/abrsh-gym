import React from 'react';
import { Award, CheckCircle, Shield, Star } from 'lucide-react';

const Certifications = () => {
  const certifications = [
    'NASM-CPT (National Academy of Sports Medicine)',
    'ACE-CPT (American Council on Exercise)',
    'CSCS (Certified Strength & Conditioning Specialist)',
    'Precision Nutrition Certified',
    'CPR/AED Certified',
    'TRX Certified',
    'Corrective Exercise Specialist',
    'Senior Fitness Specialist'
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white text-orange-700 px-4 py-2 rounded-full mb-4 border border-orange-100">
            <Award size={16} className="text-orange-600" />
            <span className="text-sm font-semibold">Certified Professionals</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Certifications & Credentials
          </h2>
          
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our team maintains the highest standards of professional certification and continuing education
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-200 hover:shadow-sm transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <span className="text-gray-900 font-medium">{cert}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Verified Credentials</h4>
              <p className="text-sm text-gray-600">All certifications are current and verified</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Star size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Continuing Education</h4>
              <p className="text-sm text-gray-600">Regular training to stay current</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Industry Standards</h4>
              <p className="text-sm text-gray-600">Meeting the highest industry requirements</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
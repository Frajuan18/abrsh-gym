import React from 'react';
import { Award, DollarSign, ThumbsUp, CheckCircle } from 'lucide-react';

const WhyWeRecommend = () => {
  const reasons = [
    {
      title: 'Quality Tested',
      description: 'Every product on this page has been personally tested and used by our trainers and clients. We only recommend products that meet our high standards for quality and effectiveness.',
      icon: <Award size={24} />,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      title: 'Value for Money',
      description: 'We understand that fitness equipment and supplements can be expensive. These products offer excellent value and will last through years of training.',
      icon: <DollarSign size={24} />,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Client Approved',
      description: 'Our clients love these products. We\'ve compiled this list based on years of feedback and results from people just like you.',
      icon: <ThumbsUp size={24} />,
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100">
            <CheckCircle size={16} className="text-orange-600" />
            <span className="text-sm font-semibold">Our Promise</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Why We Recommend These Products
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We stand behind every product on this page. Here's why you can trust our recommendations.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${reason.color} mb-6 mx-auto`}>
                {reason.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {reason.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default WhyWeRecommend;
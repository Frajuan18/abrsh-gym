import React from 'react';
import { PlusCircle, Scale, Utensils, Calculator, ChefHat, ArrowRight } from 'lucide-react';

const AddOnServices = () => {
  const addOns = [
    {
      name: 'Additional Training Session',
      price: '$85',
      description: 'Extra one-on-one training session',
      icon: <PlusCircle size={24} />,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      name: 'Nutrition Consultation',
      price: '$75',
      description: '30-minute personalized nutrition guidance',
      icon: <Utensils size={24} />,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      name: 'Body Composition Analysis',
      price: '$50',
      description: 'Detailed body fat and muscle mass assessment',
      icon: <Calculator size={24} />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      name: 'Custom Meal Plan',
      price: '$150',
      description: 'Personalized weekly meal plan with recipes',
      icon: <ChefHat size={24} />,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100 shadow-sm">
            <PlusCircle size={16} className="text-orange-600" />
            <span className="text-sm font-semibold">Enhance Your Training</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Add-On Services
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Enhance your training with additional services. Available to all clients.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {addOns.map((addOn, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100">
              {/* Icon */}
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${addOn.color} flex items-center justify-center`}>
                {addOn.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {addOn.name}
                  </h3>
                  <span className="text-2xl font-bold text-gray-900">{addOn.price}</span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {addOn.description}
                </p>
                
                <button className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors">
                  Add to Plan →
                </button>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default AddOnServices;
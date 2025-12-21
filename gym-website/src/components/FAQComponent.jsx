import React from 'react';
import { HelpCircle, RotateCcw, Users, CreditCard, FileText, MessageSquare } from 'lucide-react';

const FAQComponent = () => {
  const faqs = [
    {
      question: 'Can I cancel or change my plan?',
      answer: 'Yes, you can change or cancel your plan at any time with 30 days notice.',
      icon: <RotateCcw size={20} />,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      question: 'Do you offer couples or group training?',
      answer: 'Yes! We offer discounted rates for couples and small group training (up to 4 people).',
      icon: <Users size={20} />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and bank transfers. Monthly auto-pay is available.',
      icon: <CreditCard size={20} />,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      question: 'Is there a contract or commitment?',
      answer: 'No long-term contracts required. You can pay month-to-month, though we offer discounts for 3, 6, or 12-month commitments.',
      icon: <FileText size={20} />,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100">
            <HelpCircle size={16} className="text-orange-600" />
            <span className="text-sm font-semibold">FAQ</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Pricing FAQs
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Common questions about our pricing and plans
          </p>
        </div>

        {/* FAQ List - Flexible single column */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${faq.color} flex items-center justify-center`}>
                  {faq.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="flex items-center space-x-3 mb-3">
                  <MessageSquare size={24} className="text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Still have questions?
                  </h3>
                </div>
                <p className="text-gray-700">
                  Our team is here to help you find the perfect plan for your fitness goals.
                </p>
              </div>
              <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors whitespace-nowrap">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
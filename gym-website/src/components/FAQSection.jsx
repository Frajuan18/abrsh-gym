import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, FileText, ArrowRight } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How long are training sessions?',
      answer: 'Standard sessions are 60 minutes, with 30-minute options available.',
      category: 'Training'
    },
    {
      question: 'Do you offer online training?',
      answer: 'Yes! We offer both in-person and online training options.',
      category: 'Services'
    },
    {
      question: 'What if I have an injury?',
      answer: 'Our trainers are experienced in injury recovery and modification.',
      category: 'Safety'
    }
  ];

  const categories = [
    { name: 'Training', count: 12, icon: <MessageSquare size={18} /> },
    { name: 'Services', count: 8, icon: <FileText size={18} /> },
    { name: 'Safety', count: 6, icon: <HelpCircle size={18} /> },
    { name: 'Pricing', count: 10, icon: <MessageSquare size={18} /> },
  ];

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100">
            <HelpCircle size={16} className="text-orange-500" />
            <span className="text-sm font-semibold">Common Questions</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Get answers to{' '}
            <span className="relative font-semibold text-gray-900">
              common questions
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></span>
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - FAQ Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <HelpCircle className="text-orange-600 mr-3" />
                Browse by Category
              </h3>
              
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-orange-600 group-hover:text-orange-700">
                        {category.icon}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-gray-800">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              
            </div>
          </div>

          {/* Right Column - FAQ List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">?</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {faq.question}
                        </h3>
                        <div className="inline-flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </button>

                  {/* Answer */}
                  {openIndex === index && (
                    <div className="px-6 pb-6 animate-slideDown">
                      <div className="pl-14">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                        <button className="mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1">
                          <span>Read more</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
              <button className="group inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-bold text-lg">
                <span>View All FAQs</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

            
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default FAQSection;
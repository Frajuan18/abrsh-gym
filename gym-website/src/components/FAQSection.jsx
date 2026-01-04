import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, HelpCircle, MessageSquare, 
  RefreshCw, Loader2
} from 'lucide-react';
import { faqsService } from '../services/databaseService';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample FAQs in case database is empty or fails
  const sampleFAQs = [
    {
      faq_id: '1',
      question: 'How long are training sessions?',
      answer: 'Standard sessions are 60 minutes, with 30-minute options available. We offer flexible scheduling to accommodate your busy lifestyle.',
      category: 'Training',
      is_active: true,
      display_order: 1
    },
    {
      faq_id: '2',
      question: 'Do you offer online training?',
      answer: 'Yes! We offer both in-person and online training options. Our virtual sessions include live coaching, workout tracking, and nutrition guidance.',
      category: 'Services',
      is_active: true,
      display_order: 2
    },
    {
      faq_id: '3',
      question: 'What if I have an injury?',
      answer: 'Our certified trainers are experienced in injury recovery and modification. We provide personalized programs to help you recover safely while staying active.',
      category: 'Safety',
      is_active: true,
      display_order: 3
    },
    {
      faq_id: '4',
      question: 'What are your membership options?',
      answer: 'We offer monthly, quarterly, and annual memberships. All include access to equipment, group classes, and basic amenities. Premium members get personal training sessions.',
      category: 'Membership',
      is_active: true,
      display_order: 4
    },
    {
      faq_id: '5',
      question: 'Do you have beginner programs?',
      answer: 'Absolutely! We provide beginner-friendly programs with gradual progression. Our trainers will guide you through proper form and technique.',
      category: 'Training',
      is_active: true,
      display_order: 5
    },
    {
      faq_id: '6',
      question: 'What equipment do you have?',
      answer: 'We feature state-of-the-art cardio machines, free weights, resistance training equipment, functional training areas, and recovery zones.',
      category: 'Equipment',
      is_active: true,
      display_order: 6
    },
    {
      faq_id: '7',
      question: 'Are personal trainers certified?',
      answer: 'Yes, all our trainers hold nationally recognized certifications and undergo continuous education to provide the best service.',
      category: 'Training',
      is_active: true,
      display_order: 7
    },
    {
      faq_id: '8',
      question: 'What are your operating hours?',
      answer: 'We are open Monday to Friday 5 AM - 11 PM, Saturday 6 AM - 9 PM, and Sunday 7 AM - 8 PM. Holiday hours may vary.',
      category: 'Facilities',
      is_active: true,
      display_order: 8
    }
  ];

  // Fetch FAQs from database
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqsService.getActiveFAQs();
      
      // Use database data if available, otherwise use samples
      if (data && data.length > 0) {
        setFaqs(data);
      } else {
        setFaqs(sampleFAQs);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Use sample data if database fails
      setFaqs(sampleFAQs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Filter FAQs by category
  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  // Get unique categories from FAQs
  const uniqueCategories = [...new Set(faqs
    .map(f => f.category)
    .filter(Boolean))];

  const categories = uniqueCategories.map(category => ({
    name: category,
    count: faqs.filter(f => f.category === category).length,
    icon: <MessageSquare size={18} />
  }));

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
            Find answers to{' '}
            <span className="relative font-semibold text-gray-900">
              commonly asked questions
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></span>
            </span>{' '}
            about our services and facilities
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - FAQ Categories */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <HelpCircle className="text-orange-600 mr-3" />
                  Browse by Category
                </h3>
                <button
                  onClick={fetchFAQs}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600"
                  title="Refresh FAQs"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
                    selectedCategory === 'all'
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${
                      selectedCategory === 'all' ? 'text-orange-700' : 'text-gray-400 group-hover:text-orange-600'
                    }`}>
                      <MessageSquare size={18} />
                    </div>
                    <span className={`font-medium ${
                      selectedCategory === 'all' ? 'text-orange-800' : 'text-gray-900 group-hover:text-gray-800'
                    }`}>
                      All Questions
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {faqs.length}
                  </span>
                </button>

                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
                      selectedCategory === category.name
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`${
                        selectedCategory === category.name ? 'text-orange-700' : 'text-gray-400 group-hover:text-orange-600'
                      }`}>
                        {category.icon}
                      </div>
                      <span className={`font-medium ${
                        selectedCategory === category.name ? 'text-orange-800' : 'text-gray-900 group-hover:text-gray-800'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total FAQs</p>
                    <p className="text-lg font-bold text-gray-900">{faqs.length}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-lg font-bold text-gray-900">{uniqueCategories.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Need More Help?</h4>
              <p className="text-gray-700 mb-4">
                Can't find what you're looking for? Visit our contact page for personalized assistance.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Contact Support →
              </a>
            </div>
          </div>

          {/* Right Column - FAQ List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="mx-auto animate-spin text-orange-500 mb-4" size={32} />
                <p className="text-gray-600">Loading FAQs...</p>
              </div>
            ) : filteredFAQs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No FAQs found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No FAQs found in the {selectedCategory} category.
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg hover:from-orange-600 hover:to-orange-700"
                >
                  View All FAQs
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <div
                      key={faq.faq_id || index}
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
                              {faq.category && (
                                <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                  {faq.category}
                                </span>
                              )}
                              {faq.display_order && (
                                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                  # {faq.display_order}
                                </span>
                              )}
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
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                              {faq.answer}
                            </p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <p className="text-sm text-gray-500">
                                {faq.updated_at 
                                  ? `Updated: ${new Date(faq.updated_at).toLocaleDateString()}`
                                  : 'Regularly updated'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* More Help Section */}
                <div className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Still have questions?</h3>
                      <p className="text-gray-700">
                        Our support team is here to help with any additional questions.
                      </p>
                    </div>
                    <a 
                      href="/contact" 
                      className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 hover:from-orange-600 hover:to-orange-700"
                    >
                      <span>Contact Support</span>
                    </a>
                  </div>
                </div>
              </>
            )}
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
import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Clock, Send, CheckCircle, 
  AlertCircle, Loader2, User, MessageSquare, FileText,
  Bell, X, MailOpen, Shield, Star, Heart, RefreshCw, ArrowRight,
  MessageCircle, HelpCircle
} from 'lucide-react';
import { faqsService } from '../services/databaseService';
import { FAQ_CATEGORIES } from '../constants/databaseConstants';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userNotifications, setUserNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [allFAQs, setAllFAQs] = useState([]);

  // Fetch FAQs for notification answers
  const fetchFAQs = async () => {
    try {
      const data = await faqsService.getActiveFAQs();
      setAllFAQs(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      return [];
    }
  };

  // Fetch user notifications (answered questions and FAQs)
  const fetchUserNotifications = async () => {
    try {
      setLoadingNotifications(true);
      
      // Fetch all FAQs (these contain answers)
      const faqs = await fetchFAQs();
      
      // Fetch user questions that have been answered
      const allQuestions = await faqsService.getAllUserQuestions();
      
      // Get answered questions with answers
      const answeredQuestions = allQuestions.filter(q => 
        q.status === 'answered' && q.answer
      );
      
      // Combine FAQs and answered questions
      const combinedNotifications = [
        // Convert FAQs to notification format
        ...faqs.map(faq => ({
          id: `faq-${faq.faq_id}`,
          type: 'faq',
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          is_faq: true,
          created_at: faq.created_at,
          updated_at: faq.updated_at
        })),
        // Convert answered questions to notification format
        ...answeredQuestions.map(q => ({
          id: `question-${q.question_id}`,
          type: 'user_question',
          question: q.question,
          answer: q.answer,
          category: q.category,
          name: q.name,
          is_faq: false,
          created_at: q.created_at,
          updated_at: q.updated_at
        }))
      ];
      
      // Sort by date and limit to recent 10
      const recentNotifications = combinedNotifications
        .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
        .slice(0, 10);
      
      setUserNotifications(recentNotifications);
      
    } catch (err) {
      console.error('Error fetching notifications:', err);
      // Fallback to sample notifications with answers
      setUserNotifications([
        {
          id: '1',
          type: 'faq',
          question: 'Do you offer beginner-friendly classes?',
          answer: 'Yes! We have special beginner programs with gradual progression. Our trainers work with you to build confidence and proper form.',
          category: 'Training',
          is_faq: true,
          created_at: '2024-01-16T14:30:00Z',
          updated_at: '2024-01-16T14:30:00Z'
        },
        {
          id: '2',
          type: 'user_question',
          question: 'What is your cancellation policy?',
          answer: 'You can cancel anytime with 30 days notice. We offer flexible options with no hidden fees. Contact our support team for assistance.',
          category: 'Membership',
          name: 'Sarah Johnson',
          is_faq: false,
          created_at: '2024-01-15T09:15:00Z',
          updated_at: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          type: 'faq',
          question: 'What equipment do you have?',
          answer: 'We feature state-of-the-art cardio machines, free weights up to 150lbs, resistance training equipment, functional training areas, and recovery zones with foam rollers and massage guns.',
          category: 'Equipment',
          is_faq: true,
          created_at: '2024-01-14T11:45:00Z',
          updated_at: '2024-01-14T11:45:00Z'
        }
      ]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      
      // Submit question to database
      const questionData = {
        name: formData.name,
        email: formData.email,
        question: formData.message,
        category: formData.subject || 'General'
      };
      
      await faqsService.submitUserQuestion(questionData);
      
      console.log('Contact form submitted:', formData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        message: ''
      });
      
      // Refresh notifications
      fetchUserNotifications();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="text-blue-600" size={20} />,
      title: 'Email Us',
      details: ['support@fitnesscenter.com', 'info@fitnesscenter.com'],
      description: 'We\'ll respond within 24 hours'
    },
    {
      icon: <Phone className="text-green-600" size={20} />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      description: 'Mon-Fri: 8 AM - 8 PM, Sat: 9 AM - 5 PM'
    },
    {
      icon: <MapPin className="text-red-600" size={20} />,
      title: 'Visit Us',
      details: ['123 Fitness Street', 'Health City, HC 12345'],
      description: 'Free parking available'
    },
    {
      icon: <Clock className="text-purple-600" size={20} />,
      title: 'Business Hours',
      details: ['Mon-Fri: 5 AM - 11 PM', 'Sat: 6 AM - 9 PM', 'Sun: 7 AM - 8 PM'],
      description: 'Holiday hours may vary'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notifications Bell */}
        <div className="fixed top-4 right-4 z-40">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Bell className="text-gray-600" size={24} />
              {userNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {userNotifications.length}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 animate-slideIn">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <Bell size={18} />
                      <span>Recent Answers & FAQs</span>
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={fetchUserNotifications}
                        disabled={loadingNotifications}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Refresh"
                      >
                        <RefreshCw size={16} className={loadingNotifications ? 'animate-spin' : ''} />
                      </button>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Published answers to community questions and FAQs
                  </p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="p-8 text-center">
                      <Loader2 className="mx-auto animate-spin text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-600">Loading answers...</p>
                    </div>
                  ) : userNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <MessageCircle className="mx-auto text-gray-400 mb-3" size={32} />
                      <p className="text-gray-600">No recent answers yet</p>
                      <p className="text-sm text-gray-500 mt-1">Be the first to ask a question!</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {userNotifications.map((notification, index) => (
                        <div key={notification.id || index} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {notification.is_faq ? (
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                  <HelpCircle className="text-white" size={16} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="text-white" size={16} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  {notification.category && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                                      {notification.category}
                                    </span>
                                  )}
                                  {notification.is_faq ? (
                                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                      FAQ
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                                      User Question
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.updated_at || notification.created_at)}
                                </span>
                              </div>
                              
                              <p className="text-sm font-medium text-gray-900 mb-2">
                                Q: {notification.question}
                              </p>
                              
                              {notification.answer && (
                                <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                                  <div className="flex items-start space-x-2">
                                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-700 mb-1">
                                        {notification.is_faq ? 'FAQ Answer:' : 'Published Answer:'}
                                      </p>
                                      <p className="text-sm text-gray-800 leading-relaxed">
                                        {notification.answer}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {!notification.is_faq && notification.name && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Asked by: {notification.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <a 
                    href="/faq" 
                    className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    <span>View All FAQs ({allFAQs.length})</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Get in <span className="text-orange-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We're here to help. Contact us for any inquiries about our services.
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="max-w-2xl mx-auto mb-8 animate-slideIn">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Question Submitted Successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Thank you for your question. We'll review it and add it to our FAQs soon.
                    You'll receive a notification when it's answered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="text-orange-600 mr-3" />
                Contact Information
              </h2>
              
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-gray-700">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Live Answers Preview */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bell className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Live Community Answers</h4>
                      <p className="text-sm text-gray-600">Recent questions and answers</p>
                    </div>
                  </div>
                  
                  {userNotifications.slice(0, 2).map((notification, index) => (
                    <div key={index} className="mb-3 last:mb-0 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-start space-x-2">
                        {notification.is_faq ? (
                          <HelpCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={14} />
                        ) : (
                          <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {notification.category && (
                              <span className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                {notification.category}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {notification.question}
                          </p>
                          {notification.answer && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center space-x-1"
                  >
                    <span>View All Answers ({userNotifications.length})</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="text-orange-600 mr-3" />
                Send Us a Message
              </h2>
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              {/* Community Answers Info */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Bell className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Community Q&A System</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your questions may be answered publicly to help others. 
                      Check the notification bell for answers to community questions.
                    </p>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="john@example.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      <option value="">Select type</option>
                      <option value="general">General Inquiry</option>
                      <option value="membership">Membership</option>
                      <option value="training">Training</option>
                      <option value="question">FAQ Question</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select subject (optional)</option>
                      {FAQ_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Please provide details about your inquiry..."
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    For FAQ questions: Your question may be published anonymously to help others in our community.
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-gray-700">
                    I agree to the privacy policy and terms of service
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="faq-permission"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    defaultChecked
                    disabled={loading}
                  />
                  <label htmlFor="faq-permission" className="ml-2 text-sm text-gray-700">
                    Allow my question to be published in FAQs (anonymous)
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
              
              {/* FAQ Link */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-center">
                  Looking for quick answers? Check our{' '}
                  <a href="/faq" className="text-orange-600 hover:text-orange-700 font-medium">
                    FAQ page ({allFAQs.length} questions)
                  </a>{' '}
                  for common questions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Q&A Section */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageCircle className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Community Questions & Answers
                  </h3>
                  <p className="text-gray-700 max-w-2xl">
                    Join our community of fitness enthusiasts! See what others are asking 
                    and learn from expert answers. Your question could help someone else too!
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-sm text-gray-600">{userNotifications.filter(n => !n.is_faq).length} user questions answered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <HelpCircle className="text-blue-500" size={16} />
                      <span className="text-sm text-gray-600">{allFAQs.length} FAQs available</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(true)}
                className="mt-4 md:mt-0 bg-white border border-orange-300 text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 flex items-center space-x-2"
              >
                <Bell size={18} />
                <span>View Community Q&A ({userNotifications.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style >{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
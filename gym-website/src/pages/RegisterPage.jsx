import React, { useState } from 'react';
import { 
  CheckCircle, Star, Calendar, ArrowRight, Sparkles, Target, 
  Users, Zap, Shield, Award, DollarSign, ThumbsUp, ShoppingBag, 
  HelpCircle, PlusCircle, Utensils, Calculator, ChefHat, RotateCcw, 
  CreditCard, FileText, MessageSquare, Package, Loader2, AlertCircle
} from 'lucide-react';
import { usersService } from '../services/databaseService';
import { isValidEmail } from '../constants/databaseConstants';

const RegisterPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const pricingPlans = [
    {
      name: 'Starter',
      value: 'Starter',
      description: 'Perfect for beginners getting started',
      monthlyPrice: 199,
      yearlyPrice: 179,
      features: [
        '4 sessions per month',
        'Custom workout plan',
        'Nutrition guidelines',
        'Email support',
        'Progress tracking'
      ],
      popular: false,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      name: 'Pro',
      value: 'Pro',
      description: 'Most popular for serious results',
      monthlyPrice: 349,
      yearlyPrice: 299,
      features: [
        '8 sessions per month',
        'Custom workout & nutrition plan',
        'Weekly check-ins',
        'Priority support',
        'Progress tracking & adjustments',
        'Supplement recommendations'
      ],
      popular: true,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      name: 'Elite',
      value: 'Elite',
      description: 'Maximum support and accountability',
      monthlyPrice: 599,
      yearlyPrice: 499,
      features: [
        '12 sessions per month',
        'Fully customized programs',
        'Daily check-ins & support',
        '24/7 support access',
        'Advanced progress tracking',
        'Supplement & meal planning',
        'Group training option'
      ],
      popular: false,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

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

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    password: '',
    fitness_goals: '',
    plan: 2,
    status: 1,
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
    
    const planMapping = {
      'Starter': 1,
      'Pro': 2,
      'Elite': 3
    };
    
    setFormData(prev => ({
      ...prev,
      plan: planMapping[planName] || 2
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const userData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_no: formData.phone_no ? formData.phone_no.trim() : null,
        password: formData.password,
        plan: formData.plan,
        fitness_goals: formData.fitness_goals || '',
        status: 1,
        created_at: new Date().toISOString()
      };

      await usersService.createUser(userData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone_no: '',
        password: '',
        fitness_goals: '',
        plan: 2,
        status: 1,
        agreeToTerms: false
      });

    } catch (err) {
      console.error('❌ Registration error:', err);
      
      if (err.message.includes('duplicate key')) {
        setError('This email is already registered. Please use a different email.');
      } else if (err.message.includes('users table')) {
        setError('Registration system is currently unavailable. Please try again later.');
      } else {
        setError(`Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError('');
    setFormData({
      full_name: '',
      email: '',
      phone_no: '',
      password: '',
      fitness_goals: '',
      plan: 2,
      status: 1,
      agreeToTerms: false
    });
    setSelectedPlan('Pro');
    setBillingCycle('monthly');
  };

  // Success Message Component
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for registering with Fitness Pro! Your account has been created successfully.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Your account is now active</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Our team will contact you shortly</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Check your email for details</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={resetForm}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Register Another Person
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative pt-28 pb-12 overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Create Your Account
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Join our fitness community and start your transformation journey today
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {[
                { icon: <Target size={28} />, value: '8+', label: 'Service Types' },
                { icon: <Users size={28} />, value: '50+', label: 'Expert Trainers' },
                { icon: <Zap size={28} />, value: '98%', label: 'Success Rate' },
                { icon: <Calendar size={28} />, value: 'Flexible', label: 'Scheduling' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-orange-100 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form & Pricing */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Registration Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-4 border border-orange-100">
                  <CheckCircle size={16} className="text-orange-600" />
                  <span className="text-sm font-semibold">Get Started</span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Create Your Account
                </h2>
                <p className="text-gray-600">
                  Start your fitness journey in just a few minutes
                </p>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="1234567890"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="•••••••• (min 6 characters)"
                    required
                    disabled={loading}
                    minLength="6"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Plan *
                  </label>
                  <div className="space-y-3">
                    {pricingPlans.map((plan) => (
                      <div
                        key={plan.name}
                        onClick={() => !loading && handlePlanSelect(plan.name)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedPlan === plan.name
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${plan.color}`}>
                                {plan.name}
                              </span>
                              {plan.popular && (
                                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  Most Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                              <span className="text-sm text-gray-600">/month</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitness Goals
                  </label>
                  <textarea
                    name="fitness_goals"
                    value={formData.fitness_goals}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Tell us about your fitness goals and experience..."
                    disabled={loading}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    required
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    I agree to the Terms of Service and Privacy Policy *
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </form>
            </div>

            {/* Plan Details & Benefits */}
            <div>
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Plan Details & Benefits
                </h3>
                
                {pricingPlans
                  .find(plan => plan.name === selectedPlan)
                  ?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3 mb-4">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
              </div>

              {/* Billing Toggle */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Cycle</h4>
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => !loading && setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => !loading && setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    Yearly <span className="ml-1 text-orange-600 font-bold">Save 10%</span>
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Shield size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      30-Day Money-Back Guarantee
                    </h4>
                    <p className="text-gray-600">
                      Try our services risk-free. If you're not satisfied, get a full refund within 30 days.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Flexible Scheduling
                    </h4>
                    <p className="text-gray-600">
                      Book sessions at times that work for you. Morning, evening, and weekend appointments available.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Expert Trainer Matching
                    </h4>
                    <p className="text-gray-600">
                      We match you with a trainer who specializes in your specific goals and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add-On Services */}
      <div className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {addOns.map((addOn, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${addOn.color} flex items-center justify-center`}>
                  {addOn.icon}
                </div>
                
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

      {/* FAQ Section */}
      <div className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100 shadow-sm">
              <HelpCircle size={16} className="text-orange-600" />
              <span className="text-sm font-semibold">FAQ</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Common questions about our services and registration process
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${faq.color} flex items-center justify-center`}>
                    {faq.icon}
                  </div>
                  
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

      {/* Final CTA */}
      <div className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join hundreds of satisfied clients who have achieved their fitness goals with our expert guidance.
          </p>
          <button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors"
            disabled={loading}
          >
            <span>Complete Your Registration</span>
            <ArrowRight size={20} />
          </button>
          
          <div className="mt-8 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-white text-2xl font-bold mb-1">No Risk</div>
              <div className="text-gray-400 text-sm">30-Day Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-white text-2xl font-bold mb-1">Flexible</div>
              <div className="text-gray-400 text-sm">Cancel Anytime</div>
            </div>
            <div className="text-center">
              <div className="text-white text-2xl font-bold mb-1">Expert</div>
              <div className="text-gray-400 text-sm">Certified Trainers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Fitness Pro</h3>
              <p className="text-sm">
                Professional fitness training and coaching for individuals committed to achieving their health and wellness goals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Personal Training</li>
                <li>Nutrition Coaching</li>
                <li>Group Classes</li>
                <li>Online Coaching</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@fitnesspro.com</li>
                <li>(555) 123-4567</li>
                <li>123 Fitness Street</li>
                <li>Los Angeles, CA 90001</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Refund Policy</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Fitness Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
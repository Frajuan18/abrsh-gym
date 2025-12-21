import React, { useState } from 'react';
import { CheckCircle, Star, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const PricingComponent = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingPlans = [
    {
      name: 'Starter',
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
      cta: 'Get Started',
      popular: false,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      name: 'Pro',
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
      cta: 'Get Started',
      popular: true,
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    },
    {
      name: 'Elite',
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
      cta: 'Get Started',
      popular: false,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full mb-6 border border-orange-100">
            <Star size={16} className="text-orange-600" />
            <span className="text-sm font-semibold">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Select the perfect plan for your fitness journey. All plans include expert guidance.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly <span className="ml-1 text-orange-600 font-bold">Save 10%</span>
            </button>
          </div>
        </div>

        {/* Pricing Plans - Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border-2 ${
                plan.popular
                  ? 'border-orange-400 shadow-lg'
                  : 'border-gray-200'
              } ${plan.popular ? 'mt-4 lg:mt-0' : ''}`}
            >
              {/* Popular Badge - Fixed positioning */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full shadow-lg">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="fill-white" />
                      <span className="font-bold text-sm">Most Popular</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Plan Content */}
              <div className="p-8 pt-10">
                {/* Plan Header with adjusted padding for popular plan */}
                <div className={`flex items-start justify-between mb-6 ${plan.popular ? 'pt-2' : ''}`}>
                  <div>
                    <div className={`inline-flex items-center ${plan.color.replace('border-', 'border ')} px-3 py-1.5 rounded-full mb-3 border`}>
                      <span className="text-sm font-semibold">{plan.name}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  {/* Price - Moved to right */}
                  <div className="text-right">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {billingCycle === 'yearly' ? `Billed annually at $${plan.yearlyPrice * 12}` : 'Billed monthly'}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:shadow-md hover:scale-[1.02]'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-gray-600">
            All plans include a 30-day money-back guarantee. No contracts, cancel anytime.
          </p>
        </div>

        {/* FAQ - Clean Layout */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              What's included in every plan?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Certified personal trainers</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Progress tracking app</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Initial fitness assessment</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Need help choosing?</h4>
            <p className="text-gray-700 mb-6">
              Book a free consultation to discuss which plan is best for your goals.
            </p>
            <button className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold">
              <Calendar size={18} />
              <span>Book Free Consultation</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingComponent;
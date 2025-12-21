import React, { useState } from 'react';
import { 
  CheckCircle, Calendar, DollarSign, Star, Target, Dumbbell, 
  Heart, Trophy, Users, Award, Clock, Home, ArrowRight, 
  Scale, Brain, Shield, Zap, Activity, Droplets, Smartphone, MapPin
} from 'lucide-react';

const ServicesComponent = () => {
  const [activeService, setActiveService] = useState('weight-loss');

  const services = [
    { id: 'weight-loss', name: 'Weight Loss', icon: <Scale size={18} />, color: 'from-orange-500 to-orange-600' },
    { id: 'muscle-building', name: 'Muscle Building', icon: <Dumbbell size={18} />, color: 'from-blue-500 to-blue-600' },
    { id: 'senior-fitness', name: 'Senior Fitness', icon: <Heart size={18} />, color: 'from-emerald-500 to-emerald-600' },
    { id: 'sports-performance', name: 'Sports Performance', icon: <Trophy size={18} />, color: 'from-purple-500 to-purple-600' },
    { id: 'injury-recovery', name: 'Injury Recovery', icon: <Users size={18} />, color: 'from-amber-500 to-amber-600' },
    { id: 'nutrition-coaching', name: 'Nutrition Coaching', icon: <Award size={18} />, color: 'from-rose-500 to-rose-600' },
    { id: 'online-training', name: 'Online Training', icon: <Smartphone size={18} />, color: 'from-cyan-500 to-cyan-600' },
    { id: 'in-home-training', name: 'In-Home Training', icon: <Home size={18} />, color: 'from-indigo-500 to-indigo-600' },
  ];

  const serviceDetails = {
    'weight-loss': {
      title: 'Weight Loss',
      description: 'Sustainable fat loss programs designed for long-term success.',
      subtitle: 'Transform your body with science-backed nutrition and exercise strategies',
      features: [
        'Personalized calorie & macro targets',
        'Metabolic rate assessment',
        'Weekly progress tracking',
        'Behavior modification coaching',
        'Sustainable lifestyle changes'
      ],
      stats: [
        { label: 'Avg. Weight Loss', value: '15-25 lbs' },
        { label: 'Program Duration', value: '12-16 weeks' },
        { label: 'Success Rate', value: '94%' }
      ],
      pricing: 'From $99/month',
      cta: 'Start Your Transformation',
      icon: <Target size={20} />
    },
    'muscle-building': {
      title: 'Muscle Building',
      description: 'Science-based hypertrophy programs for maximum muscle growth.',
      subtitle: 'Build lean muscle with proper training and nutrition protocols',
      features: [
        'Customized workout splits',
        'Progressive overload planning',
        'Recovery optimization',
        'Supplement guidance',
        'Form technique analysis'
      ],
      stats: [
        { label: 'Avg. Muscle Gain', value: '8-12 lbs' },
        { label: 'Training Sessions', value: '3-5/week' },
        { label: 'Strength Increase', value: '30-50%' }
      ],
      pricing: 'From $129/month',
      cta: 'Build Your Strength',
      icon: <Dumbbell size={20} />
    },
    'senior-fitness': {
      title: 'Senior Fitness',
      description: 'Age-appropriate exercise programs for health and mobility.',
      subtitle: 'Maintain independence and vitality through safe, effective training',
      features: [
        'Balance & fall prevention',
        'Joint-friendly mobility work',
        'Bone density exercises',
        'Cognitive fitness activities',
        'Social fitness groups'
      ],
      stats: [
        { label: 'Avg. Age Group', value: '65+' },
        { label: 'Mobility Improvement', value: '85%' },
        { label: 'Balance Gain', value: '70%' }
      ],
      pricing: 'From $79/month',
      cta: 'Improve Mobility',
      icon: <Activity size={20} />
    },
    'sports-performance': {
      title: 'Sports Performance',
      description: 'Athlete-specific training to enhance performance.',
      subtitle: 'Elevate your game with sport-specific conditioning',
      features: [
        'Sport-specific skill drills',
        'Speed & agility training',
        'Power development',
        'Injury prevention protocols',
        'Competition preparation'
      ],
      stats: [
        { label: 'Performance Gain', value: '15-25%' },
        { label: 'Injury Reduction', value: '60%' },
        { label: 'Reaction Time', value: '20% faster' }
      ],
      pricing: 'From $149/month',
      cta: 'Enhance Performance',
      icon: <Zap size={20} />
    },
    'injury-recovery': {
      title: 'Injury Recovery',
      description: 'Rehabilitation and prevention programs.',
      subtitle: 'Return stronger with guided recovery and prevention strategies',
      features: [
        'Physical therapy integration',
        'Pain management techniques',
        'Gradual return protocols',
        'Prevention programming',
        'Medical team coordination'
      ],
      stats: [
        { label: 'Recovery Time', value: '30% faster' },
        { label: 'Re-injury Rate', value: '12%' },
        { label: 'Full Function', value: '92%' }
      ],
      pricing: 'From $119/month',
      cta: 'Start Recovery',
      icon: <Shield size={20} />
    },
    'nutrition-coaching': {
      title: 'Nutrition Coaching',
      description: 'Complete nutrition guidance for optimal health and performance.',
      subtitle: 'Fuel your body right with personalized eating strategies',
      features: [
        'Personalized meal planning',
        'Macro and calorie coaching',
        'Supplement recommendations',
        'Habit-based approach',
        'Weekly check-ins'
      ],
      stats: [
        { label: 'Meal Plans', value: 'Customized' },
        { label: 'Support', value: '24/7 Access' },
        { label: 'Client Success', value: '96%' }
      ],
      pricing: 'From $89/month',
      cta: 'Optimize Nutrition',
      icon: <Droplets size={20} />
    },
    'online-training': {
      title: 'Online Training',
      description: 'Virtual coaching sessions from anywhere.',
      subtitle: 'Professional guidance delivered directly to your home',
      features: [
        'Live virtual workout sessions',
        'App-based progress tracking',
        'Video form analysis',
        '24/7 chat support',
        'Weekly progress reviews'
      ],
      stats: [
        { label: 'Flexibility', value: '100%' },
        { label: 'Global Clients', value: '40+' },
        { label: 'Satisfaction', value: '95%' }
      ],
      pricing: 'From $69/month',
      cta: 'Start Online',
      icon: <Smartphone size={20} />
    },
    'in-home-training': {
      title: 'In-Home Training',
      description: 'Personal trainer comes to your home.',
      subtitle: 'Professional training in the comfort of your own space',
      features: [
        'Home equipment assessment',
        'Space-optimized workouts',
        'Equipment recommendations',
        'Family sessions available',
        'Flexible scheduling'
      ],
      stats: [
        { label: 'Travel Time', value: '0 minutes' },
        { label: 'Equipment', value: 'Provided' },
        { label: 'Convenience', value: '100%' }
      ],
      pricing: 'From $159/month',
      cta: 'Train at Home',
      icon: <MapPin size={20} />
    }
  };

  const activeDetails = serviceDetails[activeService];
  const currentService = services.find(s => s.id === activeService);

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full mb-4 border border-orange-100">
            <Target size={14} className="text-orange-600" />
            <span className="text-xs font-semibold">Expert Services</span>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Specializations
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Comprehensive fitness solutions tailored to your unique goals and lifestyle
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mr-2"></span>
                All Services
              </h3>
              
              <div className="space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      activeService === service.id
                        ? `bg-gradient-to-r ${service.color} text-white shadow-sm`
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-2 rounded-md ${
                      activeService === service.id ? 'bg-white/20' : 'bg-gray-100'
                    }`}>
                      <div className={activeService === service.id ? 'text-white' : 'text-gray-600'}>
                        {service.icon}
                      </div>
                    </div>
                    <span className="font-medium text-sm">{service.name}</span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                  <Brain size={16} className="mr-2 text-gray-600" />
                  Quick Stats
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Total Services</span>
                    <span className="font-bold text-gray-900 text-sm">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Expert Trainers</span>
                    <span className="font-bold text-gray-900 text-sm">50+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Success Rate</span>
                    <span className="font-bold text-gray-900 text-sm">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Service Header */}
              <div className={`bg-gradient-to-br ${currentService?.color} p-6 lg:p-8`}>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between">
                  <div className="mb-6 lg:mb-0 lg:pr-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        {activeDetails.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{activeDetails.title}</h3>
                        <p className="text-white/90 text-sm">{activeDetails.description}</p>
                      </div>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="flex flex-wrap gap-3">
                      {activeDetails.stats.map((stat, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="text-lg font-bold text-white mb-0.5">{stat.value}</div>
                          <div className="text-white/80 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white mb-1">{activeDetails.pricing}</div>
                      <div className="text-white/80 text-xs mb-3">Flexible plans available</div>
                      <div className="flex items-center justify-center space-x-0.5 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <button className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                        View Plans
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Content */}
              <div className="p-6 lg:p-8">
                
                {/* Subtitle */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{activeDetails.subtitle}</h4>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-gray-900">What's Included</h4>
                    <div className="flex-grow ml-4 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {activeDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={18} className="text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1 text-sm">Benefit {index + 1}</h4>
                          <p className="text-gray-700 text-sm">{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                      <div className="mb-4 lg:mb-0 lg:mr-6">
                        <h3 className="text-lg font-bold text-white mb-2">Ready to Get Started?</h3>
                        <p className="text-gray-300 text-sm">
                          Book a free consultation to discuss how this program can help you reach your goals.
                        </p>
                      </div>
                      <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg font-bold text-base hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 transition-all duration-200">
                        <Calendar size={18} />
                        <span>Schedule Free Consultation</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pricing Info */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <DollarSign size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Pricing Options</h3>
                        <p className="text-gray-700 text-sm">
                          Our {activeDetails.title.toLowerCase()} programs are available in various formats to fit your schedule and budget.
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center group">
                      <span>View All Pricing Options</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesComponent;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, CheckCircle, AlertCircle, Users, Target, Heart, 
  Activity, Zap, Shield, Mail, Phone, ChevronLeft, RefreshCw
} from 'lucide-react';
import { assessmentsService } from '../services/databaseService';
import { formatDate } from '../constants/databaseConstants';

const AssessmentStatus = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  // Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const data = await assessmentsService.getAssessmentWithResponses(assessmentId);
        setAssessment(data.assessment);
      } catch (err) {
        setError(`Failed to load assessment: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  // Check for updates
  const checkForUpdates = async () => {
    try {
      setChecking(true);
      const data = await assessmentsService.getAssessmentWithResponses(assessmentId);
      setAssessment(data.assessment);
      
      // If now reviewed, redirect to results
      if (data.assessment.status === 'reviewed' || data.assessment.status === 'completed') {
        setTimeout(() => {
          navigate(`/assessment/results/${assessmentId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error checking updates:', err);
    } finally {
      setChecking(false);
    }
  };

  // Auto-check every 30 seconds
  useEffect(() => {
    if (assessment?.status === 'pending') {
      const interval = setInterval(checkForUpdates, 30000);
      return () => clearInterval(interval);
    }
  }, [assessment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading assessment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = {
    pending: {
      title: 'Under Review',
      description: 'Our expert trainers are analyzing your assessment',
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      message: 'Your personalized fitness plan will be ready soon!'
    },
    reviewed: {
      title: 'Results Ready!',
      description: 'Your personalized fitness plan is complete',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      message: 'View your customized workout and nutrition plan'
    },
    contacted: {
      title: 'Being Contacted',
      description: 'Our team is reaching out to schedule your first session',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      message: 'Check your email for scheduling options'
    },
    scheduled: {
      title: 'Session Scheduled',
      description: 'Your first training session is booked',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      message: 'Get ready for your fitness journey!'
    }
  };

  const currentStatus = statusInfo[assessment?.status] || statusInfo.pending;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back to Home
        </button>

        {/* Status Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${currentStatus.color} rounded-full mb-6`}>
            <currentStatus.icon size={40} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {currentStatus.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentStatus.description}
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Assessment Details</h2>
              <p className="text-gray-600">{currentStatus.message}</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={checkForUpdates}
                disabled={checking || assessment?.status !== 'pending'}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium ${
                  assessment?.status === 'pending'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                <RefreshCw size={18} className={checking ? 'animate-spin' : ''} />
                <span>{checking ? 'Checking...' : 'Check for Updates'}</span>
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="flex justify-between mb-4">
              {['Submitted', 'Reviewing', 'Results Ready', 'Contact'].map((step, index) => {
                const isCompleted = 
                  (assessment?.status === 'pending' && index <= 1) ||
                  (assessment?.status === 'reviewed' && index <= 2) ||
                  (assessment?.status === 'contacted' && index <= 3);
                
                return (
                  <div key={index} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
            <div 
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 -z-10 transition-all duration-500"
              style={{ 
                width: assessment?.status === 'pending' ? '33%' :
                       assessment?.status === 'reviewed' ? '66%' :
                       assessment?.status === 'contacted' ? '100%' : '33%'
              }}
            ></div>
          </div>

          {/* Estimated Time */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center">
              <Clock className="text-blue-600 mr-3" size={24} />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Estimated Review Time</h3>
                <p className="text-gray-700">
                  Most assessments are reviewed within 24-48 hours. You'll receive an email notification when your results are ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Summary */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Assessment Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                  <Target size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Primary Goal</div>
                  <div className="font-medium text-gray-900">{assessment?.primary_goal || 'Not specified'}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                  <Activity size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Experience Level</div>
                  <div className="font-medium text-gray-900 capitalize">{assessment?.experience_level || 'Not specified'}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Motivation Level</div>
                  <div className="font-medium text-gray-900">{assessment?.motivation_level || 'N/A'}/10</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Submitted On</div>
                  <div className="font-medium text-gray-900">{formatDate(assessment?.created_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Mail className="mr-2 text-blue-600" size={20} />
                Email Support
              </h3>
              <p className="text-gray-700 mb-2">For questions about your assessment:</p>
              <a href="mailto:assessments@fitnesspro.com" className="text-blue-600 hover:text-blue-800 font-medium">
                assessments@fitnesspro.com
              </a>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Phone className="mr-2 text-blue-600" size={20} />
                Phone Support
              </h3>
              <p className="text-gray-700 mb-2">Available 9 AM - 6 PM EST:</p>
              <a href="tel:1-800-FITNESS" className="text-blue-600 hover:text-blue-800 font-medium">
                1-800-FITNESS
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentStatus;
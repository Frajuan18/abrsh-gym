import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, Award, Target, Calendar, CheckCircle, Download, 
  Share2, Star, Users, Heart, Zap, Clock, Dumbbell, Scale,
  Activity, User, Mail, Phone, ChevronRight, AlertCircle,
  TrendingUp, BarChart3, Shield, Crown, MessageSquare, Edit2,
  Lock, EyeOff
} from 'lucide-react';
import { assessmentsService } from '../services/databaseService';
import { formatCurrency, formatDate } from '../constants/databaseConstants';

const AssessmentResults = () => {
  const { assessmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [responses, setResponses] = useState([]);
  const [hasAdminResponse, setHasAdminResponse] = useState(false);

  // Check if we have direct data or need to fetch
  useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        setLoading(true);
        
        let assessment, assessmentResponses;
        
        if (assessmentId) {
          // Fetch from database using ID
          const result = await assessmentsService.getAssessmentWithResponses(assessmentId);
          assessment = result.assessment;
          assessmentResponses = result.responses;
        } else if (location.state?.assessmentData) {
          // Use direct data (new submission)
          assessment = location.state.assessmentData;
          
          // Try to find this assessment in database by email
          if (assessment.email) {
            try {
              const userAssessments = await assessmentsService.searchAssessments(assessment.email);
              if (userAssessments.length > 0) {
                const latest = userAssessments.sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )[0];
                const result = await assessmentsService.getAssessmentWithResponses(latest.assessment_id);
                assessment = result.assessment;
                assessmentResponses = result.responses;
              }
            } catch (searchError) {
              console.warn('Could not find assessment in database:', searchError);
            }
          }
        } else {
          // No data available
          setError('No assessment data found');
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        setAssessmentData(assessment);
        setResponses(assessmentResponses || []);
        
        // Check if assessment has been reviewed by admin
        const isReviewed = assessment?.status === 'reviewed' || assessment?.status === 'completed';
        const hasResponses = assessmentResponses?.length > 0;
        setHasAdminResponse(isReviewed || hasResponses);
        
        // If not reviewed and we have ID, show status page instead
        if (!isReviewed && !hasResponses && assessmentId) {
          navigate(`/assessment/status/${assessmentId}`);
          return;
        }
        
      } catch (err) {
        setError(`Failed to load assessment: ${err.message}`);
        console.error('Error loading assessment:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessmentData();
  }, [assessmentId, location.state, navigate]);

  // Generate recommendations based on data
  const generateRecommendations = () => {
    if (!assessmentData) return {};
    
    // If we have admin responses, use those
    if (responses.length > 0) {
      const workoutResponse = responses.find(r => r.section_name === 'workout')?.response_text;
      const nutritionResponse = responses.find(r => r.section_name === 'nutrition')?.response_text;
      const recommendationResponse = responses.find(r => r.section_name === 'full_review')?.response_text;
      
      return {
        workoutPlan: workoutResponse || 'Custom workout plan will be provided by your trainer.',
        nutrition: nutritionResponse || 'Personalized nutrition guidance based on your goals.',
        nextSteps: [
          'Your trainer will contact you within 24 hours',
          'Review your personalized workout plan',
          'Schedule your first training session',
          'Download the Fitness Pro app for tracking'
        ]
      };
    }
    
    // Otherwise generate based on data
    const recommendations = {
      workoutPlan: {
        frequency: assessmentData.weeklyAvailability ? `${Math.min(5, Math.max(3, Math.floor(assessmentData.weeklyAvailability / 2)))} days/week` : '4 days/week',
        duration: '45-60 minutes/session',
        focus: assessmentData.primaryGoal || 'Overall Fitness',
        intensity: assessmentData.experienceLevel === 'beginner' ? 'Moderate' : 'High'
      },
      nutrition: {
        calories: '2,000-2,200 kcal/day',
        protein: '120-140g/day',
        carbs: '200-250g/day',
        fats: '60-70g/day'
      },
      nextSteps: [
        'Schedule your free consultation with a certified trainer',
        'Download the Fitness Pro mobile app for tracking',
        'Join our beginner-friendly group classes',
        'Get your personalized meal plan'
      ]
    };
    return recommendations;
  };
  
  const recommendations = generateRecommendations();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading your assessment results...</p>
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
            className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
            hasAdminResponse 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
              : 'bg-gradient-to-br from-yellow-500 to-orange-600'
          }`}>
            {hasAdminResponse ? (
              <CheckCircle size={40} className="text-white" />
            ) : (
              <Lock size={40} className="text-white" />
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {hasAdminResponse ? 'Your Fitness Assessment Results' : 'Assessment Results Pending'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {hasAdminResponse 
              ? 'Here is your personalized fitness plan from our trainers'
              : 'Our expert trainers are reviewing your assessment. Results will be available soon!'}
          </p>
          
          {/* Status Badge */}
          <div className={`inline-flex items-center mt-6 px-4 py-2 rounded-full border ${
            hasAdminResponse 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${hasAdminResponse ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
            <span className="font-medium">
              {hasAdminResponse ? 'Results Ready' : 'Under Review'}
            </span>
          </div>
        </div>
        
        {/* Results Content - Only show if admin has responded */}
        {hasAdminResponse ? (
          <div className="space-y-8">
            {/* User Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="mr-3 text-blue-500" size={24} />
                Your Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-medium text-gray-900">{assessmentData?.user_name || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center">
                    <Mail size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-900">{assessmentData?.user_email || 'Not provided'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Primary Goal</div>
                    <div className="font-medium text-gray-900">{assessmentData?.primary_goal || 'Overall Fitness'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Responses */}
            {responses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MessageSquare className="mr-3 text-green-500" size={24} />
                    Trainer's Recommendations
                  </h2>
                  <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <CheckCircle size={14} className="mr-1" />
                    Reviewed by Trainer
                  </div>
                </div>
                
                <div className="space-y-6">
                  {responses.map((response, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                            <User size={18} className="text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">Trainer Response</div>
                            <div className="text-sm text-gray-600">
                              {formatDate(response.created_at, true)}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 bg-white text-green-800 rounded-full border border-green-200 capitalize">
                          {response.section_name.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                        {response.response_text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workout Plan */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Dumbbell className="mr-3 text-blue-500" size={24} />
                Your Custom Workout Plan
              </h2>
              
              <div className="space-y-6">
                {typeof recommendations.workoutPlan === 'string' ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-line font-sans text-gray-800">
                      {recommendations.workoutPlan}
                    </pre>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-3">Weekly Schedule</h3>
                      <ul className="space-y-3">
                        {['Monday: Full Body Strength', 'Tuesday: Cardio & Core', 'Wednesday: Active Recovery', 'Thursday: Strength Training', 'Friday: HIIT Cardio', 'Saturday: Flexibility & Mobility', 'Sunday: Rest Day'].map((day, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle size={16} className="text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{day}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-bold text-gray-900 mb-3">Key Exercises</h3>
                      <ul className="space-y-3">
                        {['Squats & Lunges', 'Push-ups Variations', 'Plank Variations', 'Deadlifts', 'Rows & Pull-ups', 'Core Activation'].map((exercise, idx) => (
                          <li key={idx} className="flex items-center">
                            <Star size={16} className="text-yellow-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{exercise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-3">
                <Calendar size={20} />
                <span>Schedule First Session</span>
              </button>
              
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-3">
                <Download size={20} />
                <span>Download Plan (PDF)</span>
              </button>
              
              <button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-gray-900/30 transition-all flex items-center justify-center space-x-3"
              >
                <ChevronRight size={20} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        ) : (
          /* Pending Results View */
          <div className="text-center py-12">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <EyeOff size={48} className="text-yellow-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Are Being Prepared</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Our certified trainers are carefully reviewing your assessment to create a personalized fitness plan tailored to your goals and needs.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-lg mx-auto mb-8">
              <div className="flex items-start">
                <Clock className="text-yellow-600 mr-3 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">What's happening now?</h3>
                  <ul className="text-gray-700 space-y-2 text-left">
                    <li className="flex items-start">
                      <CheckCircle size={14} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Your assessment has been received</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={14} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Being reviewed by our expert trainers</span>
                    </li>
                    <li className="flex items-start">
                      <Clock size={14} className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Personalized plan is being created</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg font-medium"
              >
                Return to Homepage
              </button>
              
              <button
                onClick={() => navigate('/assessment')}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-200 font-medium"
              >
                Take Another Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentResults;
import React, { useState, useEffect } from 'react';
import { 
  Users, Target, Heart, Calendar, Clock, Mail, Phone, Star, 
  CheckCircle, XCircle, AlertCircle, Edit2, Trash2, Eye,
  MessageSquare, Send, Filter, Search, ChevronRight, ChevronDown,
  BarChart3, TrendingUp, Award, Dumbbell, Scale, Activity,
  Zap, User, Shield, Crown, Bell, Flag, MoreVertical,
  RefreshCw, Download, EyeOff
} from 'lucide-react';
import { assessmentsService } from '../../../services/databaseService';
import { formatDate, truncateText } from '../../../constants/databaseConstants';

const AssessmentsManager = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  
  // Response form
  const [responseForm, setResponseForm] = useState({
    responseText: '',
    responseType: 'recommendation',
    sectionName: 'full_review'
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
    today: 0,
    thisWeek: 0,
    avgMotivation: 0
  });

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'reviewed', label: 'Reviewed', color: 'green' },
    { value: 'contacted', label: 'Contacted', color: 'blue' },
    { value: 'scheduled', label: 'Scheduled', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'green' },
  ];

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [assessmentsData, statsData] = await Promise.all([
        assessmentsService.getAllAssessments(),
        assessmentsService.getAssessmentStats()
      ]);
      
      setAssessments(assessmentsData || []);
      setStats(statsData || {});
      setError(null);
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleViewDetails = async (assessment) => {
    try {
      const fullAssessment = await assessmentsService.getAssessmentWithResponses(assessment.assessment_id);
      setSelectedAssessment(fullAssessment);
      setShowDetailsModal(true);
    } catch (err) {
      setError(`Failed to load details: ${err.message}`);
    }
  };

  const handleSubmitResponse = async () => {
    try {
      if (!selectedAssessment || !responseForm.responseText.trim()) return;
      
      setLoading(true);
      
      // Add response
      await assessmentsService.addAssessmentResponse(
        selectedAssessment.assessment.assessment_id,
        {
          ...responseForm,
          respondedBy: 'Admin'
        }
      );
      
      // Update assessment status to reviewed
      await assessmentsService.updateAssessment(
        selectedAssessment.assessment.assessment_id,
        { status: 'reviewed' }
      );
      
      // Refresh data
      fetchAllData();
      
      // Reset form
      setResponseForm({
        responseText: '',
        responseType: 'recommendation',
        sectionName: 'full_review'
      });
      
      setShowDetailsModal(false);
      alert('Response submitted successfully! User has been notified.');
      
    } catch (err) {
      setError(`Failed to submit response: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (assessmentId, newStatus) => {
    try {
      setLoading(true);
      await assessmentsService.updateAssessment(assessmentId, { status: newStatus });
      fetchAllData();
      alert('Status updated successfully!');
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Delete this assessment? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      await assessmentsService.deleteAssessment(assessmentId);
      fetchAllData();
      alert('Assessment deleted successfully!');
    } catch (err) {
      setError(`Failed to delete: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status) || statusOptions[0];
    
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[statusInfo.color]}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Filter assessments
  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = searchTerm === '' || 
      assessment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.primary_goal?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Render assessment details
  const renderAssessmentDetails = () => {
    if (!selectedAssessment) return null;
    
    const assessment = selectedAssessment.assessment;
    
    return (
      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{assessment.user_name}</h3>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center text-gray-600">
                    <Mail size={14} className="mr-1" />
                    <span className="text-sm">{assessment.user_email}</span>
                  </div>
                  {assessment.user_phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={14} className="mr-1" />
                      <span className="text-sm">{assessment.user_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(assessment.status)}
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                assessment.priority === 'high' ? 'bg-red-100 text-red-800' :
                assessment.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {assessment.priority || 'normal'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Age & Gender</div>
              <div className="font-medium text-gray-900">
                {assessment.user_age || 'N/A'} • {assessment.user_gender || 'Not specified'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Motivation Level</div>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${(assessment.motivation_level || 0) * 10}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900">{assessment.motivation_level || 0}/10</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Submitted</div>
              <div className="font-medium text-gray-900">
                {formatDate(assessment.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Target size={20} className="mr-2 text-red-500" />
                Goals & Metrics
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Primary Goal</div>
                  <div className="font-medium text-gray-900 bg-blue-50 px-3 py-2 rounded-lg">
                    {assessment.primary_goal || 'Not specified'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Experience Level</div>
                    <div className="font-medium text-gray-900 capitalize">
                      {assessment.experience_level || 'Not specified'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Weekly Availability</div>
                    <div className="font-medium text-gray-900">
                      {assessment.weekly_availability_hours || 'N/A'} hours
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity size={20} className="mr-2 text-orange-500" />
                Physical Metrics
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Height</div>
                  <div className="font-medium text-gray-900">{assessment.height_cm || 'N/A'} cm</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Weight</div>
                  <div className="font-medium text-gray-900">{assessment.weight_kg || 'N/A'} kg</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">BMI</div>
                  <div className="font-medium text-gray-900">{assessment.bmi || 'N/A'}</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Waist</div>
                  <div className="font-medium text-gray-900">{assessment.waist_circumference_cm || 'N/A'} cm</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Heart size={20} className="mr-2 text-pink-500" />
                Lifestyle & Health
              </h4>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Activity Level</div>
                  <div className="font-medium text-gray-900">{assessment.activity_level || 'Not specified'}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Exercise Frequency</div>
                    <div className="font-medium text-gray-900">{assessment.exercise_frequency || 'Not specified'}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Sleep Hours</div>
                    <div className="font-medium text-gray-900">{assessment.sleep_hours || 'Not specified'}</div>
                  </div>
                </div>
                
                {assessment.health_conditions?.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Health Conditions</div>
                    <div className="flex flex-wrap gap-2">
                      {assessment.health_conditions.map((condition, idx) => (
                        <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {assessment.injuries && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Previous Injuries</div>
                    <div className="text-gray-900 text-sm">{assessment.injuries}</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Previous Responses */}
            {selectedAssessment.responses.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MessageSquare size={20} className="mr-2 text-green-500" />
                  Previous Responses
                </h4>
                
                <div className="space-y-3">
                  {selectedAssessment.responses.map((response, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDate(response.created_at, true)} • {response.response_type}
                      </div>
                      <div className="text-sm text-gray-900">{response.response_text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Response Form */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <MessageSquare size={20} className="mr-2 text-blue-500" />
            Add Response
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Type
              </label>
              <select
                value={responseForm.responseType}
                onChange={(e) => setResponseForm({...responseForm, responseType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="recommendation">Recommendation</option>
                <option value="workout_plan">Workout Plan</option>
                <option value="nutrition_plan">Nutrition Plan</option>
                <option value="feedback">General Feedback</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Response
              </label>
              <textarea
                value={responseForm.responseText}
                onChange={(e) => setResponseForm({...responseForm, responseText: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Provide personalized recommendations, workout plans, or nutrition advice..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={!responseForm.responseText.trim() || loading}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fitness Assessments</h1>
          <p className="text-gray-600">Review user assessments and provide personalized responses</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              // Export functionality
              const dataStr = JSON.stringify(assessments, null, 2);
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
              const exportFileDefaultName = `assessments_${new Date().toISOString().split('T')[0]}.json`;
              const linkElement = document.createElement('a');
              linkElement.setAttribute('href', dataUri);
              linkElement.setAttribute('download', exportFileDefaultName);
              linkElement.click();
            }}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg"
          >
            <Download size={18} />
            <span className="font-medium">Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="text-sm text-blue-600 mb-1">Total</div>
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
          <div className="text-sm text-yellow-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="text-sm text-green-600 mb-1">Reviewed</div>
          <div className="text-2xl font-bold text-green-700">{stats.reviewed}</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="text-sm text-purple-600 mb-1">Today</div>
          <div className="text-2xl font-bold text-purple-700">{stats.today}</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="text-sm text-orange-600 mb-1">Avg Motivation</div>
          <div className="text-2xl font-bold text-orange-700">{stats.avgMotivation || 0}/10</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, or goal..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('all');
              setSelectedPriority('all');
            }}
            className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} />
            <span className="ml-2">Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading assessments...</p>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No assessments found' : 'No assessments yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'User assessments will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssessments.map((assessment) => (
                  <tr key={assessment.assessment_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User size={18} className="text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {assessment.user_name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assessment.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {truncateText(assessment.primary_goal || 'No goal specified', 30)}
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        {assessment.motivation_level && (
                          <div className="flex items-center">
                            <Zap size={12} className="mr-1 text-yellow-500" />
                            <span>{assessment.motivation_level}/10</span>
                          </div>
                        )}
                        {assessment.experience_level && (
                          <div className="flex items-center">
                            <Award size={12} className="mr-1 text-blue-500" />
                            <span className="capitalize">{assessment.experience_level}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getStatusBadge(assessment.status)}
                        {assessment.status === 'pending' && (
                          <div className="text-xs text-gray-500">
                            Needs review
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(assessment.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleViewDetails(assessment)}
                          title="View & Respond"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1"
                          onClick={() => handleStatusUpdate(assessment.assessment_id, 
                            assessment.status === 'pending' ? 'reviewed' : 'completed'
                          )}
                          title="Mark as Reviewed"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteAssessment(assessment.assessment_id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assessment Details Modal */}
      {showDetailsModal && selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Assessment Review</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setResponseForm({
                      responseText: '',
                      responseType: 'recommendation',
                      sectionName: 'full_review'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {renderAssessmentDetails()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsManager;
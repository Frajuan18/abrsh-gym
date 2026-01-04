import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Clock, CheckCircle, XCircle, Eye,
  RefreshCw, AlertCircle, Loader2, Mail, User, Calendar,
  Check, X as XIcon, Search, Filter, Trash2, ArrowUpDown,
  FileText, MailOpen, Send, Plus, ArrowRight
} from 'lucide-react';
import { faqsService } from '../../../services/databaseService';
import { FAQ_CATEGORIES } from '../../../constants/databaseConstants';

const UserQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // For Answer Modal
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answerData, setAnswerData] = useState({
    answer: '',
    sendEmail: true,
    emailSubject: '',
    emailBody: ''
  });
  
  // For FAQ Creation Modal
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [faqData, setFaqData] = useState({
    question: '',
    answer: '',
    category: '',
    display_order: 0,
    is_active: true
  });

  // Fetch user questions from database
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await faqsService.getAllUserQuestions();
      setQuestions(data || []);
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
      // Fallback to sample data
      setQuestions([
        {
          question_id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          question: 'Do you offer beginner-friendly classes?',
          answer: 'Yes! We have special beginner programs with gradual progression.',
          category: 'Training',
          status: 'answered',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-16T14:30:00Z'
        },
        {
          question_id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          question: 'What is your cancellation policy for personal training?',
          category: 'Services',
          status: 'reviewed',
          created_at: '2024-01-14T14:30:00Z',
          updated_at: '2024-01-15T09:15:00Z'
        },
        {
          question_id: '3',
          name: 'Mike Wilson',
          email: 'mike@example.com',
          question: 'Do you have wheelchair accessible facilities?',
          category: 'Facilities',
          status: 'pending',
          created_at: '2024-01-13T09:15:00Z',
          updated_at: '2024-01-13T09:15:00Z'
        },
        {
          question_id: '4',
          name: 'Emily Chen',
          email: 'emily@example.com',
          question: 'What nutritional supplements do you recommend?',
          answer: 'We recommend consulting with our nutritionist for personalized supplement plans.',
          category: 'Nutrition',
          status: 'answered',
          created_at: '2024-01-12T11:45:00Z',
          updated_at: '2024-01-13T16:20:00Z'
        },
        {
          question_id: '5',
          name: 'David Brown',
          email: 'david@example.com',
          question: 'Can I pause my membership if I travel?',
          category: 'Membership',
          status: 'pending',
          created_at: '2024-01-11T16:20:00Z',
          updated_at: '2024-01-11T16:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      question.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: questions.length,
    pending: questions.filter(q => q.status === 'pending').length,
    reviewed: questions.filter(q => q.status === 'reviewed').length,
    answered: questions.filter(q => q.status === 'answered').length
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center space-x-1">
            <Clock size={12} />
            <span>Pending</span>
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center space-x-1">
            <Eye size={12} />
            <span>Reviewed</span>
          </span>
        );
      case 'answered':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center space-x-1">
            <CheckCircle size={12} />
            <span>Answered</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  // Handle Send Answer (Simulated Email)
  const handleSendAnswer = async () => {
    if (!selectedQuestion) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Sending answer to:', selectedQuestion.email);
      console.log('Answer:', answerData.answer);
      
      // Use the sendAnswerToUser method
      const result = await faqsService.sendAnswerToUser(
        selectedQuestion.question_id,
        answerData
      );
      
      console.log('Answer sent result:', result);
      
      // Update question status locally
      setQuestions(prev => prev.map(q => 
        q.question_id === selectedQuestion.question_id 
          ? { 
              ...q, 
              status: 'answered',
              answer: answerData.answer,
              updated_at: new Date().toISOString()
            } 
          : q
      ));
      
      setSuccess('Answer sent successfully to user!');
      setShowAnswerModal(false);
      setSelectedQuestion(null);
      setAnswerData({
        answer: '',
        sendEmail: true,
        emailSubject: '',
        emailBody: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Failed to send answer:', err);
      setError(`Failed to send answer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Create FAQ
  const handleCreateFAQ = async () => {
    if (!selectedQuestion) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Creating FAQ from question:', selectedQuestion.question);
      console.log('FAQ Data:', faqData);
      
      // Create FAQ in database
      const newFAQ = await faqsService.convertToFAQ(
        selectedQuestion.question_id,
        faqData.answer,
        faqData.category,
        faqData.display_order
      );
      
      console.log('FAQ created:', newFAQ);
      
      // Update question status locally
      setQuestions(prev => prev.map(q => 
        q.question_id === selectedQuestion.question_id 
          ? { 
              ...q, 
              status: 'answered',
              answer: faqData.answer,
              updated_at: new Date().toISOString()
            } 
          : q
      ));
      
      setSuccess('FAQ created successfully!');
      setShowFAQModal(false);
      setSelectedQuestion(null);
      setFaqData({
        question: '',
        answer: '',
        category: '',
        display_order: 0,
        is_active: true
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(`Failed to create FAQ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update only
  const handleStatusUpdate = async (questionId, newStatus) => {
    try {
      setLoading(true);
      await faqsService.updateQuestionStatus(questionId, newStatus);
      
      // Update local state
      setQuestions(prev => prev.map(q => 
        q.question_id === questionId ? { ...q, status: newStatus } : q
      ));
      
      setSuccess(`Question marked as ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete question
  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      setLoading(true);
      await faqsService.deleteUserQuestion(questionId);
      
      // Update local state
      setQuestions(prev => prev.filter(q => q.question_id !== questionId));
      setSuccess('Question deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError('Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  // Open Answer Modal
  const openAnswerModal = (question) => {
    setSelectedQuestion(question);
    setAnswerData({
      answer: question.answer || '',
      sendEmail: true,
      emailSubject: `Re: Your question about ${question.category || 'our services'}`,
      emailBody: `Dear ${question.name},\n\nThank you for your question. Here's our response:\n\n`
    });
    setShowAnswerModal(true);
  };

  // Open FAQ Modal
  const openFAQModal = (question) => {
    setSelectedQuestion(question);
    setFaqData({
      question: question.question,
      answer: question.answer || '',
      category: question.category || '',
      display_order: 0,
      is_active: true
    });
    setShowFAQModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Questions</h1>
          <p className="text-gray-600">Manage questions submitted by users</p>
        </div>
        <button
          onClick={fetchQuestions}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 mt-4 md:mt-0"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="font-medium">Refresh</span>
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg p-4 animate-slideIn">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle size={16} />
                <span className="font-medium">Success</span>
              </div>
              <p className="text-sm">{success}</p>
            </div>
            <button 
              onClick={() => setSuccess('')} 
              className="ml-4 text-green-800 hover:text-green-900"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <AlertCircle size={16} />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError('')} 
              className="ml-4 text-red-800 hover:text-red-900"
            >
              <XIcon size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Reviewed</p>
              <p className="text-2xl font-bold text-blue-700">{stats.reviewed}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Answered</p>
              <p className="text-2xl font-bold text-green-700">{stats.answered}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search questions by name, email, or content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="answered">Answered</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="mx-auto animate-spin text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Loading questions...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No user questions yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.map((question) => (
                  <tr key={question.question_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {truncateText(question.question, 80)}
                      </div>
                      {question.answer && (
                        <div className="mt-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          ✓ Answered
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{question.name}</div>
                      <div className="text-xs text-gray-500">{question.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {question.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {question.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(question.created_at)}
                      </div>
                      {question.updated_at !== question.created_at && (
                        <div className="text-xs text-gray-500">
                          Updated: {formatDate(question.updated_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(question.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openAnswerModal(question)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Send Answer to User"
                          disabled={loading}
                        >
                          <Send size={18} />
                        </button>
                        <button
                          onClick={() => openFAQModal(question)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Create FAQ from Question"
                          disabled={loading}
                        >
                          <Plus size={18} />
                        </button>
                        {question.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(question.question_id, 'reviewed')}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Mark as Reviewed"
                            disabled={loading}
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {question.status === 'reviewed' && (
                          <button
                            onClick={() => handleStatusUpdate(question.question_id, 'pending')}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Re-open"
                            disabled={loading}
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteQuestion(question.question_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                          disabled={loading}
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

      {/* Answer Modal - Send Answer to User */}
      {showAnswerModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Send Answer to User</h2>
                <button
                  onClick={() => {
                    setShowAnswerModal(false);
                    setSelectedQuestion(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* User Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedQuestion.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Mail size={14} />
                      <span>{selectedQuestion.email}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Original Question:</p>
                  <p className="text-gray-700 text-sm bg-white p-3 rounded border border-gray-200">
                    {selectedQuestion.question}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer *
                  </label>
                  <textarea
                    value={answerData.answer}
                    onChange={(e) => setAnswerData(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="5"
                    placeholder="Write your answer to the user..."
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={answerData.sendEmail}
                    onChange={(e) => setAnswerData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Send email notification to user
                  </label>
                </div>

                {answerData.sendEmail && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Subject
                      </label>
                      <input
                        type="text"
                        value={answerData.emailSubject}
                        onChange={(e) => setAnswerData(prev => ({ ...prev, emailSubject: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Email subject..."
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Body (Optional)
                      </label>
                      <textarea
                        value={answerData.emailBody}
                        onChange={(e) => setAnswerData(prev => ({ ...prev, emailBody: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Additional email content..."
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnswerModal(false);
                      setSelectedQuestion(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendAnswer}
                    disabled={!answerData.answer.trim() || loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Answer to User</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Creation Modal */}
      {showFAQModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Create FAQ from Question</h2>
                <button
                  onClick={() => {
                    setShowFAQModal(false);
                    setSelectedQuestion(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* Original Question */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">User's Question:</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedQuestion.question}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{selectedQuestion.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Mail size={14} />
                    <span>{selectedQuestion.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{formatDate(selectedQuestion.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FAQ Question (Edit if needed)
                  </label>
                  <textarea
                    value={faqData.question}
                    onChange={(e) => setFaqData(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FAQ Answer *
                  </label>
                  <textarea
                    value={faqData.answer}
                    onChange={(e) => setFaqData(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    placeholder="Write the answer that will appear in the FAQ..."
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={faqData.category}
                      onChange={(e) => setFaqData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      <option value="">Select Category</option>
                      {FAQ_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={faqData.display_order}
                      onChange={(e) => setFaqData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={faqData.is_active}
                    onChange={(e) => setFaqData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Publish FAQ immediately
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFAQModal(false);
                      setSelectedQuestion(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFAQ}
                    disabled={!faqData.answer.trim() || loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Creating FAQ...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        <span>Create FAQ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

export default UserQuestions;
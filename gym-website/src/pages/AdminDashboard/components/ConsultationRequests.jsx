import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  MessageSquare,
  Download,
  MoreVertical,
  ChevronDown,
  Calendar as CalendarIcon,
  PhoneCall,
  Mail as MailIcon,
  User as UserIcon,
  Target,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { consultationService } from '../../../services/databaseService';

const ConsultationRequests = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    thisWeek: 0
  });

  // Fetch consultations from Supabase
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationService.getAllConsultations();
      setConsultations(data || []);
      
      // Fetch stats
      const statsData = await consultationService.getConsultationStats();
      setStats(statsData);
    } catch (err) {
      setError(`Failed to load consultations: ${err.message}`);
      console.error('Error fetching consultations:', err);
      
      // Fallback to local storage
      const localData = JSON.parse(localStorage.getItem('consultation_requests') || '[]');
      setConsultations(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Update consultation status
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      const updated = await consultationService.updateConsultationStatus(id, newStatus);
      
      // Update local state
      setConsultations(prev => prev.map(c => 
        c.id === id ? updated : c
      ));
      
      // Update stats
      const statsData = await consultationService.getConsultationStats();
      setStats(statsData);
      
      setSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete consultation
  const handleDeleteConsultation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultation request?')) return;
    
    try {
      setLoading(true);
      await consultationService.deleteConsultation(id);
      
      // Update local state
      setConsultations(prev => prev.filter(c => c.id !== id));
      
      // Update stats
      const statsData = await consultationService.getConsultationStats();
      setStats(statsData);
      
      setSuccess('Consultation deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to delete consultation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // View details
  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailsModal(true);
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      consultation.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      contacted: { color: 'blue', icon: PhoneCall, label: 'Contacted' },
      scheduled: { color: 'purple', icon: CalendarIcon, label: 'Scheduled' },
      completed: { color: 'green', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'gray', icon: AlertCircle, label: status };
    const Icon = config.icon;
    
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Preferred Date', 'Preferred Time', 'Status', 'Submitted At', 'Goals'];
    const csvData = consultations.map(c => [
      c.full_name,
      c.email,
      c.phone,
      formatDate(c.preferred_date),
      c.preferred_time,
      c.status,
      formatDate(c.created_at),
      c.fitness_goals?.substring(0, 50) || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Requests</h1>
          <p className="text-gray-600">Manage free consultation requests from users</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchConsultations}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-800">✕</button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-800">✕</button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              <p className="text-xs text-blue-500 mt-1">{stats.today} today</p>
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

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Scheduled</p>
              <p className="text-2xl font-bold text-green-700">{stats.scheduled}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CalendarIcon className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-purple-700">{stats.completed}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="text-purple-600" size={24} />
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
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading consultations...</p>
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No consultations found' : 'No consultation requests yet'}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Requests will appear here when users submit them'}
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
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Date & Time
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
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center">
                          <UserIcon size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.full_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {consultation.id?.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1 mb-1">
                        <Mail size={14} className="text-gray-400" />
                        {consultation.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {consultation.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1 mb-1">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(consultation.preferred_date)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {consultation.preferred_time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(consultation.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(consultation.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(consultation)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <MoreVertical size={18} />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 hidden group-hover:block">
                            <div className="py-1">
                              <button
                                onClick={() => handleUpdateStatus(consultation.id, 'contacted')}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                              >
                                Mark as Contacted
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(consultation.id, 'scheduled')}
                                className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                              >
                                Mark as Scheduled
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(consultation.id, 'completed')}
                                className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                Mark as Completed
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(consultation.id, 'cancelled')}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Mark as Cancelled
                              </button>
                              <div className="border-t my-1"></div>
                              <button
                                onClick={() => handleDeleteConsultation(consultation.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete Request
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Consultation Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <UserIcon size={18} className="text-blue-500" />
                      {selectedConsultation.full_name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <MailIcon size={16} className="text-gray-400" />
                      {selectedConsultation.email}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <PhoneCall size={16} className="text-gray-400" />
                      {selectedConsultation.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Preferred Date
                    </label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <CalendarIcon size={16} className="text-gray-400" />
                      {formatDate(selectedConsultation.preferred_date)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Preferred Time
                    </label>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {selectedConsultation.preferred_time}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedConsultation.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Fitness Goals */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Target size={16} />
                  Fitness Goals
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-line">
                    {selectedConsultation.fitness_goals || 'No goals specified'}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-sm text-gray-500 space-y-1">
                <p>Request ID: {selectedConsultation.id}</p>
                <p>Submitted: {formatDate(selectedConsultation.created_at)}</p>
                {selectedConsultation.updated_at !== selectedConsultation.created_at && (
                  <p>Last Updated: {formatDate(selectedConsultation.updated_at)}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedConsultation.id);
                    setSuccess('ID copied to clipboard');
                    setTimeout(() => setSuccess(''), 2000);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Copy ID
                </button>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedConsultation.email}?subject=Follow-up on your consultation request`;
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reply via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRequests;
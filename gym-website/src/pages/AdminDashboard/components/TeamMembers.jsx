import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Users,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  UserCircle,
  Award
} from 'lucide-react';
import { teamMembersService } from '../../../services/databaseService';
import { 
  STATUS_CODES, 
  TEAM_POSITIONS,
  getStatusLabel, 
  getStatusColor,
  formatDate,
  isValidEmail
} from '../../../constants/databaseConstants';

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingMember, setEditingMember] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    email: '',
    phone: '',
    status: STATUS_CODES.ACTIVE_MEMBER,
    join_date: new Date().toISOString().split('T')[0],
    avatar_url: '',
    bio: ''
  });

  // Fetch team members from Supabase
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching team members...');
      const data = await teamMembersService.getAllTeamMembers();
      console.log('✅ Team members fetched:', data);
      setTeamMembers(data || []);
    } catch (err) {
      const errorMessage = `Failed to load team members: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('📤 Submitting team member form:', formData);
      
      // Validate email if provided
      if (formData.email && !isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone if provided (now stored as varchar/text)
      let phoneNumber = null;
      if (formData.phone) {
        // Basic validation - remove all non-digit characters and check length
        const numericOnly = formData.phone.replace(/\D/g, '');
        
        // Check if phone has at least 7 digits (minimum for a valid phone number)
        if (numericOnly.length < 7) {
          throw new Error('Phone number must have at least 7 digits');
        }
        
        // Check if phone is too long (max 20 characters including symbols)
        if (formData.phone.length > 20) {
          throw new Error('Phone number is too long (max 20 characters)');
        }
        
        phoneNumber = formData.phone.trim();
      }

      // Prepare data for Supabase
      const memberData = {
        full_name: formData.full_name,
        position: formData.position || '',
        email: formData.email || '',
        phone: phoneNumber,
        status: parseInt(formData.status),
        join_date: formData.join_date || null,
        avatar_url: formData.avatar_url || null,
        bio: formData.bio || '',
        created_at: new Date().toISOString()
      };

      console.log('📤 Data to insert:', memberData);

      let updatedMember;
      
      if (editingMember) {
        // Update existing team member
        console.log('🔄 Updating member ID:', editingMember.member_id);
        updatedMember = await teamMembersService.updateTeamMember(editingMember.member_id, memberData);
        console.log('✅ Member updated:', updatedMember);
        
        // Update local state
        setTeamMembers(prev => prev.map(m => 
          m.member_id === editingMember.member_id ? updatedMember : m
        ));
      } else {
        // Create new team member
        console.log('🆕 Creating new member');
        updatedMember = await teamMembersService.createTeamMember(memberData);
        console.log('✅ Member created:', updatedMember);
        
        // Update local state
        setTeamMembers(prev => [updatedMember, ...prev]);
      }
      
      // Reset form
      setFormData({
        full_name: '',
        position: '',
        email: '',
        phone: '',
        status: STATUS_CODES.ACTIVE_MEMBER,
        join_date: new Date().toISOString().split('T')[0],
        avatar_url: '',
        bio: ''
      });
      
      setEditingMember(null);
      setShowForm(false);
      setError(null);
      
      // Refresh the list
      fetchTeamMembers();
      
    } catch (err) {
      const errorMessage = `Failed to ${editingMember ? 'update' : 'create'} team member: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error saving team member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      setLoading(true);
      console.log('🗑️ Deleting member ID:', id);
      await teamMembersService.deleteTeamMember(id);
      
      // Update local state
      setTeamMembers(prev => prev.filter(member => member.member_id !== id));
      setError(null);
      console.log('✅ Member deleted successfully');
    } catch (err) {
      const errorMessage = `Failed to delete team member: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error deleting team member:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMember = (member) => {
    console.log('✏️ Editing member:', member);
    setEditingMember(member);
    setFormData({
      full_name: member.full_name || '',
      position: member.position || '',
      email: member.email || '',
      phone: member.phone || '',
      status: member.status || STATUS_CODES.ACTIVE_MEMBER,
      join_date: member.join_date ? member.join_date.split('T')[0] : new Date().toISOString().split('T')[0],
      avatar_url: member.avatar_url || '',
      bio: member.bio || ''
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (statusCode) => {
    const statusColor = getStatusColor(statusCode, 'team');
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const Icon = statusCode === STATUS_CODES.ACTIVE_MEMBER ? CheckCircle : 
                 statusCode === STATUS_CODES.INACTIVE_MEMBER ? XCircle : 
                 Clock;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[statusColor]}`}>
        <Icon size={12} />
        {getStatusLabel(statusCode, 'team')}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'TM';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = selectedPosition === 'all' || 
      member.position === selectedPosition;
    
    const matchesStatus = selectedStatus === 'all' || 
      member.status === parseInt(selectedStatus);
    
    return matchesSearch && matchesPosition && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === STATUS_CODES.ACTIVE_MEMBER).length,
    inactive: teamMembers.filter(m => m.status === STATUS_CODES.INACTIVE_MEMBER).length,
    onLeave: teamMembers.filter(m => m.status === STATUS_CODES.ON_LEAVE).length,
    withEmail: teamMembers.filter(m => m.email).length,
    trainers: teamMembers.filter(m => 
      m.position?.toLowerCase().includes('trainer') || 
      m.position?.toLowerCase().includes('coach')
    ).length
  };

  // Get unique positions from team members
  const uniquePositions = [...new Set(teamMembers
    .map(m => m.position)
    .filter(Boolean))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your gym staff and trainers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={fetchTeamMembers}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingMember(null);
              setFormData({
                full_name: '',
                position: '',
                email: '',
                phone: '',
                status: STATUS_CODES.ACTIVE_MEMBER,
                join_date: new Date().toISOString().split('T')[0],
                avatar_url: '',
                bio: ''
              });
              setShowForm(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <Plus size={18} />
            <span className="font-medium">Add Member</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="font-medium mb-1">Error</div>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="ml-4 text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Team</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Active Members</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Trainers/Coaches</p>
              <p className="text-2xl font-bold text-purple-700">{stats.trainers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">With Contact Info</p>
              <p className="text-2xl font-bold text-orange-700">{stats.withEmail}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Mail className="text-orange-600" size={24} />
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
            placeholder="Search members by name, position, or email..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Positions</option>
            {TEAM_POSITIONS.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
            {uniquePositions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value={STATUS_CODES.ACTIVE_MEMBER}>Active</option>
            <option value={STATUS_CODES.INACTIVE_MEMBER}>Inactive</option>
            <option value={STATUS_CODES.ON_LEAVE}>On Leave</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No team members found' : 'No team members yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Add your first team member to get started'}
            </p>
            <button
              onClick={() => {
                setEditingMember(null);
                setShowForm(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              <span>Add First Member</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
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
                {filteredMembers.map((member) => (
                  <tr key={member.member_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {member.avatar_url ? (
                          <div className="flex-shrink-0 h-12 w-12 mr-4">
                            <img
                              src={member.avatar_url}
                              alt={member.full_name}
                              className="h-12 w-12 rounded-full object-cover border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 border flex items-center justify-center hidden">
                              <span className="text-white font-medium">
                                {getInitials(member.full_name)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 mr-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {getInitials(member.full_name)}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.full_name || 'Unnamed Member'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.member_id}
                          </div>
                          {member.bio && (
                            <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                              {truncateText(member.bio, 50)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.position ? (
                        <div className="flex items-center gap-1">
                          <Briefcase size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {member.position}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No position</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {member.email && (
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Mail size={14} />
                            {member.email}
                          </div>
                        </div>
                      )}
                      {member.phone && (
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            {member.phone}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.join_date ? (
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(member.join_date)}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </div>
                      {member.created_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Added: {formatDate(member.created_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleEditMember(member)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteMember(member.member_id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          onClick={() => {/* Implement view */}}
                          title="View"
                        >
                          <Eye size={18} />
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

      {/* Add/Edit Team Member Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingMember(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select Position</option>
                      {TEAM_POSITIONS.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                      {uniquePositions.map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="john@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234567890 or +1-234-567-8900"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enter phone number with area code (e.g., 1234567890)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Join Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        name="join_date"
                        value={formData.join_date}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    >
                      <option value={STATUS_CODES.ACTIVE_MEMBER}>Active</option>
                      <option value={STATUS_CODES.INACTIVE_MEMBER}>Inactive</option>
                      <option value={STATUS_CODES.ON_LEAVE}>On Leave</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="url"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/avatar.jpg"
                        disabled={loading}
                      />
                    </div>
                    {formData.avatar_url && (
                      <div className="h-12 w-12 rounded-full overflow-hidden border">
                        <img
                          src={formData.avatar_url}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            parent.innerHTML = `
                              <div class="h-full w-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                <span class="text-white font-medium">${getInitials(formData.full_name)}</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Profile picture URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/Description
                  </label>
                  <textarea
                    rows="4"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description about the team member..."
                    disabled={loading}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingMember(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{editingMember ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingMember ? 'Update Member' : 'Add Member'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;

// Add missing helper function
const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
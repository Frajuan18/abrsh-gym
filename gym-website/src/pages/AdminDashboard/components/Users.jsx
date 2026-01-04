import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  User,
  Mail,
  Phone,
  Target,
  Key,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  UserCircle
} from 'lucide-react';
import { usersService } from '../../../services/databaseService';
import { 
  PLAN_TYPES, 
  STATUS_CODES,
  getPlanLabel, 
  getStatusLabel,
  getStatusColor,
  formatDate,
  isValidEmail
} from '../../../constants/databaseConstants';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    password: '',
    plan: PLAN_TYPES.BASIC,
    fitness_goals: '',
    status: STATUS_CODES.ACTIVE
  });

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching users...');
      const data = await usersService.getAllUsers();
      console.log('✅ Users fetched:', data);
      setUsers(data || []);
    } catch (err) {
      const errorMessage = `Failed to load users: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('📤 Submitting user form:', formData);
      
      // Validate email
      if (!isValidEmail(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate phone if provided
      let phoneNumber = null;
      if (formData.phone_no) {
        // Basic validation - remove all non-digit characters and check length
        const numericOnly = formData.phone_no.replace(/\D/g, '');
        
        // Check if phone has at least 7 digits (minimum for a valid phone number)
        if (numericOnly.length < 7) {
          throw new Error('Phone number must have at least 7 digits');
        }
        
        // Check if phone is too long (max 20 characters including symbols)
        if (formData.phone_no.length > 20) {
          throw new Error('Phone number is too long (max 20 characters)');
        }
        
        phoneNumber = formData.phone_no.trim();
      }

      // Validate password for new users
      if (!editingUser && (!formData.password || formData.password.length < 6)) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Prepare data for Supabase
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        phone_no: phoneNumber,
        plan: parseInt(formData.plan),
        fitness_goals: formData.fitness_goals || '',
        status: parseInt(formData.status),
        created_at: new Date().toISOString()
      };

      // Only include password for new users or when changing password
      if (!editingUser) {
        userData.password = formData.password;
      }

      console.log('📤 Data to insert/update:', userData);

      let updatedUser;
      
      if (editingUser) {
        // Update existing user
        console.log('🔄 Updating user ID:', editingUser.user_id);
        updatedUser = await usersService.updateUser(editingUser.user_id, userData);
        console.log('✅ User updated:', updatedUser);
        
        // Update local state
        setUsers(prev => prev.map(u => 
          u.user_id === editingUser.user_id ? updatedUser : u
        ));
      } else {
        // Create new user
        console.log('🆕 Creating new user');
        updatedUser = await usersService.createUser(userData);
        console.log('✅ User created:', updatedUser);
        
        // Update local state
        setUsers(prev => [updatedUser, ...prev]);
      }
      
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone_no: '',
        password: '',
        plan: PLAN_TYPES.BASIC,
        fitness_goals: '',
        status: STATUS_CODES.ACTIVE
      });
      
      setEditingUser(null);
      setShowForm(false);
      setError(null);
      
      // Refresh the list
      fetchUsers();
      
    } catch (err) {
      const errorMessage = `Failed to ${editingUser ? 'update' : 'create'} user: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      setLoading(true);
      console.log('🗑️ Deleting user ID:', id);
      await usersService.deleteUser(id);
      
      // Update local state
      setUsers(prev => prev.filter(user => user.user_id !== id));
      setError(null);
      console.log('✅ User deleted successfully');
    } catch (err) {
      const errorMessage = `Failed to delete user: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    console.log('✏️ Editing user:', user);
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone_no: user.phone_no || '',
      password: '', // Leave empty for editing (don't show existing password)
      plan: user.plan || PLAN_TYPES.BASIC,
      fitness_goals: user.fitness_goals || '',
      status: user.status || STATUS_CODES.ACTIVE
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
    const statusColor = getStatusColor(statusCode);
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const Icon = statusCode === STATUS_CODES.ACTIVE ? CheckCircle : 
                 statusCode === STATUS_CODES.INACTIVE ? XCircle : 
                 UserCircle;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[statusColor]}`}>
        <Icon size={12} />
        {getStatusLabel(statusCode)}
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fitness_goals?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone_no && user.phone_no.toString().includes(searchTerm));
    
    const matchesStatus = selectedStatus === 'all' || 
      user.status === parseInt(selectedStatus);
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === STATUS_CODES.ACTIVE).length,
    inactive: users.filter(u => u.status === STATUS_CODES.INACTIVE).length,
    withPlan: users.filter(u => u.plan).length,
    withGoals: users.filter(u => u.fitness_goals).length,
    recent: users.filter(u => {
      if (!u.created_at) return false;
      const created = new Date(u.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created > weekAgo;
    }).length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage gym members and user accounts</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setFormData({
                full_name: '',
                email: '',
                phone_no: '',
                password: '',
                plan: PLAN_TYPES.BASIC,
                fitness_goals: '',
                status: STATUS_CODES.ACTIVE
              });
              setShowForm(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <Plus size={18} />
            <span className="font-medium">Add User</span>
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
              <p className="text-sm text-blue-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Active Users</p>
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
              <p className="text-sm text-purple-600 mb-1">With Goals</p>
              <p className="text-2xl font-bold text-purple-700">{stats.withGoals}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Target className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">New This Week</p>
              <p className="text-2xl font-bold text-orange-700">{stats.recent}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
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
            placeholder="Search users by name, email, or goals..."
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
            <option value={STATUS_CODES.ACTIVE}>Active</option>
            <option value={STATUS_CODES.INACTIVE}>Inactive</option>
            <option value={STATUS_CODES.PENDING}>Pending</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <User className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No users found' : 'No users yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Add your first user to get started'}
            </p>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowForm(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              <span>Add First User</span>
            </button>
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan & Goals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {getInitials(user.full_name)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Unnamed User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.user_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          {user.email || 'No email'}
                        </div>
                      </div>
                      {user.phone_no && (
                        <div className="text-sm text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Phone size={14} />
                            {user.phone_no}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getPlanLabel(user.plan)}
                      </div>
                      {user.fitness_goals && (
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {user.fitness_goals}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(user.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleEditUser(user)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteUser(user.user_id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          onClick={() => {
                            // View user details - could open a detail view modal
                            console.log('Viewing user:', user);
                          }}
                          title="View Details"
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

      {/* Add/Edit User Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
                    Email *
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
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="1234567890 or +1-234-567-8900"
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
                      <option value={STATUS_CODES.ACTIVE}>Active</option>
                      <option value={STATUS_CODES.INACTIVE}>Inactive</option>
                      <option value={STATUS_CODES.PENDING}>Pending</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan
                    </label>
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value={PLAN_TYPES.BASIC}>Basic</option>
                      <option value={PLAN_TYPES.STANDARD}>Standard</option>
                      <option value={PLAN_TYPES.PREMIUM}>Premium</option>
                      <option value={PLAN_TYPES.ANNUAL}>Annual</option>
                      <option value={PLAN_TYPES.CUSTOM}>Custom</option>
                    </select>
                  </div>
                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Minimum 6 characters"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitness Goals
                  </label>
                  <textarea
                    rows="3"
                    name="fitness_goals"
                    value={formData.fitness_goals}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Weight loss, muscle gain, endurance training..."
                    disabled={loading}
                  />
                </div>

                {editingUser && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">Note:</span> Leave password field empty to keep existing password.
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
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
                        <span>{editingUser ? 'Updating...' : 'Adding...'}</span>
                      </>
                    ) : (
                      editingUser ? 'Update User' : 'Add User'
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

export default Users;
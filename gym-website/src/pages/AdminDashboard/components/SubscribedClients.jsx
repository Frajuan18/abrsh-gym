import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserCheck, 
  Calendar, 
  Mail, 
  Phone,
  Edit2, 
  Trash2, 
  Eye,
  Plus,
  Download,
  UserX,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  DollarSign,
  CreditCard,
  CalendarDays
} from 'lucide-react';
import { subscribedClientsService } from '../../../services/databaseService';
import { 
  STATUS_CODES, 
  PLAN_TYPES, 
  BILLING_CYCLES,
  getStatusLabel, 
  getPlanLabel, 
  getBillingCycleLabel,
  formatCurrency,
  formatDate,
  getStatusColor
} from '../../../constants/databaseConstants';

const SubscribedClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  
  const [formData, setFormData] = useState({
    client_full_name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    plan_type: PLAN_TYPES.BASIC,
    status: STATUS_CODES.ACTIVE,
    cost_of_subscription: 0,
    billing_cycle: BILLING_CYCLES.MONTHLY,
    auto_renew: true
  });

  // Fetch clients from Supabase
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching subscribed clients...');
      const data = await subscribedClientsService.getAllClients();
      console.log('✅ Clients fetched:', data);
      setClients(data || []);
    } catch (err) {
      setError(`Failed to load clients: ${err.message}`);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients based on selected filter and search term
  const filteredClients = clients.filter(client => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'active' && client.status === STATUS_CODES.ACTIVE) ||
      (selectedFilter === 'inactive' && client.status === STATUS_CODES.INACTIVE) ||
      (selectedFilter === 'pending' && client.status === STATUS_CODES.PENDING) ||
      (selectedFilter === 'expired' && client.status === STATUS_CODES.EXPIRED) ||
      (selectedFilter === 'cancelled' && client.status === STATUS_CODES.CANCELLED);
    
    const matchesSearch = 
      client.client_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.client_id && client.client_id.toString().includes(searchTerm)) ||
      (client.cost_of_subscription && client.cost_of_subscription.toString().includes(searchTerm));
    
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === STATUS_CODES.ACTIVE).length,
    expired: clients.filter(c => c.status === STATUS_CODES.EXPIRED).length,
    pending: clients.filter(c => c.status === STATUS_CODES.PENDING).length,
    cancelled: clients.filter(c => c.status === STATUS_CODES.CANCELLED).length,
    totalRevenue: clients.reduce((sum, client) => sum + (parseFloat(client.cost_of_subscription) || 0), 0)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('📤 Submitting client form:', formData);
      
      // Validate numeric fields
      const cost = parseFloat(formData.cost_of_subscription);
      if (isNaN(cost) || cost < 0) {
        throw new Error('Subscription cost must be a valid positive number');
      }

      // Prepare data for Supabase
      const clientData = {
        client_full_name: formData.client_full_name,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        plan_type: parseInt(formData.plan_type),
        status: parseInt(formData.status),
        cost_of_subscription: cost,
        billing_cycle: parseInt(formData.billing_cycle),
        auto_renew: formData.auto_renew
      };

      console.log('📤 Data to insert:', clientData);

      let updatedClient;
      
      if (editingClient) {
        // Update existing client
        console.log('🔄 Updating client ID:', editingClient.client_id);
        updatedClient = await subscribedClientsService.updateClient(editingClient.client_id, clientData);
        console.log('✅ Client updated:', updatedClient);
        
        // Update local state
        setClients(prev => prev.map(c => 
          c.client_id === editingClient.client_id ? updatedClient : c
        ));
      } else {
        // Create new client
        console.log('🆕 Creating new client');
        updatedClient = await subscribedClientsService.createClient(clientData);
        console.log('✅ Client created:', updatedClient);
        
        // Update local state
        setClients(prev => [updatedClient, ...prev]);
      }
      
      // Reset form
      setFormData({
        client_full_name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        plan_type: PLAN_TYPES.BASIC,
        status: STATUS_CODES.ACTIVE,
        cost_of_subscription: 0,
        billing_cycle: BILLING_CYCLES.MONTHLY,
        auto_renew: true
      });
      
      setEditingClient(null);
      setShowModal(false);
      setError(null);
      
      // Refresh the list
      fetchClients();
      
    } catch (err) {
      const errorMessage = `Failed to ${editingClient ? 'update' : 'create'} client: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error saving client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    
    try {
      setLoading(true);
      console.log('🗑️ Deleting client ID:', id);
      await subscribedClientsService.deleteClient(id);
      
      // Update local state
      setClients(prev => prev.filter(client => client.client_id !== id));
      setError(null);
      console.log('✅ Client deleted successfully');
    } catch (err) {
      setError(`Failed to delete client: ${err.message}`);
      console.error('Error deleting client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client) => {
    console.log('✏️ Editing client:', client);
    setEditingClient(client);
    setFormData({
      client_full_name: client.client_full_name || '',
      start_date: client.start_date ? client.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      end_date: client.end_date ? client.end_date.split('T')[0] : '',
      plan_type: client.plan_type || PLAN_TYPES.BASIC,
      status: client.status || STATUS_CODES.ACTIVE,
      cost_of_subscription: client.cost_of_subscription || 0,
      billing_cycle: client.billing_cycle || BILLING_CYCLES.MONTHLY,
      auto_renew: client.auto_renew || true
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
                 statusCode === STATUS_CODES.EXPIRED ? XCircle : 
                 statusCode === STATUS_CODES.PENDING ? Clock : 
                 UserX;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[statusColor]}`}>
        <Icon size={12} />
        {getStatusLabel(statusCode)}
      </span>
    );
  };

  // Get clients by status for filter
  const handleFilterChange = (filterType) => {
    if (filterType === 'all') {
      setSelectedFilter('all');
    } else {
      // Get clients by status from database
      const fetchByStatus = async () => {
        try {
          setLoading(true);
          setSelectedFilter(filterType);
          let data;
          
          switch(filterType) {
            case 'active':
              data = await subscribedClientsService.getClientsByStatus(STATUS_CODES.ACTIVE);
              break;
            case 'pending':
              data = await subscribedClientsService.getClientsByStatus(STATUS_CODES.PENDING);
              break;
            case 'expired':
              data = await subscribedClientsService.getClientsByStatus(STATUS_CODES.EXPIRED);
              break;
            case 'cancelled':
              data = await subscribedClientsService.getClientsByStatus(STATUS_CODES.CANCELLED);
              break;
            default:
              data = await subscribedClientsService.getAllClients();
          }
          
          setClients(data || []);
        } catch (err) {
          setError(`Failed to filter clients: ${err.message}`);
          console.error('Error filtering clients:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchByStatus();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribed Clients</h1>
          <p className="text-gray-600">Manage gym clients and their subscriptions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={fetchClients}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingClient(null);
              setFormData({
                client_full_name: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                plan_type: PLAN_TYPES.BASIC,
                status: STATUS_CODES.ACTIVE,
                cost_of_subscription: 0,
                billing_cycle: BILLING_CYCLES.MONTHLY,
                auto_renew: true
              });
              setShowModal(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <UserPlus size={18} />
            <span className="font-medium">Add Client</span>
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
              <p className="text-sm text-blue-600 mb-1">Total Clients</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Active</p>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-purple-700">{stats.pending}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="text-purple-600" size={24} />
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
            placeholder="Search clients by name, ID, or amount..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserCheck className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No clients found' : 'No subscribed clients yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Add your first client to get started'}
            </p>
            <button
              onClick={() => {
                setEditingClient(null);
                setShowModal(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <UserPlus size={18} />
              <span>Add First Client</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
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
                {filteredClients.map((client) => (
                  <tr key={client.client_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {client.client_full_name || 'Unnamed Client'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {client.client_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {getPlanLabel(client.plan_type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getBillingCycleLabel(client.billing_cycle)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          Start: {formatDate(client.start_date)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          End: {formatDate(client.end_date)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(client.cost_of_subscription)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Auto-renew: {client.auto_renew ? 'Yes' : 'No'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(client.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleEditClient(client)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteClient(client.client_id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          onClick={() => {
                            // View client details - could open a detail view modal
                            console.log('Viewing client:', client);
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

      {/* Add/Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingClient(null);
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
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    name="client_full_name"
                    value={formData.client_full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <select
                    name="plan_type"
                    value={formData.plan_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value={PLAN_TYPES.BASIC}>Basic</option>
                    <option value={PLAN_TYPES.STANDARD}>Standard</option>
                    <option value={PLAN_TYPES.PREMIUM}>Premium</option>
                    <option value={PLAN_TYPES.ANNUAL}>Annual</option>
                    <option value={PLAN_TYPES.CUSTOM}>Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Cost ($) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="cost_of_subscription"
                      value={formData.cost_of_subscription}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="29.99"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle *
                  </label>
                  <select
                    name="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value={BILLING_CYCLES.MONTHLY}>Monthly</option>
                    <option value={BILLING_CYCLES.QUARTERLY}>Quarterly</option>
                    <option value={BILLING_CYCLES.SEMI_ANNUAL}>Semi-Annual</option>
                    <option value={BILLING_CYCLES.ANNUAL}>Annual</option>
                    <option value={BILLING_CYCLES.ONE_TIME}>One-time</option>
                  </select>
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
                    <option value={STATUS_CODES.PENDING}>Pending</option>
                    <option value={STATUS_CODES.EXPIRED}>Expired</option>
                    <option value={STATUS_CODES.CANCELLED}>Cancelled</option>
                    <option value={STATUS_CODES.INACTIVE}>Inactive</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="auto_renew"
                    checked={formData.auto_renew}
                    onChange={(e) => setFormData(prev => ({ ...prev, auto_renew: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Auto Renew Subscription
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingClient(null);
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
                        <span>{editingClient ? 'Updating...' : 'Adding...'}</span>
                      </>
                    ) : (
                      editingClient ? 'Update Client' : 'Add Client'
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

export default SubscribedClients;
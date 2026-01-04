import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Settings,
  DollarSign,
  Clock,
  Tag,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { servicesService } from '../../../services/databaseService';
import { 
  STATUS_CODES, 
  SERVICE_CATEGORIES,
  getStatusLabel, 
  getStatusColor,
  formatCurrency,
  formatDate 
} from '../../../constants/databaseConstants';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingService, setEditingService] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    status: STATUS_CODES.AVAILABLE,
    category: ''
  });

  // Fetch services from Supabase
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching services...');
      const data = await servicesService.getAllServices();
      console.log('✅ Services fetched:', data);
      setServices(data || []);
    } catch (err) {
      const errorMessage = `Failed to load services: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('📤 Submitting service form:', formData);
      
      // Prepare data for Supabase
      const serviceData = {
        name: formData.name,
        description: formData.description || '',
        price: formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        status: parseInt(formData.status),
        category: formData.category || null,
        created_at: new Date().toISOString()
      };

      console.log('📤 Data to insert:', serviceData);

      let updatedService;
      
      if (editingService) {
        // Update existing service
        console.log('🔄 Updating service ID:', editingService.services_id);
        updatedService = await servicesService.updateService(editingService.services_id, serviceData);
        console.log('✅ Service updated:', updatedService);
        
        // Update local state
        setServices(prev => prev.map(s => 
          s.services_id === editingService.services_id ? updatedService : s
        ));
      } else {
        // Create new service
        console.log('🆕 Creating new service');
        updatedService = await servicesService.createService(serviceData);
        console.log('✅ Service created:', updatedService);
        
        // Update local state
        setServices(prev => [updatedService, ...prev]);
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        status: STATUS_CODES.AVAILABLE,
        category: ''
      });
      
      setEditingService(null);
      setShowForm(false);
      setError(null);
      
      // Refresh the list
      fetchServices();
      
    } catch (err) {
      const errorMessage = `Failed to ${editingService ? 'update' : 'create'} service: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error saving service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      setLoading(true);
      console.log('🗑️ Deleting service ID:', id);
      await servicesService.deleteService(id);
      
      // Update local state
      setServices(prev => prev.filter(service => service.services_id !== id));
      setError(null);
      console.log('✅ Service deleted successfully');
    } catch (err) {
      const errorMessage = `Failed to delete service: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    console.log('✏️ Editing service:', service);
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      duration: service.duration || '',
      status: service.status || STATUS_CODES.AVAILABLE,
      category: service.category || ''
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
    const statusColor = getStatusColor(statusCode, 'service');
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const Icon = statusCode === STATUS_CODES.AVAILABLE ? CheckCircle : 
                 statusCode === STATUS_CODES.UNAVAILABLE ? XCircle : 
                 AlertCircle;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[statusColor]}`}>
        <Icon size={12} />
        {getStatusLabel(statusCode, 'service')}
      </span>
    );
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Flexible';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}m`;
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      service.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || 
      service.status === parseInt(selectedStatus);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: services.length,
    available: services.filter(s => s.status === STATUS_CODES.AVAILABLE).length,
    unavailable: services.filter(s => s.status === STATUS_CODES.UNAVAILABLE).length,
    hasPrice: services.filter(s => s.price && s.price > 0).length,
    averagePrice: services.length > 0 
      ? services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0) / services.length
      : 0
  };

  // Get unique categories from services
  const uniqueCategories = [...new Set(services
    .map(s => s.category)
    .filter(Boolean))];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage gym services and classes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={fetchServices}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                duration: '',
                status: STATUS_CODES.AVAILABLE,
                category: ''
              });
              setShowForm(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <Plus size={18} />
            <span className="font-medium">Add Service</span>
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
              <p className="text-sm text-blue-600 mb-1">Total Services</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Available</p>
              <p className="text-2xl font-bold text-green-700">{stats.available}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Average Price</p>
              <p className="text-2xl font-bold text-orange-700">
                {formatCurrency(stats.averagePrice)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Paid Services</p>
              <p className="text-2xl font-bold text-purple-700">{stats.hasPrice}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
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
            placeholder="Search services by name, description, or category..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {SERVICE_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value={STATUS_CODES.AVAILABLE}>Available</option>
            <option value={STATUS_CODES.UNAVAILABLE}>Unavailable</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Settings className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No services found' : 'No services yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Add your first service to get started'}
            </p>
            <button
              onClick={() => {
                setEditingService(null);
                setShowForm(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              <span>Add First Service</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price & Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
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
                {filteredServices.map((service) => (
                  <tr key={service.services_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 mr-4 rounded-lg bg-gradient-to-r from-indigo-100 to-indigo-50 border border-indigo-200 flex items-center justify-center">
                          <Settings size={20} className="text-indigo-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name || 'Unnamed Service'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {service.services_id}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Created: {formatDate(service.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {service.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {service.price ? formatCurrency(service.price) : 'Free'}
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={14} />
                          {formatDuration(service.duration)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {service.category ? (
                        <div className="flex items-center gap-1">
                          <Tag size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {service.category}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(service.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleEditService(service)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteService(service.services_id)}
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

      {/* Add/Edit Service Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
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
                    Service Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Personal Training, Yoga Class"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the service in detail..."
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="29.99 (leave empty for free)"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for free service
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        min="0"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="60 (leave empty for flexible)"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for flexible duration
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select Category</option>
                      {SERVICE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      {uniqueCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
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
                      <option value={STATUS_CODES.AVAILABLE}>Available</option>
                      <option value={STATUS_CODES.UNAVAILABLE}>Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingService(null);
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
                        <span>{editingService ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingService ? 'Update Service' : 'Add Service'
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

export default ServicesManagement;
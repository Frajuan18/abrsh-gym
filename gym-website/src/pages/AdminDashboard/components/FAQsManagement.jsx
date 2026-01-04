import { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, HelpCircle, Edit2, Trash2, 
  ChevronUp, ChevronDown, CheckCircle, XCircle, 
  RefreshCw, Eye, EyeOff, ArrowUpDown, Loader2,
  AlertCircle, Save, X
} from 'lucide-react';
import { faqsService } from '../../../services/databaseService';
import { FAQ_CATEGORIES, formatDate } from '../../../constants/databaseConstants';

const FAQsManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    display_order: 0,
    is_active: true
  });

  // Fetch FAQs from Supabase
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📥 Fetching FAQs...');
      const data = await faqsService.getAllFAQs();
      console.log('✅ FAQs fetched:', data);
      setFaqs(data || []);
    } catch (err) {
      const errorMessage = `Failed to load FAQs: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('📤 Submitting FAQ form:', formData);
      
      // Prepare data for Supabase
      const faqData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category || null,
        display_order: parseInt(formData.display_order) || 0,
        is_active: formData.is_active
      };

      console.log('📤 Data to insert/update:', faqData);

      let updatedFAQ;
      
      if (editingFAQ) {
        // Update existing FAQ
        console.log('🔄 Updating FAQ ID:', editingFAQ.faq_id);
        updatedFAQ = await faqsService.updateFAQ(editingFAQ.faq_id, faqData);
        console.log('✅ FAQ updated:', updatedFAQ);
        
        // Update local state
        setFaqs(prev => prev.map(f => 
          f.faq_id === editingFAQ.faq_id ? updatedFAQ : f
        ));
      } else {
        // Create new FAQ
        console.log('🆕 Creating new FAQ');
        updatedFAQ = await faqsService.createFAQ(faqData);
        console.log('✅ FAQ created:', updatedFAQ);
        
        // Update local state
        setFaqs(prev => [updatedFAQ, ...prev]);
      }
      
      // Reset form
      resetForm();
      setShowForm(false);
      setError(null);
      
    } catch (err) {
      const errorMessage = `Failed to ${editingFAQ ? 'update' : 'create'} FAQ: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error saving FAQ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      setLoading(true);
      console.log('🗑️ Deleting FAQ ID:', id);
      await faqsService.deleteFAQ(id);
      
      // Update local state
      setFaqs(prev => prev.filter(faq => faq.faq_id !== id));
      setError(null);
      console.log('✅ FAQ deleted successfully');
    } catch (err) {
      const errorMessage = `Failed to delete FAQ: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error deleting FAQ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFAQ = (faq) => {
    console.log('✏️ Editing FAQ:', faq);
    setEditingFAQ(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || '',
      display_order: faq.display_order || 0,
      is_active: faq.is_active !== undefined ? faq.is_active : true
    });
    setShowForm(true);
  };

  const toggleFAQStatus = async (faq) => {
    try {
      setLoading(true);
      const newStatus = !faq.is_active;
      console.log(`🔄 Toggling FAQ ${faq.faq_id} status to:`, newStatus);
      
      const updatedFAQ = await faqsService.updateFAQ(faq.faq_id, {
        is_active: newStatus,
        updated_at: new Date().toISOString()
      });
      
      console.log('✅ FAQ status updated:', updatedFAQ);
      
      // Update local state
      setFaqs(prev => prev.map(f => 
        f.faq_id === faq.faq_id ? updatedFAQ : f
      ));
      
    } catch (err) {
      const errorMessage = `Failed to update FAQ status: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error toggling FAQ status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      display_order: 0,
      is_active: true
    });
    setEditingFAQ(null);
    setError('');
  };

  // Filter FAQs
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      faq.category === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && faq.is_active) ||
      (selectedStatus === 'inactive' && !faq.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: faqs.length,
    active: faqs.filter(f => f.is_active).length,
    inactive: faqs.filter(f => !f.is_active).length,
    categories: [...new Set(faqs.map(f => f.category).filter(Boolean))].length
  };

  // Get unique categories from FAQs
  const uniqueCategories = [...new Set(faqs
    .map(f => f.category)
    .filter(Boolean))];

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQs Management</h1>
          <p className="text-gray-600">Manage frequently asked questions for your website</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <button
            onClick={fetchFAQs}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <Plus size={18} />
            <span className="font-medium">Add FAQ</span>
          </button>
        </div>
      </div>

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
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total FAQs</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <HelpCircle className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Published</p>
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
              <p className="text-sm text-purple-600 mb-1">Categories</p>
              <p className="text-2xl font-bold text-purple-700">{stats.categories}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Filter className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Draft/Inactive</p>
              <p className="text-2xl font-bold text-orange-700">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <EyeOff className="text-orange-600" size={24} />
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
            placeholder="Search FAQs by question, answer, or category..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            <option value="all">All Categories</option>
            {FAQ_CATEGORIES.map(category => (
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
            disabled={loading}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* FAQs List Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQ Preview</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto animate-spin text-gray-400 mb-4" size={32} />
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No FAQs found' : 'No FAQs yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Add your first frequently asked question'}
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={18} />
                <span>Add First FAQ</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.slice(0, 3).map((faq) => (
                <div
                  key={faq.faq_id}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.faq_id ? null : faq.faq_id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          faq.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.is_active ? 'Published' : 'Draft'}
                        </span>
                        {faq.category && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {faq.category}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-medium text-gray-900">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-200 ${
                        expandedFAQ === faq.faq_id ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </button>
                  {expandedFAQ === faq.faq_id && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <p className="text-gray-600 whitespace-pre-line">{faq.answer}</p>
                      <div className="flex justify-end mt-4 space-x-2">
                        <button
                          onClick={() => handleEditFAQ(faq)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredFAQs.length > 3 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing 3 of {filteredFAQs.length} FAQs
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FAQs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="mx-auto animate-spin text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Loading FAQs table...</p>
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="p-12 text-center">
            <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">Add your first FAQ to get started</p>
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
                    Answer Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
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
                {filteredFAQs.map((faq) => (
                  <tr key={faq.faq_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {faq.question || 'No question'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {faq.faq_id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {truncateText(faq.answer, 150)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {faq.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {faq.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {faq.display_order || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFAQStatus(faq)}
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                          faq.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        disabled={loading}
                      >
                        {faq.is_active ? (
                          <>
                            <Eye size={12} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleEditFAQ(faq)}
                          title="Edit"
                          disabled={loading}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteFAQ(faq.faq_id)}
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.faq_id ? null : faq.faq_id)}
                          title="Preview"
                          disabled={loading}
                        >
                          <HelpCircle size={18} />
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

      {/* Add/Edit FAQ Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
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
                    Question *
                  </label>
                  <textarea
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="What is your question?"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer *
                  </label>
                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Provide a detailed answer..."
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
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select Category</option>
                      {FAQ_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      {uniqueCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lower numbers appear first
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Published (Visible on website)
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
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
                        <Loader2 size={18} className="animate-spin" />
                        <span>{editingFAQ ? 'Saving...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingFAQ ? 'Update FAQ' : 'Add FAQ'
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

export default FAQsManagement;
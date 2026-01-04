import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  ExternalLink,
  DollarSign,
  ShoppingCart,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tag,
  Layers,
  Link,
  Globe,
  Star,
  TrendingUp,
  ThumbsUp,
  Package,
  Zap,
  Shield,
  Truck,
  Download,
  Loader2,
  Sparkles,
  Globe as GlobeIcon,
  AlertTriangle,
  Clipboard,
  Check
} from 'lucide-react';
import { productsService } from '../../../services/databaseService';
import { 
  STATUS_CODES, 
  PRODUCT_CATEGORIES,
  getStatusLabel, 
  getStatusColor,
  formatCurrency,
  formatDate,
  truncateText 
} from '../../../constants/databaseConstants';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Fetch state
  const [fetchingData, setFetchingData] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [showFetchModal, setShowFetchModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    original_price: '',
    platform: 'alibaba',
    product_url: '',
    image_url: '',
    affiliate_link: '',
    rating: '4.5',
    recommendation_score: '8',
    status: STATUS_CODES.IN_STOCK,
    features: '',
    shipping_info: '',
    return_policy: ''
  });

  // Platform options
  const PLATFORMS = [
    { id: 'alibaba', name: 'Alibaba', icon: '🌐', color: 'bg-orange-100 text-orange-800', baseUrl: 'alibaba.com' },
    { id: 'amazon', name: 'Amazon', icon: '📦', color: 'bg-yellow-100 text-yellow-800', baseUrl: 'amazon.com' },
    { id: 'ebay', name: 'eBay', icon: '🏷️', color: 'bg-blue-100 text-blue-800', baseUrl: 'ebay.com' },
    { id: 'walmart', name: 'Walmart', icon: '🛒', color: 'bg-blue-100 text-blue-800', baseUrl: 'walmart.com' },
    { id: 'etsy', name: 'Etsy', icon: '🎨', color: 'bg-pink-100 text-pink-800', baseUrl: 'etsy.com' },
    { id: 'aliexpress', name: 'AliExpress', icon: '🚀', color: 'bg-red-100 text-red-800', baseUrl: 'aliexpress.com' },
    { id: 'other', name: 'Other', icon: '🔗', color: 'bg-gray-100 text-gray-800', baseUrl: '' }
  ];

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      setError(`Failed to load products: ${err.message}`);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Detect platform from URL
  const detectPlatformFromUrl = (url) => {
    if (!url) return 'other';
    
    const urlLower = url.toLowerCase();
    for (const platform of PLATFORMS) {
      if (platform.baseUrl && urlLower.includes(platform.baseUrl.toLowerCase())) {
        return platform.id;
      }
    }
    return 'other';
  };

  // Simulate fetching product data from URL (in real app, you'd use an API)
  const fetchProductFromUrl = async (url) => {
    try {
      setFetchingData(true);
      setFetchError('');
      
      // Detect platform
      const platform = detectPlatformFromUrl(url);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data based on platform
      let mockProduct = {
        name: '',
        description: '',
        price: 0,
        image_url: '',
        platform: platform
      };
      
      // Generate mock data based on platform
      switch (platform) {
        case 'alibaba':
          mockProduct = {
            name: 'Premium Adjustable Dumbbell Set',
            description: 'Professional adjustable dumbbell set with quick weight change system. Perfect for home gyms and commercial use.',
            price: 289.99,
            original_price: 349.99,
            image_url: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?w=400&h=400&fit=crop',
            rating: 4.6,
            features: '• Adjustable weight 5-50 lbs\n• Quick-change dial system\n• Ergonomic grip handles\n• Durable steel construction\n• Compact storage design',
            shipping_info: 'Free shipping, 7-14 days delivery',
            return_policy: '30-day return policy'
          };
          break;
          
        case 'amazon':
          mockProduct = {
            name: 'Smart Fitness Watch with GPS',
            description: 'Advanced fitness tracker with GPS, heart rate monitor, sleep tracking, and smartphone notifications.',
            price: 129.99,
            original_price: 179.99,
            image_url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=400&fit=crop',
            rating: 4.4,
            features: '• GPS tracking\n• Heart rate monitor\n• Sleep analysis\n• 7-day battery life\n• Water resistant up to 50m',
            shipping_info: 'Free 2-day shipping with Prime',
            return_policy: '1-year warranty, 30-day return'
          };
          break;
          
        case 'ebay':
          mockProduct = {
            name: 'Professional Yoga Mat',
            description: 'Extra thick non-slip yoga mat with alignment lines. Eco-friendly materials, perfect for all yoga practices.',
            price: 34.99,
            original_price: 49.99,
            image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=400&fit=crop',
            rating: 4.8,
            features: '• 6mm thickness for comfort\n• Non-slip surface\n• Alignment guide lines\n• Eco-friendly materials\n• Easy to clean',
            shipping_info: 'Free shipping, 3-5 business days',
            return_policy: 'Money back guarantee'
          };
          break;
          
        default:
          mockProduct = {
            name: 'Premium Fitness Product',
            description: 'High-quality fitness product designed for optimal performance and durability.',
            price: 99.99,
            original_price: 129.99,
            image_url: 'https://images.unsplash.com/photo-1594736797933-d0f9593a283d?w=400&h=400&fit=crop',
            rating: 4.5,
            features: '• Premium quality\n• Durable construction\n• User-friendly design\n• Great value for money',
            shipping_info: 'Standard shipping available',
            return_policy: 'Check seller policy'
          };
      }
      
      setFetchedProduct(mockProduct);
      
      // Auto-fill form with fetched data
      setFormData(prev => ({
        ...prev,
        name: mockProduct.name,
        description: mockProduct.description,
        price: mockProduct.price.toString(),
        original_price: mockProduct.original_price?.toString() || '',
        platform: platform,
        product_url: url,
        image_url: mockProduct.image_url,
        rating: mockProduct.rating.toString(),
        features: mockProduct.features,
        shipping_info: mockProduct.shipping_info,
        return_policy: mockProduct.return_policy
      }));
      
    } catch (err) {
      console.error('Error fetching product data:', err);
      setFetchError('Failed to fetch product information. Please enter details manually.');
      
      // Still set platform if URL is valid
      const platform = detectPlatformFromUrl(url);
      setFormData(prev => ({
        ...prev,
        platform: platform,
        product_url: url
      }));
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Prepare data for Supabase
      const productData = {
        name: formData.name,
        category_id: formData.category_id || null,
        description: formData.description || null,
        price: parseFloat(formData.price) || 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        platform: formData.platform,
        product_url: formData.product_url || null,
        image_url: formData.image_url || null,
        affiliate_link: formData.affiliate_link || null,
        rating: parseFloat(formData.rating) || 4.0,
        recommendation_score: parseInt(formData.recommendation_score) || 0,
        status: parseInt(formData.status),
        features: formData.features || null,
        shipping_info: formData.shipping_info || null,
        return_policy: formData.return_policy || null,
        is_affiliate: !!formData.affiliate_link,
        created_at: new Date().toISOString()
      };

      let updatedProduct;
      
      if (editingProduct) {
        // Update existing product
        updatedProduct = await productsService.updateProduct(editingProduct.products_id, productData);
        
        // Update local state
        setProducts(prev => prev.map(p => 
          p.products_id === editingProduct.products_id ? updatedProduct : p
        ));
      } else {
        // Create new product
        updatedProduct = await productsService.createProduct(productData);
        
        // Update local state
        setProducts(prev => [updatedProduct, ...prev]);
      }
      
      // Reset form
      setFormData({
        name: '',
        category_id: '',
        description: '',
        price: '',
        original_price: '',
        platform: 'alibaba',
        product_url: '',
        image_url: '',
        affiliate_link: '',
        rating: '4.5',
        recommendation_score: '8',
        status: STATUS_CODES.IN_STOCK,
        features: '',
        shipping_info: '',
        return_policy: ''
      });
      
      setFetchedProduct(null);
      setEditingProduct(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(`Failed to ${editingProduct ? 'update' : 'create'} product: ${err.message}`);
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product recommendation?')) return;
    
    try {
      setLoading(true);
      await productsService.deleteProduct(id);
      
      // Update local state
      setProducts(prev => prev.filter(product => product.products_id !== id));
      setError(null);
    } catch (err) {
      setError(`Failed to delete product: ${err.message}`);
      console.error('Error deleting product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || '',
      description: product.description || '',
      price: product.price || '',
      original_price: product.original_price || '',
      platform: product.platform || 'alibaba',
      product_url: product.product_url || '',
      image_url: product.image_url || '',
      affiliate_link: product.affiliate_link || '',
      rating: product.rating || '4.5',
      recommendation_score: product.recommendation_score || '8',
      status: product.status || STATUS_CODES.IN_STOCK,
      features: product.features || '',
      shipping_info: product.shipping_info || '',
      return_policy: product.return_policy || ''
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
    const statusColor = getStatusColor(statusCode, 'product');
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const Icon = statusCode === STATUS_CODES.IN_STOCK ? CheckCircle : 
                 statusCode === STATUS_CODES.OUT_OF_STOCK ? XCircle : 
                 AlertCircle;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[statusColor]}`}>
        <Icon size={12} />
        {getStatusLabel(statusCode, 'product')}
      </span>
    );
  };

  // Get platform badge
  const getPlatformBadge = (platform) => {
    const platformInfo = PLATFORMS.find(p => p.id === platform) || PLATFORMS[PLATFORMS.length - 1];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${platformInfo.color}`}>
        {platformInfo.icon} {platformInfo.name}
      </span>
    );
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.price && product.price.toString().includes(searchTerm)) ||
      product.platform?.toLowerCase().includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || 
      product.category_id?.includes(selectedCategory);
    
    const matchesStatus = selectedStatus === 'all' || 
      product.status === parseInt(selectedStatus);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === STATUS_CODES.IN_STOCK).length,
    affiliate: products.filter(p => p.is_affiliate).length,
    platforms: [...new Set(products.map(p => p.platform))].length,
    avgRating: products.length > 0 
      ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
      : '0.0',
    totalValue: products.reduce((sum, product) => {
      return sum + (parseFloat(product.price) || 0);
    }, 0)
  };

  // Get unique categories from products
  const uniqueCategories = [...new Set(products
    .map(p => p.category_id)
    .filter(Boolean))];

  // Open external link
  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('URL copied to clipboard!');
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Recommendations</h1>
          <p className="text-gray-600">Fetch and manage product recommendations from external platforms</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              setShowFetchModal(true);
              setEditingProduct(null);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <Sparkles size={18} />
            <span className="font-medium">Fetch Product</span>
          </button>
        </div>
      </div>

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
              <p className="text-sm text-blue-600 mb-1">Total Recommendations</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ThumbsUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Active Products</p>
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
              <p className="text-sm text-purple-600 mb-1">Affiliate Links</p>
              <p className="text-2xl font-bold text-purple-700">{stats.affiliate}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Link className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Platforms</p>
              <p className="text-2xl font-bold text-orange-700">{stats.platforms}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Globe className="text-orange-600" size={24} />
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
            placeholder="Search by name, description, platform, or price..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value={STATUS_CODES.IN_STOCK}>Active</option>
            <option value={STATUS_CODES.OUT_OF_STOCK}>Inactive</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading recommendations...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No recommendations found' : 'No product recommendations yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Click "Fetch Product" to add your first recommendation'}
            </p>
            <button
              onClick={() => setShowFetchModal(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-lg"
            >
              <Sparkles size={18} />
              <span>Fetch First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price & Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.products_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.image_url ? (
                          <div className="flex-shrink-0 h-12 w-12 mr-4">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="h-12 w-12 rounded-lg bg-gray-100 border flex items-center justify-center hidden">
                              <Package size={20} className="text-gray-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 mr-4 rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200 flex items-center justify-center">
                            <Package size={20} className="text-orange-600" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name || 'Unnamed Product'}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {truncateText(product.description, 50)}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {product.products_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div>
                          {getPlatformBadge(product.platform)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {product.category_id || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.price)}
                        {product.original_price && product.original_price > product.price && (
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating || 'N/A'}
                        </span>
                        {product.recommendation_score && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Score: {product.recommendation_score}/10
                          </span>
                        )}
                      </div>
                      {product.is_affiliate && (
                        <div className="mt-1">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Affiliate Link Available
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(product.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {product.product_url && (
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1"
                            onClick={() => openExternalLink(product.product_url)}
                            title="View on Platform"
                          >
                            <ExternalLink size={18} />
                          </button>
                        )}
                        <button
                          className="text-orange-600 hover:text-orange-900 p-1"
                          onClick={() => handleEditProduct(product)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeleteProduct(product.products_id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          onClick={() => copyToClipboard(product.product_url)}
                          title="Copy URL"
                        >
                          <Clipboard size={18} />
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

      {/* Fetch Product Modal */}
      {showFetchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Fetch Product from URL</h2>
                <button
                  onClick={() => {
                    setShowFetchModal(false);
                    setProductUrl('');
                    setFetchedProduct(null);
                    setFetchError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product URL *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="url"
                        placeholder="https://www.alibaba.com/product-detail/..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        value={productUrl}
                        onChange={(e) => setProductUrl(e.target.value)}
                        disabled={fetchingData}
                      />
                    </div>
                    <button
                      onClick={() => fetchProductFromUrl(productUrl)}
                      disabled={!productUrl || fetchingData}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                    >
                      {fetchingData ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Download size={18} />
                      )}
                      <span>{fetchingData ? 'Fetching...' : 'Fetch'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported platforms: Alibaba, Amazon, eBay, Walmart, Etsy, AliExpress
                  </p>
                </div>

                {/* Fetch Error */}
                {fetchError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="text-red-600 mr-2" size={20} />
                      <p className="text-red-600">{fetchError}</p>
                    </div>
                  </div>
                )}

                {/* Fetched Product Preview */}
                {fetchedProduct && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Check className="text-green-600 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-green-800">Product Found!</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        {fetchedProduct.image_url && (
                          <img
                            src={fetchedProduct.image_url}
                            alt="Product preview"
                            className="w-20 h-20 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{fetchedProduct.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{fetchedProduct.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(fetchedProduct.price)}
                            </span>
                            {fetchedProduct.original_price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                {formatCurrency(fetchedProduct.original_price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 space-y-2">
                        {fetchedProduct.features && (
                          <div>
                            <span className="font-medium">Features:</span>
                            <pre className="whitespace-pre-line mt-1">{fetchedProduct.features}</pre>
                          </div>
                        )}
                        {fetchedProduct.shipping_info && (
                          <div>
                            <span className="font-medium">Shipping:</span> {fetchedProduct.shipping_info}
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <button
                          onClick={() => {
                            setShowFetchModal(false);
                            setShowForm(true);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg font-medium"
                        >
                          Use This Data & Continue to Form
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Entry Option */}
                <div className="pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowFetchModal(false);
                      setShowForm(true);
                      if (productUrl) {
                        const platform = detectPlatformFromUrl(productUrl);
                        setFormData(prev => ({
                          ...prev,
                          platform: platform,
                          product_url: productUrl
                        }));
                      }
                    }}
                    className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Enter Details Manually
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product Recommendation' : 'Add Product Recommendation'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    setFetchedProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Adjustable Dumbbells Set"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        {PRODUCT_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Brief description of the product..."
                      rows="3"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Platform & Links */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform & Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform *
                      </label>
                      <select
                        name="platform"
                        value={formData.platform}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        disabled={loading}
                      >
                        {PLATFORMS.map(platform => (
                          <option key={platform.id} value={platform.id}>
                            {platform.icon} {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product URL *
                      </label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          name="product_url"
                          value={formData.product_url}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="https://www.alibaba.com/product-detail/..."
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Affiliate Link (Optional)
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          name="affiliate_link"
                          value={formData.affiliate_link}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="https://your-affiliate-link.com"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="https://example.com/product-image.jpg"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Rating */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Rating</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Price ($) *
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
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="99.99"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          name="original_price"
                          value={formData.original_price}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="149.99"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (0-5)
                      </label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="4.5"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recommendation Score (0-10)
                      </label>
                      <div className="relative">
                        <ThumbsUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          min="0"
                          max="10"
                          name="recommendation_score"
                          value={formData.recommendation_score}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="8"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Features (one per line)
                      </label>
                      <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="• Adjustable weight\n• Non-slip grip\n• Durable construction"
                        rows="3"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                        disabled={loading}
                      >
                        <option value={STATUS_CODES.IN_STOCK}>Active</option>
                        <option value={STATUS_CODES.OUT_OF_STOCK}>Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Information
                      </label>
                      <input
                        type="text"
                        name="shipping_info"
                        value={formData.shipping_info}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Free shipping, 5-7 days delivery"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Return Policy
                      </label>
                      <input
                        type="text"
                        name="return_policy"
                        value={formData.return_policy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., 30-day return policy"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                      setFetchedProduct(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{editingProduct ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingProduct ? 'Update Recommendation' : 'Add Recommendation'
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

export default ProductsManagement;
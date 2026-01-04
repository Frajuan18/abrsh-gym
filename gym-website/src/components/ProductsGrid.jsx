import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Package, Filter, Search, ChevronDown, Heart, Eye, Zap, Check, Truck, Shield } from 'lucide-react';
import { productsService } from '../services/databaseService'; // Use same service
import { formatCurrency } from '../constants/databaseConstants'; // Use same utility

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Fetch products using the same service
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products from database service (only in-stock products)
      const data = await productsService.getAllProducts({
        status: 1 // Only active products
      });

      console.log('Fetched products:', data);
      
      // Set products from database
      setProducts(data || []);

      // Extract unique categories
      const uniqueCategories = [...new Set(data
        .map(product => product.category_id)
        .filter(Boolean))];
      
      setCategories(['all', ...uniqueCategories]);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      
      setProducts([]);
      setCategories(['all']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Load wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category_id === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term)) ||
        product.category_id?.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => wishlist.includes(productId);

  // Render simplified stars
  const renderStars = (rating) => {
    if (!rating) rating = 4.0;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-200" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-200" />);
    }

    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-sm text-gray-500 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Simplified stock status
  const getStockStatus = (status) => {
    if (status === 1 || status === 'in_stock') {
      return { text: 'In Stock', badgeColor: 'bg-green-100 text-green-800' };
    } else {
      return { text: 'Out of Stock', badgeColor: 'bg-red-100 text-red-800' };
    }
  };

  // Handle add to cart (simplified)
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItem = cart.find(item => item.id === product.products_id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.products_id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch cart update event
    const event = new CustomEvent('cartUpdated', { detail: cart });
    window.dispatchEvent(event);
    
    // Visual feedback
    const button = document.querySelector(`[data-product-id="${product.products_id}"]`);
    if (button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<Check size={18} /> Added!';
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('bg-green-600');
      }, 1500);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Simplified */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Shop Products
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Browse our curated collection of products
            </p>
          </div>
          
          {/* Search and Filter - Only show if we have products */}
          {products.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-64 bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative group">
                <select
                  className="appearance-none pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full sm:w-48 bg-white shadow-sm cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar - Simplified */}
        {products.length > 0 && !loading && (
          <div className="mb-8 flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">30-Day Returns</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Unable to load products</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h3>
              <p className="text-gray-600 mb-8">
                Check back soon for new products.
              </p>
              <button
                onClick={fetchProducts}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Simplified Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.status);
                
                return (
                  <div 
                    key={product.products_id} 
                    className="group relative bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.products_id)}
                      className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isInWishlist(product.products_id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </button>

                    {/* Product Image - Simplified */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                      
                      {/* Stock Badge - Simplified */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.badgeColor}`}>
                        {stockStatus.text}
                      </div>
                    </div>

                    {/* Product Info - Simplified */}
                    <div className="p-4">
                      {/* Product Name and Price */}
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 pr-2">
                          {product.name || 'Product'}
                        </h3>
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatCurrency(product.original_price)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Category - Simplified */}
                      {product.category_id && (
                        <p className="text-xs text-gray-500 mb-3">
                          {product.category_id}
                        </p>
                      )}
                      
                      {/* Rating - Simplified */}
                      {(product.rating || product.rating === 0) && (
                        <div className="mb-3">
                          {renderStars(product.rating)}
                        </div>
                      )}
                      
                      {/* Action Button - Simplified */}
                      <button
                        data-product-id={product.products_id}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.status !== 1 && product.status !== 'in_stock'}
                        className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg font-medium transition-all ${
                          product.status !== 1 && product.status !== 'in_stock'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:shadow-lg hover:scale-[1.02]'
                        }`}
                      >
                        <ShoppingBag size={16} />
                        <span>
                          {product.status !== 1 && product.status !== 'in_stock' 
                            ? 'Out of Stock' 
                            : 'Add to Cart'
                          }
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty Search Results */}
            {filteredProducts.length === 0 && products.length > 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No matching products</h3>
                  <p className="text-gray-600 mb-8">
                    No products found for "{searchTerm}"{selectedCategory !== 'all' ? ` in "${selectedCategory}"` : ''}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
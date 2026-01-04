import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Search, 
  ChevronRight,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPostsService } from '../services/databaseService';
import Navbar from '../components/Navbar';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredPost, setFeaturedPost] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    'All Categories',
    'Fitness Tips',
    'Nutrition',
    'Workout Plans',
    'Health & Wellness',
    'Success Stories',
    'Gym Equipment',
    'Lifestyle'
  ];

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await blogPostsService.getPublishedBlogPosts();
      console.log('Fetched blog posts:', data);
      
      setPosts(data || []);
      
      if (data && data.length > 0) {
        const featured = data.find(post => post.is_featured) || data[0];
        setFeaturedPost(featured);
      }
      
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts. Please try again later.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      !searchTerm ||
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' ||
      selectedCategory === 'All Categories' ||
      post.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="pt-24">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <BookOpen size={16} />
              <span>Fitness Insights & Tips</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Fitness For Life Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert advice, workout tips, nutrition guides, and inspiring stories to help you on your fitness journey.
            </p>
          </div>

          {/* Improved Search and Filter Section */}
          <div className="mb-10">
            {/* Search Bar - Full width on top */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categories - In a single row with better styling */}
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Filter size={18} className="text-gray-600" />
                  <h3 className="text-sm font-medium text-gray-700">Filter by Category</h3>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                </div>
              </div>
              
              {/* Horizontal category pills - no scroll */}
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'All Categories' ? 'all' : category)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      (selectedCategory === 'all' && category === 'All Categories') || 
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                
                {/* Show more dropdown for additional categories */}
                {categories.length > 5 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
                    >
                      More
                      <svg 
                        className={`ml-1 w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                        {categories.slice(5).map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category === 'All Categories' ? 'all' : category);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                              selectedCategory === category
                                ? 'text-orange-600 font-medium bg-orange-50'
                                : 'text-gray-700'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Active filters info */}
              {(searchTerm || selectedCategory !== 'all') && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                    {searchTerm && (
                      <span> for "<span className="font-medium">{searchTerm}</span>"</span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span> in <span className="font-medium">{selectedCategory}</span></span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">Unable to load blog posts</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                  <button 
                    onClick={fetchBlogPosts}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Featured Post */}
          {featuredPost && !loading && filteredPosts.length > 0 && (
            <div className="mb-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl overflow-hidden shadow-lg border border-orange-200">
              <div className="flex flex-col lg:flex-row">
                {featuredPost.image_url && (
                  <div className="lg:w-2/5 h-64 lg:h-auto">
                    <img
                      src={featuredPost.image_url}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-8">
                  <div className="inline-flex items-center space-x-2 bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <TrendingUp size={12} />
                    <span>FEATURED POST</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {featuredPost.excerpt || featuredPost.content?.substring(0, 200) + '...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{featuredPost.author || 'Admin'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatDate(featuredPost.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{getReadingTime(featuredPost.content)}</span>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.blog_id}`}
                      className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-md transition-all"
                    >
                      <span>Read More</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Latest Articles
                  {searchTerm && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      for "{searchTerm}"
                    </span>
                  )}
                </h2>
                <div className="text-sm text-gray-500">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.blog_id} 
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200"
                  >
                    {/* Post Image */}
                    {post.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {post.category || 'Fitness'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Post Content */}
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>{post.author || 'Admin'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || post.content?.substring(0, 150) + '...'}
                      </p>
                      
                      {/* Tags */}
                      {post.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.split(',').slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              <Tag size={10} />
                              <span>{tag.trim()}</span>
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Read More Link */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{getReadingTime(post.content)}</span>
                        </div>
                        <Link
                          to={`/blog/${post.blog_id}`}
                          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold group/link"
                        >
                          <span>Read Post</span>
                          <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Empty State */}
              {filteredPosts.length === 0 && !loading && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
                    <p className="text-gray-600 mb-8">
                      {searchTerm
                        ? `No articles found for "${searchTerm}" in ${selectedCategory === 'all' ? 'any category' : selectedCategory}`
                        : `No articles found in ${selectedCategory === 'all' ? 'any category' : selectedCategory}`}
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setSearchTerm('')}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Clear Search
                      </button>
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                      >
                        Show All Categories
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Newsletter Subscription */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-600 mb-6">
                Get the latest fitness tips, workout plans, and exclusive content delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
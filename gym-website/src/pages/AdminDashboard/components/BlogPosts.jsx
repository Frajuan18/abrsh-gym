import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  FileText,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle,
  Clock,
  Globe,
  Hash,
  Link,
  Eye as EyeIcon,
  CalendarDays
} from 'lucide-react';
import { blogPostsService } from '../../../services/databaseService';
import { 
  STATUS_CODES, 
  getStatusLabel, 
  getStatusColor,
  formatDate,
  generateSlug,
  truncateText 
} from '../../../constants/databaseConstants';

const BlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingPost, setEditingPost] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: STATUS_CODES.DRAFT,
    featured_image: '',
    tags: '',
    author_id: ''
  });

  // Fetch blog posts from Supabase
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching blog posts...');
      const data = await blogPostsService.getAllBlogPosts();
      console.log('✅ Blog posts fetched:', data);
      setBlogPosts(data || []);
    } catch (err) {
      const errorMessage = `Failed to load blog posts: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      console.log('📤 Submitting blog post form:', formData);
      
      // Generate slug from title if not provided
      const slug = formData.slug || generateSlug(formData.title);
      
      // Prepare data for Supabase
      const postData = {
        title: formData.title,
        slug: slug,
        content: formData.content,
        excerpt: formData.excerpt || '',
        status: parseInt(formData.status),
        featured_image: formData.featured_image || null,
        tags: formData.tags || null,
        author_id: formData.author_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📤 Data to insert:', postData);

      let updatedPost;
      
      if (editingPost) {
        // Update existing blog post
        console.log('🔄 Updating post ID:', editingPost.blog_id);
        updatedPost = await blogPostsService.updateBlogPost(editingPost.blog_id, postData);
        console.log('✅ Post updated:', updatedPost);
        
        // Update local state
        setBlogPosts(prev => prev.map(p => 
          p.blog_id === editingPost.blog_id ? updatedPost : p
        ));
      } else {
        // Create new blog post
        console.log('🆕 Creating new post');
        updatedPost = await blogPostsService.createBlogPost(postData);
        console.log('✅ Post created:', updatedPost);
        
        // Update local state
        setBlogPosts(prev => [updatedPost, ...prev]);
      }
      
      // Reset form
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        status: STATUS_CODES.DRAFT,
        featured_image: '',
        tags: '',
        author_id: ''
      });
      
      setEditingPost(null);
      setShowForm(false);
      setError(null);
      
      // Refresh the list
      fetchBlogPosts();
      
    } catch (err) {
      const errorMessage = `Failed to ${editingPost ? 'update' : 'create'} blog post: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error saving blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      setLoading(true);
      console.log('🗑️ Deleting post ID:', id);
      await blogPostsService.deleteBlogPost(id);
      
      // Update local state
      setBlogPosts(prev => prev.filter(post => post.blog_id !== id));
      setError(null);
      console.log('✅ Post deleted successfully');
    } catch (err) {
      const errorMessage = `Failed to delete blog post: ${err.message}`;
      setError(errorMessage);
      console.error('❌ Error deleting blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    console.log('✏️ Editing post:', post);
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      status: post.status || STATUS_CODES.DRAFT,
      featured_image: post.featured_image || '',
      tags: post.tags || '',
      author_id: post.author_id || ''
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const getStatusBadge = (statusCode) => {
    const statusColor = getStatusColor(statusCode, 'content');
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    const Icon = statusCode === STATUS_CODES.PUBLISHED ? CheckCircle : 
                 statusCode === STATUS_CODES.DRAFT ? Clock : 
                 Globe;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[statusColor]}`}>
        <Icon size={12} />
        {getStatusLabel(statusCode, 'content')}
      </span>
    );
  };

  // Filter blog posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || 
      post.status === parseInt(selectedStatus);
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: blogPosts.length,
    published: blogPosts.filter(p => p.status === STATUS_CODES.PUBLISHED).length,
    draft: blogPosts.filter(p => p.status === STATUS_CODES.DRAFT).length,
    archived: blogPosts.filter(p => p.status === STATUS_CODES.ARCHIVED).length,
    recent: blogPosts.filter(p => {
      if (!p.created_at) return false;
      const created = new Date(p.created_at);
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
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600">Manage your blog posts and articles</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
          <button
            onClick={fetchBlogPosts}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="font-medium">Refresh</span>
          </button>
          <button
            onClick={() => {
              setEditingPost(null);
              setFormData({
                title: '',
                slug: '',
                content: '',
                excerpt: '',
                status: STATUS_CODES.DRAFT,
                featured_image: '',
                tags: '',
                author_id: ''
              });
              setShowForm(true);
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg hover:shadow-lg"
          >
            <Plus size={18} />
            <span className="font-medium">New Post</span>
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
              <p className="text-sm text-blue-600 mb-1">Total Posts</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Published</p>
              <p className="text-2xl font-bold text-green-700">{stats.published}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Drafts</p>
              <p className="text-2xl font-bold text-purple-700">{stats.draft}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Recent (7 days)</p>
              <p className="text-2xl font-bold text-orange-700">{stats.recent}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <CalendarDays className="text-orange-600" size={24} />
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
            placeholder="Search posts by title, content, or tags..."
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
            <option value={STATUS_CODES.PUBLISHED}>Published</option>
            <option value={STATUS_CODES.DRAFT}>Draft</option>
            <option value={STATUS_CODES.ARCHIVED}>Archived</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No posts found' : 'No blog posts yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Create your first blog post to get started'}
            </p>
            <button
              onClick={() => {
                setEditingPost(null);
                setShowForm(true);
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              <span>Create First Post</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Excerpt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.blog_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {post.featured_image ? (
                          <div className="flex-shrink-0 h-12 w-12 mr-4">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="h-12 w-12 rounded-lg object-cover border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div className="h-12 w-12 rounded-lg bg-gray-100 border flex items-center justify-center hidden">
                              <FileText size={20} className="text-gray-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 h-12 w-12 mr-4 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 border border-purple-200 flex items-center justify-center">
                            <FileText size={20} className="text-purple-600" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {post.title || 'Untitled Post'}
                          </div>
                          {post.slug && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <Link size={12} />
                              <span className="truncate">{post.slug}</span>
                            </div>
                          )}
                          {post.author_id && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <User size={12} />
                              <span>Author: {post.author_id.substring(0, 8)}...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {truncateText(post.excerpt || post.content, 100)}
                      </div>
                      {post.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.split(',').slice(0, 3).map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded flex items-center gap-1"
                            >
                              <Hash size={10} />
                              {tag.trim()}
                            </span>
                          ))}
                          {post.tags.split(',').length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{post.tags.split(',').length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(post.created_at)}
                        </div>
                      </div>
                      {post.updated_at && post.updated_at !== post.created_at && (
                        <div className="text-xs text-gray-500 mt-1">
                          Updated: {formatDate(post.updated_at, true)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1"
                          onClick={() => handleEditPost(post)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          onClick={() => handleDeletePost(post.blog_id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          title="View"
                        >
                          <EyeIcon size={18} />
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

      {/* Add/Edit Blog Post Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
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
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter blog post title"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="url-friendly-slug"
                        required
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Used in URL: /blog/{formData.slug || 'your-slug'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    rows="3"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief summary of the blog post (shown in listings)"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    rows="10"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Write your blog post content here..."
                    required
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          name="featured_image"
                          value={formData.featured_image}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                          disabled={loading}
                        />
                      </div>
                      {formData.featured_image && (
                        <div className="h-12 w-12 rounded-lg overflow-hidden border">
                          <img
                            src={formData.featured_image}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const parent = e.target.parentElement;
                              parent.innerHTML = '<div class="h-full w-full bg-gray-100 flex items-center justify-center"><FileText size={20} class="text-gray-400" /></div>';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="fitness, nutrition, workout (comma separated)"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option value={STATUS_CODES.DRAFT}>Draft</option>
                      <option value={STATUS_CODES.PUBLISHED}>Published</option>
                      <option value={STATUS_CODES.ARCHIVED}>Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="author_id"
                        value={formData.author_id}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Author UUID (optional)"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for anonymous
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPost(null);
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
                        <span>{editingPost ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      editingPost ? 'Update Post' : 'Create Post'
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

export default BlogPosts;
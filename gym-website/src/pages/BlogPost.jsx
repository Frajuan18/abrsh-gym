import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ChevronLeft,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { blogPostsService } from '../services/databaseService';

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch blog post by ID
        const data = await blogPostsService.getBlogPostById(postId);
        console.log('Fetched blog post:', data);
        
        if (!data) {
          throw new Error('Post not found');
        }
        
        setPost(data);
        
        // Fetch related posts (by category)
        // This is a simplified version - in production you'd have a proper related posts API
        const allPosts = await blogPostsService.getPublishedBlogPosts();
        const related = allPosts
          .filter(p => p.blog_id !== postId && p.category === data.category)
          .slice(0, 3);
        setRelatedPosts(related);
        
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Post not found or failed to load.');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '2 min read';
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const shareOnSocial = (platform) => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = 'Check out this blog post!';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <ChevronLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Tag size={14} />
            <span>{post.category || 'Fitness'}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>By {post.author || 'Admin'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} />
              <span>{getReadingTime(post.content)}</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => shareOnSocial('copy')}
                className="flex items-center space-x-2 text-gray-500 hover:text-orange-600 transition-colors"
                title="Share"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => alert('Bookmark saved!')}
                className="flex items-center space-x-2 text-gray-500 hover:text-orange-600 transition-colors"
                title="Save"
              >
                <Bookmark size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image_url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: post.content || post.excerpt || 'No content available.'
            }}
          />
        </article>

        {/* Tags */}
        {post.tags && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  <Tag size={12} />
                  <span>{tag.trim()}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Share */}
        <div className="mb-12 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => shareOnSocial('facebook')}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook size={18} />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-400 text-white px-4 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Twitter size={18} />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => shareOnSocial('linkedin')}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-700 text-white px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle size={20} className="text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
              0
            </span>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 text-center py-8">
              Comments are currently disabled. Check back soon!
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.blog_id} className="group">
                  {relatedPost.image_url && (
                    <div className="h-48 mb-4 rounded-xl overflow-hidden">
                      <img
                        src={relatedPost.image_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(relatedPost.created_at)}
                  </p>
                  <Link
                    to={`/blog/${relatedPost.blog_id}`}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="text-center py-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <ChevronLeft size={20} />
            <span>View All Blog Posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
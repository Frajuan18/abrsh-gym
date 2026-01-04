import { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Activity,
  Package,
  FileText,
  Settings,
  UserPlus,
  ShoppingCart,
  BookOpen,
  Layers,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import StatCard from './StatCard';
import { useNavigate } from 'react-router-dom';
import { 
  dashboardService, 
  usersService, 
  subscribedClientsService, 
  productsService, 
  servicesService, 
  blogPostsService, 
  teamMembersService 
} from '../../../services/databaseService';
import { formatCurrency } from '../../../constants/databaseConstants';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalProducts: 0,
    totalServices: 0,
    totalTeam: 0,
    totalBlogs: 0
  });
  const [recentActivities, setRecentActivities] = useState({
    recentUsers: [],
    recentClients: [],
    recentBlogs: []
  });
  
  const [dashboardStats, setDashboardStats] = useState([
    { 
      title: 'Total Members', 
      value: '0', 
      change: '+0%', 
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$0', 
      change: '+0%', 
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Active Subscriptions', 
      value: '0', 
      change: '+0%', 
      icon: Activity,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Products in Stock', 
      value: '0', 
      change: '+0%', 
      icon: Package,
      color: 'from-orange-500 to-orange-600'
    },
  ]);

  // Quick actions with navigation
  const quickActions = [
    { 
      icon: UserPlus, 
      label: 'Add Member', 
      color: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/admin-dashboard/team-members')
    },
    { 
      icon: Calendar, 
      label: 'Schedule Class', 
      color: 'bg-green-100 text-green-600',
      onClick: () => navigate('/admin-dashboard/services')
    },
    { 
      icon: Package, 
      label: 'Add Product', 
      color: 'bg-purple-100 text-purple-600',
      onClick: () => navigate('/admin-dashboard/products')
    },
    { 
      icon: BookOpen, 
      label: 'Create Blog', 
      color: 'bg-orange-100 text-orange-600',
      onClick: () => navigate('/admin-dashboard/blog-posts')
    },
    { 
      icon: Settings, 
      label: 'Manage Services', 
      color: 'bg-pink-100 text-pink-600',
      onClick: () => navigate('/admin-dashboard/services')
    },
    { 
      icon: TrendingUp, 
      label: 'View Reports', 
      color: 'bg-indigo-100 text-indigo-600',
      onClick: () => navigate('/admin-dashboard/subscribed-clients')
    },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [
        dashboardStats,
        recentActivities,
        users,
        clients,
        products,
        services,
        teamMembers,
        blogPosts
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities(),
        usersService.getAllUsers(),
        subscribedClientsService.getAllClients(),
        productsService.getAllProducts(),
        servicesService.getAllServices(),
        teamMembersService.getAllTeamMembers(),
        blogPostsService.getAllBlogPosts()
      ]);

      console.log('📊 Dashboard data fetched:', {
        dashboardStats,
        recentActivities,
        usersCount: users.length,
        clientsCount: clients.length,
        productsCount: products.length,
        servicesCount: services.length,
        teamCount: teamMembers.length,
        blogCount: blogPosts.length
      });

      // Update stats
      setStats(dashboardStats);
      
      // Update recent activities
      setRecentActivities(recentActivities);
      
      // Calculate active clients (assuming status 1 is active)
      const activeClients = clients.filter(client => client.status === 1).length;
      
      // Calculate total revenue from clients
      const totalRevenue = clients.reduce((sum, client) => {
        return sum + (parseFloat(client.cost_of_subscription) || 0);
      }, 0);
      
      // Calculate products in stock (assuming status 1 is in stock)
      const productsInStock = products.filter(product => product.status === 1).length;
      
      // Update dashboard stats with real data
      setDashboardStats([
        { 
          title: 'Total Members', 
          value: users.length.toString(), 
          change: '+12%', // You can calculate actual growth here
          icon: Users,
          color: 'from-blue-500 to-blue-600'
        },
        { 
          title: 'Monthly Revenue', 
          value: formatCurrency(totalRevenue), 
          change: '+8%', // You can calculate actual growth here
          icon: DollarSign,
          color: 'from-green-500 to-green-600'
        },
        { 
          title: 'Active Subscriptions', 
          value: activeClients.toString(), 
          change: '+5%', // You can calculate actual growth here
          icon: Activity,
          color: 'from-purple-500 to-purple-600'
        },
        { 
          title: 'Products in Stock', 
          value: productsInStock.toString(), 
          change: '+15%', // You can calculate actual growth here
          icon: Package,
          color: 'from-orange-500 to-orange-600'
        },
      ]);

    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Admin. Here's what's happening with your gym today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 w-full md:w-auto"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="font-medium">Refresh Data</span>
        </button>
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

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="p-3 bg-gray-200 rounded-lg">
                  <div className="w-6 h-6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Database Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-blue-100 text-blue-600`}>
            <Users size={24} />
            <span className="mt-2 text-sm font-medium">Users</span>
            <span className="text-2xl font-bold mt-1">{stats.totalUsers}</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-green-100 text-green-600`}>
            <UserCheck size={24} />
            <span className="mt-2 text-sm font-medium">Clients</span>
            <span className="text-2xl font-bold mt-1">{stats.totalClients}</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-purple-100 text-purple-600`}>
            <Package size={24} />
            <span className="mt-2 text-sm font-medium">Products</span>
            <span className="text-2xl font-bold mt-1">{stats.totalProducts}</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-orange-100 text-orange-600`}>
            <Settings size={24} />
            <span className="mt-2 text-sm font-medium">Services</span>
            <span className="text-2xl font-bold mt-1">{stats.totalServices}</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-pink-100 text-pink-600`}>
            <Users size={24} />
            <span className="mt-2 text-sm font-medium">Team</span>
            <span className="text-2xl font-bold mt-1">{stats.totalTeam}</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-4 rounded-xl bg-indigo-100 text-indigo-600`}>
            <FileText size={24} />
            <span className="mt-2 text-sm font-medium">Blogs</span>
            <span className="text-2xl font-bold mt-1">{stats.totalBlogs}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center p-4 rounded-xl ${action.color} hover:opacity-90 transition-opacity hover:shadow-md`}
            >
              <action.icon size={24} />
              <span className="mt-2 text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => navigate('/admin-dashboard/users')}
            >
              View All
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Recent Users */}
              {recentActivities.recentUsers.slice(0, 3).map((user) => (
                <div key={user.user_id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New user registered: {user.full_name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(user.created_at)} • {formatTime(user.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Recent Clients */}
              {recentActivities.recentClients.slice(0, 2).map((client) => (
                <div key={client.client_id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <UserCheck size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New subscription: {client.client_full_name || 'Unnamed Client'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(client.start_date)} • {formatCurrency(client.cost_of_subscription)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Recent Blogs */}
              {recentActivities.recentBlogs.slice(0, 1).map((blog) => (
                <div key={blog.blog_id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New blog post: {blog.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(blog.created_at)} • {blog.status === 1 ? 'Published' : 'Draft'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between text-sm mb-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Member Growth</span>
                  <span className="font-medium text-green-600">
                    {stats.totalUsers > 0 ? '+12%' : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ 
                      width: `${Math.min((stats.totalUsers / 50) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Client Retention</span>
                  <span className="font-medium text-blue-600">
                    {stats.totalClients > 0 ? '85%' : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ 
                      width: `${Math.min((stats.totalClients / 30) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Product Inventory</span>
                  <span className="font-medium text-purple-600">
                    {stats.totalProducts > 0 ? '92%' : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ 
                      width: `${Math.min((stats.totalProducts / 40) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Content Published</span>
                  <span className="font-medium text-orange-600">
                    {stats.totalBlogs > 0 ? '78%' : '0%'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full" 
                    style={{ 
                      width: `${Math.min((stats.totalBlogs / 20) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
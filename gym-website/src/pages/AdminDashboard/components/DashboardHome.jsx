import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Activity,
  Package,
  FileText,
  Settings
} from 'lucide-react';
import StatCard from './StatCard';

const DashboardHome = () => {
  const stats = [
    { 
      title: 'Total Members', 
      value: '1,284', 
      change: '+12%', 
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Monthly Revenue', 
      value: '$24,580', 
      change: '+8%', 
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Active Subscriptions', 
      value: '856', 
      change: '+5%', 
      icon: Activity,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Classes This Week', 
      value: '42', 
      change: '+15%', 
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    },
  ];

  const quickActions = [
    { icon: Users, label: 'Add Member', color: 'bg-blue-100 text-blue-600' },
    { icon: Calendar, label: 'Schedule Class', color: 'bg-green-100 text-green-600' },
    { icon: Package, label: 'Add Product', color: 'bg-purple-100 text-purple-600' },
    { icon: FileText, label: 'Create Blog', color: 'bg-orange-100 text-orange-600' },
    { icon: Settings, label: 'Manage Services', color: 'bg-pink-100 text-pink-600' },
    { icon: TrendingUp, label: 'View Reports', color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, Admin. Here's what's happening with your gym today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center p-4 rounded-xl ${action.color} hover:opacity-90 transition-opacity`}
            >
              <action.icon size={24} />
              <span className="mt-2 text-sm font-medium">{action.label}</span>
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
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
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
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Member Growth</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-3/4"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Revenue Target</span>
                <span className="font-medium text-blue-600">85%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-4/5"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Class Attendance</span>
                <span className="font-medium text-purple-600">92%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-11/12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
import Card from '../pages/AdminDashboard/components/StatCard';

const Overview = () => {
  // These will be populated with Supabase data later
  const stats = [
    { title: 'Total Members', value: '0', change: '+0%', icon: '👤' },
    { title: 'Active Subscriptions', value: '0', change: '+0%', icon: '💳' },
    { title: 'Monthly Revenue', value: '$0', change: '+0%', icon: '💰' },
    { title: 'Classes This Week', value: '0', change: '+0%', icon: '📅' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities - To be integrated with Supabase */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm italic">No recent activities</p>
            {/* Supabase integration: Fetch activities from database */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              Add Member
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              Schedule Class
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              Send Newsletter
            </button>
            <button className="bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
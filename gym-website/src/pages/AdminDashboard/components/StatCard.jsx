const StatCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2 inline-block">
            {change}
          </span>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${color} w-3/4`}></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  FileText,
  Package,
  Settings,
  Users as TeamUsers,
  UserCheck,
  UserCircle,
  HelpCircle,
  LogOut,
  MessageSquare,
} from "lucide-react";

const Sidebar = ({ onLogout }) => {
  // Update your menuItems array:
  const menuItems = [
    { path: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      path: "/admin-dashboard/consultations",
      icon: MessageSquare,
      label: "Consultations",
    },
    {
      path: "/admin-dashboard/assessments", // Add this line
      icon: Activity, // You'll need to import Activity from lucide-react
      label: "Assessments",
    },
    {
      path: "/admin-dashboard/blog-posts",
      icon: FileText,
      label: "Blog Posts",
    },
    { path: "/admin-dashboard/products", icon: Package, label: "Products" },
    { path: "/admin-dashboard/services", icon: Settings, label: "Services" },
    {
      path: "/admin-dashboard/team-members",
      icon: TeamUsers,
      label: "Team Members",
    },
    {
      path: "/admin-dashboard/subscribed-clients",
      icon: UserCheck,
      label: "Subscribed Clients",
    },
    { path: "/admin-dashboard/users", icon: UserCircle, label: "Users" },
    { path: "/admin-dashboard/faqs", icon: HelpCircle, label: "FAQs" },
    {
      path: "/admin-dashboard/user-questions",
      icon: MessageSquare,
      label: "User Questions",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Fitness Pro</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all mt-2"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import BlogsVideos from './components/BlogsVideos';
import ProductsManagement from './components/ProductsManagement';
import ServicesManagement from './components/ServicesManagement';
import TeamMembers from './components/TeamMembers';
import FAQsManagement from './components/FAQsManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    // FIXED: Changed from '/login' to '/admin-login'
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/blogs-videos" element={<BlogsVideos />} />
          <Route path="/products" element={<ProductsManagement />} />
          <Route path="/services" element={<ServicesManagement />} />
          <Route path="/team-members" element={<TeamMembers />} />
          <Route path="/faqs" element={<FAQsManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
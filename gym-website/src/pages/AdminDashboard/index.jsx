import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import BlogPosts from './components/BlogPosts';
import ProductsManagement from './components/ProductsManagement';
import ServicesManagement from './components/ServicesManagement';
import TeamMembers from './components/TeamMembers';
import SubscribedClients from './components/SubscribedClients';
import Users from './components/Users';
import FAQsManagement from './components/FAQsManagement';
import UserQuestions from './components/UserQuestions';
import ConsultationRequests from './components/ConsultationRequests';
import AssessmentsManager from './components/AssessmentsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/consultations" element={<ConsultationRequests/>}/>
          <Route path="/blog-posts" element={<BlogPosts />} />
          <Route path="/products" element={<ProductsManagement />} />
          <Route path="/services" element={<ServicesManagement />} />
          <Route path="/team-members" element={<TeamMembers />} />
          <Route path="/subscribed-clients" element={<SubscribedClients />} />
          <Route path="/users" element={<Users />} />
          <Route path="/faqs" element={<FAQsManagement />} />
          <Route path="/assessments" element={<AssessmentsManager />} />
          <Route path="/user-questions" element={<UserQuestions/>}/>
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
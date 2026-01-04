import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Products from "./pages/Products";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import FitnessAssessment from "./components/FitnessAssessment";
import AssessmentResults from "./components/AssessmentResults";
import AssessmentStatus from "./components/AssessmentStatus";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/assessment" element={<FitnessAssessment />} />
        <Route path="/assessment/results" element={<AssessmentResults />} />
        <Route
          path="/assessment/results/:assessmentId"
          element={<AssessmentResults />}
        />
        <Route
          path="/assessment/status/:assessmentId"
          element={<AssessmentStatus />}
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

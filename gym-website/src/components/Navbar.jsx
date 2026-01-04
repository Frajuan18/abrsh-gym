import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  UserPlus,
  Calendar,
  Clock,
  User,
  Mail,
  Target,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { consultationService } from "../services/databaseService";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    goals: "",
  });

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showConsultationModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showConsultationModal]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form submitted with data:", formData);

      // Prepare data for Supabase
      const consultationData = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        preferred_date: formData.date,
        preferred_time: formData.time,
        fitness_goals: formData.goals.trim(),
        status: "pending",
      };

      console.log("Consultation data to save:", consultationData);

      // Check if the service exists
      console.log("Checking consultationService:", consultationService);

      // Send to Supabase
      const savedConsultation = await consultationService.createConsultation(
        consultationData
      );

      console.log("Consultation saved to Supabase:", savedConsultation);

      // Success message
      alert(
        `Consultation requested successfully! We'll contact you shortly. Reference ID: ${savedConsultation.id}`
      );

      // Close modal and reset form
      setShowConsultationModal(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        goals: "",
      });
    } catch (error) {
      console.error("❌ Error saving consultation:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });

      // Try a direct Supabase insert as fallback
      try {
        console.log("Trying direct Supabase insert...");

        // Make sure you import supabase at the top of your file:
        // import { supabase } from '../lib/supabase';

        const { data, error: supabaseError } = await supabase
          .from("consultation_requests")
          .insert([
            {
              full_name: formData.fullName.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              preferred_date: formData.date,
              preferred_time: formData.time,
              fitness_goals: formData.goals.trim(),
              status: "pending",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (supabaseError) {
          console.error("Direct Supabase insert failed:", supabaseError);
          throw supabaseError;
        }

        console.log("Direct insert successful:", data);
        alert(
          "Consultation requested successfully! We'll contact you shortly."
        );
      } catch (directError) {
        console.error("All insert methods failed:", directError);

        // Final fallback to local storage
        const consultations = JSON.parse(
          localStorage.getItem("consultation_requests") || "[]"
        );
        consultations.push({
          ...formData,
          id: "local-" + Date.now().toString(),
          submitted_at: new Date().toISOString(),
          status: "pending",
        });
        localStorage.setItem(
          "consultation_requests",
          JSON.stringify(consultations)
        );

        console.log("Saved to localStorage:", consultations);
        alert(
          "Consultation requested successfully! We'll contact you shortly. (Saved locally)"
        );
      }

      // Close modal and reset form
      setShowConsultationModal(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        goals: "",
      });
    }
  };

  const navItems = [
    { label: "About Us", path: "/about", hasDropdown: false },
    {
      label: "Services",
      path: "/services",
      hasDropdown: true,
      dropdownItems: [
        { name: "Training Services", path: "/services#training" },
        { name: "Personal Coaching", path: "/services#coaching" },
        { name: "Group Classes", path: "/services#classes" },
        { name: "Nutrition Planning", path: "/services#nutrition" },
      ],
    },
    { label: "Pricing", path: "/pricing", hasDropdown: false },
    { label: "Products", path: "/products", hasDropdown: false },
    { label: "Blog", path: "/blog", hasDropdown: false }, // Add this line
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 font-['Poppins'] ${
          scrolled
            ? "bg-white/90 backdrop-blur-md py-3 shadow-lg shadow-gray-200/50"
            : "bg-white py-5 border-b border-gray-100"
        }`}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          .font-poppins { font-family: 'Poppins', sans-serif; }
        `}</style>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <Link to="/" className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <span className="text-white font-bold text-xl -rotate-3 group-hover:-rotate-6 transition-transform">
                    FFL
                  </span>
                </div>
                <div className="absolute inset-0 bg-orange-400 rounded-2xl -z-10 blur-sm opacity-0 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                  FITNESS
                </h1>
                <p className="text-[10px] font-semibold text-orange-600 tracking-[0.2em] uppercase">
                  For Life
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-10">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.hasDropdown ? (
                    <div
                      onMouseEnter={() => setIsServicesOpen(true)}
                      onMouseLeave={() => setIsServicesOpen(false)}
                      className="relative py-2"
                    >
                      <Link
                        to={item.path}
                        className="flex items-center space-x-1 text-gray-600 hover:text-orange-600 font-medium transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            isServicesOpen ? "rotate-180 text-orange-600" : ""
                          }`}
                        />
                      </Link>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute top-full -left-4 w-72 pt-4 transition-all duration-300 ${
                          isServicesOpen
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-3">
                          {item.dropdownItems.map((sub, idx) => (
                            <Link
                              key={idx}
                              to={sub.path}
                              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-orange-50 transition-colors group/item"
                              onClick={() => setIsServicesOpen(false)}
                            >
                              <div className="mt-1 p-2 bg-orange-100 text-orange-600 rounded-lg group-hover/item:bg-orange-600 group-hover/item:text-white transition-colors">
                                <div className="w-5 h-5 flex items-center justify-center">
                                  •
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {sub.name}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-600 hover:text-orange-600 font-medium transition-colors relative py-2 group"
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Free Consultation Button */}
              <button
                onClick={() => setShowConsultationModal(true)}
                className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group"
              >
                <div className="relative">
                  <Phone
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span>Free Consultation</span>
              </button>

              {/* Register Button */}
              <Link
                to="/register"
                className="flex items-center space-x-2 bg-gradient-to-br from-orange-600 to-orange-700 text-white px-7 py-3 rounded-full font-bold shadow-lg shadow-orange-600/30 hover:shadow-xl hover:shadow-orange-600/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group"
              >
                <div className="relative">
                  <UserPlus
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-orange-300 rounded-full blur-sm opacity-0 group-hover:opacity-70 transition-opacity"></div>
                </div>
                <span>Register Now</span>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-x-0 top-[72px] p-4 lg:hidden transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-10 pointer-events-none"
          }`}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 space-y-6">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.hasDropdown ? (
                  <>
                    <Link
                      to={item.path}
                      className="w-full flex justify-between items-center text-xl font-semibold text-gray-900 mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      <ChevronDown />
                    </Link>
                    <div className="mt-2 ml-4 space-y-3">
                      {item.dropdownItems.map((sub, i) => (
                        <Link
                          key={i}
                          to={sub.path}
                          className="block py-2 text-gray-600 hover:text-orange-600 font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                            <span>{sub.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="block w-full text-xl font-semibold text-gray-900 hover:text-orange-600 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-6 space-y-3">
              <button
                onClick={() => {
                  setShowConsultationModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-white text-blue-600 py-4 rounded-2xl font-bold shadow-lg border border-blue-200 hover:shadow-xl transition-all"
              >
                <Phone size={18} />
                <span>Free Consultation</span>
              </button>

              <Link
                to="/register"
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-br from-orange-600 to-orange-700 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                onClick={() => setIsOpen(false)}
              >
                <UserPlus size={18} />
                <span>Register Now</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConsultationModal(false)}
          ></div>

          {/* Modal Content - Increased width and side-by-side fields */}
          <div className="relative bg-white rounded-3xl w-full max-w-xl h-[70vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setShowConsultationModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <XCircle size={20} className="text-gray-600" />
            </button>

            {/* Content Area */}
            <div className="flex flex-col h-full">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Schedule Your Free Consultation
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Tell us about your goals and we'll help create a
                      personalized plan for you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form - No scrolling needed */}
              <form
                onSubmit={handleSubmit}
                className="p-6 flex-1 overflow-y-auto"
              >
                <div className="space-y-4">
                  {/* Full Name - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email and Phone side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <Calendar
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleFormChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <Clock
                          size={16}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleFormChange}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none bg-white"
                          required
                        >
                          <option value="">Select a time</option>
                          <option value="9:00 AM">9:00 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="3:00 PM">3:00 PM</option>
                          <option value="4:00 PM">4:00 PM</option>
                          <option value="5:00 PM">5:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Fitness Goals - Full width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are your fitness goals?
                    </label>
                    <div className="relative">
                      <Target
                        size={16}
                        className="absolute left-3 top-3 text-gray-400"
                      />
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        rows="3"
                        placeholder="Tell us about your goals, any injuries, experience level, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowConsultationModal(false)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm hover:shadow-md transition-all"
                  >
                    Request Consultation
                  </button>
                </div>
              </form>

              {/* Footer Note */}
              <div className="px-6 pb-6">
                <p className="text-center text-xs text-gray-500">
                  We'll contact you within 24 hours to confirm your consultation
                  time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

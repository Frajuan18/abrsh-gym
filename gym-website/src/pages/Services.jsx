import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServicesHeader from '../components/ServicesHeader';
import ServicesExplorer from '../components/ServicesExplorer';

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ServicesHeader />
      <ServicesExplorer />
      {/* Add more sections as needed */}
      <Footer />
    </div>
  );
};

export default Services;
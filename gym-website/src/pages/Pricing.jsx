import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingHeader from '../components/PricingHeader';
import PricingComponent from '../components/PricingComponent';
import AddOnServices from '../components/AddOnServices';
import FAQComponent from '../components/FAQComponent';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PricingHeader />
      <PricingComponent />
      <AddOnServices />
      <FAQComponent/>
      <Footer />
    </div>
  );
};

export default Pricing;
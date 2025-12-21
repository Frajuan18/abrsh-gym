import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import ReadyToStartBanner from '../components/ReadyToStartBanner';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <HowItWorks />
      <ReadyToStartBanner />
      <FAQSection />
      <Footer />
    </>
  );
};

export default Home;
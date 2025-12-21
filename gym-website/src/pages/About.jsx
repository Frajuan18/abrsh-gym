import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHeader from '../components/AboutHeader';
import OurStory from '../components/OurStory';
import OurValues from '../components/OurValues';
import MeetOurTeam from '../components/MeetOurTeam';
import Certifications from '../components/Certifications';

const About = () => {
  return (
    <>
      <Navbar />
      <AboutHeader />
      <OurStory />
      <OurValues />
      <MeetOurTeam />
      <Certifications />
      <Footer />
    </>
  );
};

export default About;
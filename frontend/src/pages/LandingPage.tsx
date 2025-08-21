import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import WhySection from '../components/WhySection';
import Features from '../components/Features';
import Footer from '../components/Footer';
import CTA from '../components/CTA';

const BrieflyLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Hero />
      <WhySection />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default BrieflyLanding;
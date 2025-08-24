import React, { useState } from 'react';
import Navbar from '../components/landing-page/Navbar';
import Hero from '../components/landing-page/Hero';
import WhySection from '../components/landing-page/WhySection';
import Features from '../components/landing-page/Features';
import Footer from '../components/landing-page/Footer';
import CTA from '../components/landing-page/CTA';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <Hero />
      <WhySection />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
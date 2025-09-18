import React from 'react';
import Header from '@/components/landingPage/Header';
import HeroSection from '@/components/landingPage/HeroSection';
import Features from '@/components/landingPage/Features';
import DashboardPreview from '@/components/landingPage/DashboardPreview';
import Testimonials from '@/components/landingPage/Testimonals';
import Pricing from '@/components/landingPage/Pricing';
import Footer from '@/components/landingPage/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Features />
        <DashboardPreview />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;

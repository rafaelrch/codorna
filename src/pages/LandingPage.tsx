import React, { useState } from 'react';
import Header from '@/components/landingPage/Header';
import HeroSection from '@/components/landingPage/HeroSection';
import Features from '@/components/landingPage/Features';
import DashboardPreview from '@/components/landingPage/DashboardPreview';
import VideoDemoSection from '@/components/landingPage/VideoDemoSection';
import AdvisorSection from '@/components/landingPage/AdvisorSection';
import Testimonials from '@/components/landingPage/Testimonals';
import Pricing from '@/components/landingPage/Pricing';
import FAQ from '@/components/landingPage/FAQ';
import Footer from '@/components/landingPage/Footer';
import { WaitlistPopup } from '@/components/WaitlistPopup';

const LandingPage = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <>
      <div className={`min-h-screen transition-all duration-300 ${isWaitlistOpen ? 'waitlist-blur' : ''}`}>
        <Header onOpenWaitlist={() => setIsWaitlistOpen(true)} />
        <main>
          <HeroSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
          <Features />
          <DashboardPreview />
          <VideoDemoSection />
          <AdvisorSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
          {/* <Testimonials /> */}
          <Pricing onOpenWaitlist={() => setIsWaitlistOpen(true)} />
          <FAQ />
        </main>
        <Footer />
      </div>
      
      <WaitlistPopup 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </>
  );
};

export default LandingPage;

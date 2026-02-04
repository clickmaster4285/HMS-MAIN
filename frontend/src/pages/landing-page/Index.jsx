import React, { useState, useEffect } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import ClientsSection from "./ClientSection";
import WhyChooseSection from "./WhyChooseSection";
import MobileAppSection from "./MobileAppSection";
import PeopleSection from "./PeopleSection";
import FeaturesSection from "./FeaturesSection";
import DashboardShowcaseSection from "./DashboardShowcaseSection";
import TaskManagementSection from "./TaskManagmentSection";
import StatsSection from "./StatsSection";
import PricingSection from "./PricingSection";
import TestimonialsSection from "./TestimonialSection";
import CTASection from "./CTASection";
import ContactSection from "./ContactSection";
import Footer from "./FooterSection";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  useEffect(() => {
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 4);
    }, 5000);

    // Scroll detection for header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      clearInterval(testimonialInterval);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="overflow-x-hidden bg-white">
      <div className="divide-y divide-gray-200">
        <Header 
          isMenuOpen={isMenuOpen} 
          toggleMenu={toggleMenu} 
          isScrolled={isScrolled}
          scrollToSection={scrollToSection}
        />

        <main className="divide-y divide-gray-500">
          <section id="hero" className="scroll-mt-20">
            <HeroSection scrollToSection={scrollToSection} />
          </section>
          
          <section id="clients" className="scroll-mt-20">
            <ClientsSection />
          </section>
          
          <section id="why-choose" className="scroll-mt-20">
            <WhyChooseSection />
          </section>
          
          <section id="mobile-app" className="scroll-mt-20">
            <MobileAppSection />
          </section>
          
          <section id="people" className="scroll-mt-20">
            <PeopleSection />
          </section>
          
          <section id="dashboard" className="scroll-mt-20">
            <DashboardShowcaseSection />
          </section>
          
          <section id="task-management" className="scroll-mt-20">
            <TaskManagementSection />
          </section>
          
          <section id="stats" className="scroll-mt-20">
            <StatsSection />
          </section>
          
          <section id="pricing" className="scroll-mt-20">
            <PricingSection />
          </section>
          
          <section id="testimonials" className="scroll-mt-20">
            <TestimonialsSection 
              activeTestimonial={activeTestimonial} 
              setActiveTestimonial={setActiveTestimonial} 
            />
          </section>
          
          <section id="cta" className="scroll-mt-20">
            <CTASection />
          </section>
          
          <section id="contact" className="scroll-mt-20">
            <ContactSection />
          </section>
        </main>
        
        <footer id="footer">
          <Footer scrollToSection={scrollToSection} />
        </footer>
      </div>
    </div>
  );
};

export default App;
'use client';

import AdvisorCard from '@/components/AdvisorCard';
import AdvisorFilters from '@/components/AdvisorFilters';
import HeroSection from '@/components/HeroSection';
import BenefitsGrid from '@/components/BenefitsGrid';

// [TEMPORARY] PowerPlayCTA import is commented out to remove the component from the UI. To restore, uncomment this line and its usage below.
// import PowerPlayCTA from '@/components/PowerPlayCTA';
import VideoSection from '@/components/VideoSection';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ResultsHeader from '@/components/ResultsHeader';
import NoResults from '@/components/NoResults';
import { mockAdvisors, Advisor, Location, Specialization, AudienceType } from '@/services/data/advisors';
import { useState, useEffect } from 'react';
import FAQAccordion from '@/components/FAQAccordion';
// import Marketplace from "./marketplace/page";

const faqs = [
  {
    question: "Who are the financial advisors on Spring Money?",
    answer:
      "Our network consists exclusively of SEBI-registered investment advisors. This ensures that you receive expert financial guidance from professionals who are regulated and held to the highest ethical and professional standards.",
  },
  {
    question: "How does Spring Money connect me with an advisor?",
    answer:
      "To begin, simply reach out to us via WhatsApp. We'll initiate a conversation to understand your specific financial goals, current situation, and preferences. Based on this, we'll match you with a suitable advisor from our network. This personalized approach ensures you find an advisor whose expertise aligns with your needs.",
  },
  {
    question: "What types of financial planning do you offer?",
    answer:
      "Our partner advisors provide personalized financial planning services designed to address your unique circumstances. They offer a comprehensive suite of solutions, encompassing everything from holistic financial planning that integrates investments, retirement, insurance, tax optimization, debt management, and budgeting, to focused strategies for building and managing your investment portfolio. Additionally, they specialize in retirement planning to ensure a secure future and goal-based planning to help you achieve specific financial objectives like homeownership or educational funding.",
  },
  {
    question: "Is Spring Money suitable for all income levels?",
    answer:
      "Yes, absolutely. We believe that everyone deserves access to quality financial advice. Our services are designed to be flexible and adaptable, catering to individuals at every stage of their financial journey, from those just starting out to those managing substantial wealth.",
  },
  {
    question: "Are the financial tools on your website free to use?",
    answer:
      "Yes, our financial calculators are completely free to use. They are designed to provide you with valuable insights and help you make informed financial decisions.",
  },
  {
    question: "What are the costs associated with financial planning?",
    answer:
      "You get a range of financial planning options, including one-time consultations and comprehensive, ongoing planning services. Pricing varies depending on the complexity of your financial situation and the services you require. We recommend contacting us via WhatsApp to discuss your specific needs and receive a personalized quote.",
  },
];

export default function Marketplace() {
  // State for filters
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedSpecializations, setSelectedSpecializations] = useState<Specialization[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<AudienceType | null>(null);
  const [filteredAdvisors, setFilteredAdvisors] = useState<Advisor[]>(mockAdvisors);

  // Apply filters whenever filter states change
  // useEffect(() => {
  //   let result = [...mockAdvisors];
    
  //   // Filter by location if selected
  //   if (selectedLocation) {
  //     result = result.filter(advisor => advisor.location === selectedLocation);
  //   }
    
  //   // Filter by specializations if any are selected
  //   if (selectedSpecializations.length > 0) {
  //     result = result.filter(advisor => 
  //       selectedSpecializations.some(spec => advisor.specializations.includes(spec))
  //     );
  //   }
    
  //   // Filter by audience if selected
  //   if (selectedAudience) {
  //     result = result.filter(advisor => 
  //       advisor.audience.includes(selectedAudience)
  //     );
  //   }
    
  //   setFilteredAdvisors(result);
  // }, [selectedLocation, selectedSpecializations, selectedAudience]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Benefits Grid */}
      <BenefitsGrid />
      
      {/* Video Section */}
      <VideoSection />
      
      {/* Power Play CTA Carousel */}
      {/* [TEMPORARY] PowerPlayCTA usage is commented out to remove the component from the UI. To restore, uncomment this line and ensure the import above is also uncommented.
      <PowerPlayCTA /> */}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12" id="advisorList">
        {/* Filters */}
        {/* <AdvisorFilters 
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedSpecializations={selectedSpecializations}
          setSelectedSpecializations={setSelectedSpecializations}
          selectedAudience={selectedAudience}
          setSelectedAudience={setSelectedAudience}
        /> */}
        
        {/* Results Header */}
        <ResultsHeader 
          totalAdvisors={mockAdvisors.length}
          filteredAdvisorsCount={filteredAdvisors.length}
        />
        
        {/* Advisor Cards Grid */}
        {filteredAdvisors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvisors.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>
        ) : (
          <NoResults />
        )}
      </div>
      
      <FAQAccordion faqs={faqs} />
      {/* Testimonials Carousel */}
      {/* <TestimonialsCarousel /> */}
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-16 sm:py-24 px-4 bg-gradient-to-br from-green-50 to-green-100 bg-pattern">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#108e66] mb-6 leading-tight">
            Find Your Trusted Financial Advisor
          </h1>
          <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-600 mb-8">
            Browse SEBI-Registered Investment Advisors curated by Spring Money
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#advisorList"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#108E66] px-8 font-medium text-[#FCFFFE] shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#108E66] focus:ring-offset-2"
            >
              Browse Advisors
            </a>
            <Link 
              href="/services/onboarding"
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#108E66] bg-transparent px-8 font-medium text-[#108E66] hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-[#108E66] focus:ring-offset-2"
            >
              List Your Practice
            </Link>
          </div>
        </div>
        
        <div className="flex flex-nowrap justify-center gap-8 mb-6 mt-8 flex-wrap sm:flex-nowrap">
          <div className="flex items-center">
            <span className="bg-[#108E66] rounded-full h-2 w-2 mr-2"></span>
            <span className="text-[#020817]">SEBI Registered</span>
          </div>
          <div className="flex items-center">
            <span className="bg-[#108E66] rounded-full h-2 w-2 mr-2"></span>
            <span>Verified Credentials</span>
          </div>
          <div className="flex items-center">
            <span className="bg-[#108E66] rounded-full h-2 w-2 mr-2"></span>
            <span>Transparent Fees</span>
          </div>
          <div className="flex items-center">
            <span className="bg-[#108E66] rounded-full h-2 w-2 mr-2"></span>
            <span>Fiduciary Standard</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div 
        className="absolute -top-5 -left-5 w-24 h-24 rounded-full bg-green-200 opacity-70 animate-pulse" 
        style={{ animationDuration: '3s' }}
      ></div>
      <div 
        className="absolute top-1/2 -right-10 w-32 h-32 rounded-full bg-green-200 opacity-60 animate-pulse" 
        style={{ animationDuration: '4s', animationDelay: '0.5s' }}
      ></div>
      <div 
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full bg-green-200 opacity-50 animate-pulse" 
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      ></div>
    </div>
  );
};

export default HeroSection;

"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

// Define advisor interface
interface ContactDetails {
  email: string;
  phone?: string;
}

interface Advisor {
  id: string;
  advisorName: string;
  tagline: string;
  about: string;
  location: string;
  specializations: string[];
  yearsOfExperience: number;
  isVerified: boolean;
  profileImage: string;
  contactDetails: ContactDetails;
}

// Mock data (inlined instead of imported)
const mockAdvisors: Advisor[] = [
  {
    id: "1",
    advisorName: "Sarah Johnson, CFP®",
    tagline: "Financial Planning for Young Professionals",
    about: "With over 15 years of experience in personal financial planning, I specialize in helping young professionals build strong financial foundations. My approach focuses on practical, actionable advice tailored to each client's unique situation and goals.",
    location: "Mumbai, Maharashtra",
    specializations: ["Retirement Planning", "Tax Planning", "Investment Management"],
    yearsOfExperience: 15,
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=300&auto=format&fit=crop",
    contactDetails: {
      email: "sarah@springmoney.com",
      phone: "+91 98765 43210"
    }
  },
  {
    id: "2",
    advisorName: "Rajesh Patel, CFA",
    tagline: "Wealth Management & Investment Strategies",
    about: "I help high-net-worth individuals optimize their investment portfolios and create comprehensive wealth management strategies. My background in financial analysis allows me to identify unique opportunities in the market.",
    location: "Bangalore, Karnataka",
    specializations: ["Portfolio Management", "Estate Planning", "Wealth Preservation"],
    yearsOfExperience: 12,
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1556157382-97eda2f9671e?q=80&w=300&h=300&auto=format&fit=crop",
    contactDetails: {
      email: "rajesh@springmoney.com",
      phone: "+91 87654 32109"
    }
  },
  {
    id: "3",
    advisorName: "Priya Sharma, EA",
    tagline: "Tax Optimization for Business Owners",
    about: "As a specialist in tax planning for entrepreneurs and small business owners, I help clients navigate complex tax regulations and implement strategies to minimize tax burdens while maintaining compliance.",
    location: "Delhi, NCR",
    specializations: ["Tax Planning", "Business Planning", "Retirement Strategies"],
    yearsOfExperience: 8,
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&h=300&auto=format&fit=crop",
    contactDetails: {
      email: "priya@springmoney.com",
      phone: "+91 76543 21098"
    }
  }
];

const AdvisorDetail = () => {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
  const advisor = mockAdvisors.find((a: Advisor) => a.id === id);

  if (!advisor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFFFE]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-[#272A2B]">Advisor Not Found</h2>
          <p className="mb-4 text-[#272A2B]">We couldn't find the advisor you're looking for.</p>
          <Link href="/lovable-test" className="text-[#108E66] hover:underline">
            Return to Advisor Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#FCFFFE] border-b border-gray-200 pb-6">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <Link href="/lovable-test" className="inline-flex items-center text-[#108E66] hover:text-opacity-80 mb-6">
            Back to Advisors
          </Link>
          
          <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <div className="relative h-full w-full">
                  <Image
                    src={advisor.profileImage || "https://via.placeholder.com/300"}
                    alt={advisor.advisorName}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-[#272A2B]">{advisor.advisorName}</h1>
                {advisor.isVerified && (
                  <div className="flex items-center bg-green-100 text-[#108E66] px-2 py-0.5 rounded text-sm font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </div>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mb-4">{advisor.tagline}</p>
              
              <div className="grid gap-6 sm:grid-cols-2 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                  <p className="text-[#272A2B]">{advisor.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
                  <p className="text-[#272A2B]">{advisor.yearsOfExperience} years</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {advisor.specializations.map((specialization: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-[#272A2B]">
                    {specialization}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#272A2B]">About {advisor.advisorName}</h2>
              <div className="prose text-gray-600 max-w-none">
                <p>{advisor.about}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-[#FCFFFE] rounded-lg border border-gray-200 p-6 mb-6 sticky top-6">
              <h3 className="font-semibold text-lg mb-4 text-[#272A2B]">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${advisor.contactDetails.email}`} className="text-[#108E66] hover:underline">
                      {advisor.contactDetails.email}
                    </a>
                  </div>
                </div>
                
                {advisor.contactDetails.phone && (
                  <div className="flex items-start">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${advisor.contactDetails.phone}`} className="hover:underline text-[#272A2B]">
                        {advisor.contactDetails.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <div>
                    <p className="text-sm text-gray-500">Office Location</p>
                    <address className="not-italic text-[#272A2B]">
                      {advisor.location}
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <AdvisorDetail />;
}

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  // This is a simplified version of the marketplace
  const advisors = [
    {
      id: "1",
      advisorName: "Sarah Johnson, CFP®",
      tagline: "Financial Planning for Young Professionals",
      location: "Mumbai, Maharashtra",
      specializations: ["Retirement Planning", "Tax Planning", "Investment Management"],
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=300&auto=format&fit=crop"
    },
    {
      id: "2",
      advisorName: "Rajesh Patel, CFA",
      tagline: "Wealth Management & Investment Strategies",
      location: "Bangalore, Karnataka",
      specializations: ["Portfolio Management", "Estate Planning", "Wealth Preservation"],
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1556157382-97eda2f9671e?q=80&w=300&h=300&auto=format&fit=crop"
    },
    {
      id: "3",
      advisorName: "Priya Sharma, EA",
      tagline: "Tax Optimization for Business Owners",
      location: "Delhi, NCR",
      specializations: ["Tax Planning", "Business Planning", "Retirement Strategies"],
      isVerified: true,
      profileImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&h=300&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Spring Money Advisor Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with trusted financial professionals who can help guide your financial journey
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {advisors.map((advisor) => (
            <div key={advisor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <Image
                  src={advisor.profileImage}
                  alt={advisor.advisorName}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{advisor.advisorName}</h3>
                  {advisor.isVerified && (
                    <div className="flex items-center bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                      ✓ Verified
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{advisor.tagline}</p>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <span>{advisor.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {advisor.specializations.map((specialization, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                      {specialization}
                    </span>
                  ))}
                </div>
                
                <Link href={`/lovable-test/advisor/${advisor.id}`} className="block w-full text-center py-2 px-4 border border-[#108E66] text-[#108E66] hover:bg-[#108E66] hover:text-white transition-colors rounded font-medium">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/lovable-test/onboarding" className="inline-block py-3 px-8 bg-[#108E66] text-white rounded-md font-medium hover:bg-opacity-90 transition-colors">
            List Your Advisory Practice
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, Calendar, Mail, MessageSquare } from 'lucide-react';

export default function OnboardingForm() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/services" className="inline-flex items-center text-[#108E66] hover:text-opacity-80 mb-6">
          <ArrowLeft size={16} className="mr-1" />
          Back to Marketplace
        </Link>
        
        <div className="rounded-lg border border-gray-200 bg-[#FCFFFE] shadow-sm">
          <div className="text-center p-6 pb-0">
            <h1 className="text-3xl font-bold text-[#272A2B]">List Your Advisory Practice</h1>
            <p className="text-lg text-gray-600 mt-2">
              Join the Spring Money advisor network and connect with clients who value trusted financial guidance
            </p>
          </div>
          
          <div className="p-6">
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium mb-4 text-[#272A2B]">Why join Spring Money RIA Marketplace?</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3">
                  <div className="h-10 w-10 aspect-square flex-shrink-0 rounded-full bg-[#108E66] flex items-center justify-center text-[#FCFFFE] font-medium">1</div>
                  <div>
                    <h4 className="font-medium text-[#272A2B]">Targeted Visibility</h4>
                    <p className="text-sm text-gray-500">Reach clients specifically looking for registered advisors</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 aspect-square flex-shrink-0 rounded-full bg-[#108E66] flex items-center justify-center text-[#FCFFFE] font-medium">2</div>
                  <div>
                    <h4 className="font-medium text-[#272A2B]">Trust Badge</h4>
                    <p className="text-sm text-gray-500">Spring Money verification increases client confidence</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 aspect-square flex-shrink-0 rounded-full bg-[#108E66] flex items-center justify-center text-[#FCFFFE] font-medium">3</div>
                  <div>
                    <h4 className="font-medium text-[#272A2B]">Quality Leads</h4>
                    <p className="text-sm text-gray-500">Connect with financially educated clients</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 aspect-square flex-shrink-0 rounded-full bg-[#108E66] flex items-center justify-center text-[#FCFFFE] font-medium">4</div>
                  <div>
                    <h4 className="font-medium text-[#272A2B]">Professional Profile</h4>
                    <p className="text-sm text-gray-500">Showcase your expertise and services</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="mb-6 text-[#272A2B]"> Get in touch with us on whatsapp or email for the next steps.</p>
              <div className="flex justify-center gap-4 mt-6">
                <a
                  href={`mailto:omkar.springmoney@gmail.com`}
                  className="inline-flex h-10 items-center justify-center rounded-md px-4 font-medium shadow focus:outline-none focus:ring-2 focus:ring-[#108E66] focus:ring-offset-2"
                  style={{ backgroundColor: '#018e66', color: '#fcfffe' }}
                >
                  <Mail size={16} className="mr-2" />
                  Contact via Email
                </a>

                <a
                  href={`https://wa.me/+91 8666884607`}
                  className="inline-flex h-10 items-center justify-center rounded-md px-4 font-medium shadow focus:outline-none focus:ring-2 focus:ring-[#108E66] focus:ring-offset-2"
                  style={{ backgroundColor: '#018e66', color: '#fcfffe' }}
                >
                  <MessageSquare size={16} className="mr-2" />
                  Contact via WhatsApp
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                By applying, you agree to Spring Money <a href="#" className="underline hover:text-[#108E66]">Terms of Service</a> and <a href="#" className="underline hover:text-[#108E66]">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

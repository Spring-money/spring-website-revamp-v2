"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DemoCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  color: string;
}

const DemoCard = ({ title, description, href, icon, color }: DemoCardProps) => {
  return (
    <Link 
      href={href}
      className={`block p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {icon || <ArrowRight className="text-white" />}
      </div>
      <p className="text-white/90 mb-4">{description}</p>
      <div className="flex justify-end">
        <span className="inline-flex items-center text-white text-sm">
          Try Demo <ArrowRight size={16} className="ml-1" />
        </span>
      </div>
    </Link>
  );
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#fcfffe] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-[#272B2A] sm:text-4xl">
            Spring Money Demo Hub
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Explore our integration demos with various financial services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DemoCard
            title="Digilocker Integration"
            description="Connect to Digilocker to fetch and verify user documents and personal information."
            href="/demo/digilocker"
            color="bg-[#108e66]"
          />
          
          <DemoCard
            title="Equity Trading"
            description="Execute equity trades through our SmallCase integration with various brokers."
            href="/demo/equity"
            color="bg-[#108e66]/90"
          />
          
          <DemoCard
            title="NSE Mutual Funds"
            description="Invest in mutual funds through NSE's NMF II platform with UPI payments."
            href="/demo/nse"
            color="bg-[#108e66]/80"
          />
          
          <DemoCard
            title="BSE Star MF"
            description="Invest in mutual funds through BSE's Star MF platform with various payment options."
            href="/demo/bse"
            color="bg-[#108e66]/70"
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            These demos showcase Spring Money's integration capabilities with various financial platforms.
            <br />
            For more information, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
} 
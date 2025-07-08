"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToDemoButton() {
  return (
    <div className="mb-6 mt-4 ml-4">
      <Link 
        href="/demo" 
        className="inline-flex items-center px-4 py-2 bg-white rounded-md shadow-sm border border-[#108e66] text-[#108e66] hover:bg-[#108e66] hover:text-white transition-colors duration-200"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span>Back to Demo Hub</span>
      </Link>
    </div>
  );
} 
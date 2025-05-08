"use client";
import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-4">This advisor's blogs will be available soon</p>
        <Link href="/lovable-test" className="text-blue-500 hover:text-blue-700 underline">
          Return to Advisors
        </Link>
      </div>
    </div>
  );
};

export default function Page() {
  return <NotFound />;
}

"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const BlogDetail = () => {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Coming Soon</h1>
        <p className="text-xl text-gray-600 mb-4">The blog post "{slug}" will be available soon</p>
        <Link href="/lovable-test" className="text-blue-500 hover:text-blue-700 underline">
          Return to Advisors
        </Link>
      </div>
    </div>
  );
};

export default function Page() {
  return <BlogDetail />;
}

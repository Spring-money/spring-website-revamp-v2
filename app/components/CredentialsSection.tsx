"use client"
import React from 'react';

interface CredentialsSectionProps {
  credentials: string[];
}

const CredentialsSection = ({ credentials }: CredentialsSectionProps) => {
  // Don't render if no credentials
  if (!credentials || credentials.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4">Credentials</h3>
      <div className="space-y-3">
        {credentials.map((credential, index) => (
          <div key={index} className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <svg 
                className="h-4 w-4 text-green-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <span className="text-gray-800">{credential}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialsSection; 
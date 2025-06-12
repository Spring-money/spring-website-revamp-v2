// src/components/TestimonialCard.tsx
import React from "react";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  testimonial: {
    text: string;
    author: string;
    designation?: string;
  };
  audience?: string[];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  audience = [],
}) => (
  <Card className="relative flex h-full flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    {/* Quote */}
    <blockquote className="text-left italic leading-relaxed text-[#272A2B]">
      &ldquo;{testimonial.text}&rdquo;
    </blockquote>

    {/* Footer row */}
    <div className="mt-auto flex items-end justify-between">
      {/* Audience pill (show only the first tag) */}
      {audience[0] && (
        <span className="inline-block rounded-full bg-[#D9F9F0] px-3 py-1 text-xs font-semibold text-[#018E66]">
          {audience[0]}
        </span>
      )}

      {/* Author block */}
      <div className="text-left">
        <p className="font-semibold text-[#272A2B]">{testimonial.author}</p>
        {testimonial.designation && (
          <p className="text-sm text-gray-500">{testimonial.designation}</p>
        )}
      </div>
    </div>
  </Card>
);

export default TestimonialCard;

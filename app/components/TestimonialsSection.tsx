import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  imageSrc: string;
  videoTitle: string;
  personName: string;
  personRole: string;
  youtubeLink: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    imageSrc: '/images/testimonial-aishwarya.svg', // Replace with actual image path
    videoTitle: 'Why Financial Planning is Life - Saving',
    personName: 'Aishwarya Pawar',
    personRole: 'Entrepreneur',
    youtubeLink: 'https://youtu.be/XcrNiRIoGP0?si=Fi2cBqovbFRtotEy',
  },
  {
    id: 2,
    imageSrc: '/images/testimonial-neha.svg', // Replace with actual image path
    videoTitle: 'From Financial Uncertainty to Confident Wealth Planning',
    personName: 'Neha Saggam',
    personRole: 'Technology Professional',
    youtubeLink: 'https://youtu.be/6xACFcllpE0?si=TbSm2kRmzIz7Wpsm',
  },
  {
    id: 3,
    imageSrc: '/images/testimonial-ria.svg', // Replace with actual image path
    videoTitle: 'Financial Planning for Youngsters',
    personName: 'Ria Unawane',
    personRole: 'Social Media Manager',
    youtubeLink: 'https://youtu.be/IMkBkwZUI6k?si=RXIYzpdlMdBz029M',
  },
];

const TestimonialCard: React.FC<Testimonial> = ({ imageSrc, videoTitle, personName, personRole, youtubeLink }) => {
  return (
    <Card className="bg-white border-[1px] border-black rounded-[8px] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col font-sans w-[420px] h-[440px] p-4">
      <div className="relative w-full h-[300px] rounded-t-[8px] overflow-hidden pt-4 px-4 bg-white">
        <Image
          src={imageSrc}
          alt={videoTitle}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            aspectRatio: '16/9',
            padding: 0
          }}
        />
      </div>

      <CardContent className="p-1 flex flex-col flex-grow">
        <div className="flex flex-col flex-1">
          <h3 className="text-2xl font-bold text-[#272A2B] leading-snug mb-2 w-[380px] h-[60px] gap-4 flex flex-col">{videoTitle}</h3>
          <span className="text-lg font-bold text-[#272A2B] mb-0.5">{personName}</span>
          <span className="text-base font-semibold mb-4" style={{ color: '#108e66' }}>{personRole}</span>
        </div>
        <Link
          href={youtubeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block w-full text-center py-2 px-4 border border-black text-[#108E66] rounded-md font-semibold hover:bg-[#108E66] hover:text-white transition-colors duration-300"
        >
          Watch on YouTube
        </Link>
      </CardContent>  
    </Card>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    <div className="py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#272A2B] text-center mb-12">
          Don't just take our word for it
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;

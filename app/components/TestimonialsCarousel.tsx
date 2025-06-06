/* /components/TestimonialsCarousel.tsx */
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';            // ← use next/image instead of <img>
import TestimonialCard from './TestimonialCard';
import { Testimonial } from '@/services/data/advisors';

/* ───────── data ───────── */
interface VideoTestimonial {
  id: string;
  title: string;
  description: string;
  author: string;
  role: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const videoTestimonials: VideoTestimonial[] = [
  {
    id: '1',
    title: 'Your Coach to Wealth',
    description: 'Focus on Career, Not Portfolio.',
    author: 'Vijit Nima',
    role: 'Technology Professional',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Breaking Free from Financial Mistakes',
    description: 'From Impulsive to Planned: Financial Freedom.',
    author: 'Sandip Mahajan',
    role: 'Business Owner',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2149&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Making Smarter, Goal-Based Investments',
    description: 'Goals Achieved: Beyond Investments, Life Planning.',
    author: 'Abhi Kasturi',
    role: 'Healthcare Professional',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'Retirement Planning Made Simple',
    description: 'Securing Your Future with Expert Guidance.',
    author: 'Priya Sharma',
    role: 'Education Professional',
    videoUrl: 'https://www.youtube.com/watch?v=example4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Financial Independence Journey',
    description: 'From Debt to Freedom: My Financial Transformation.',
    author: 'Rahul Kapoor',
    role: 'Marketing Executive',
    videoUrl: 'https://www.youtube.com/watch?v=example5',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Tax Optimisation Strategies That Work',
    description: 'Legal Ways to Minimise Tax Burden and Maximise Wealth.',
    author: 'Anjali Desai',
    role: 'Financial Consultant',
    videoUrl: 'https://www.youtube.com/watch?v=example6',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
  },
  {
    id: '7',
    title: 'Building Wealth Through Market Cycles',
    description: 'Staying Calm During Market Turbulence for Long-Term Growth.',
    author: 'Aarav Patel',
    role: 'IT Director',
    videoUrl: 'https://www.youtube.com/watch?v=example7',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '8',
    title: 'Family Financial Planning',
    description: 'Creating a Secure Future for Your Children and Beyond.',
    author: 'Meera Verma',
    role: 'Healthcare Administrator',
    videoUrl: 'https://www.youtube.com/watch?v=example8',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '9',
    title: 'From Confusion to Clarity',
    description: 'How a Financial Advisor Changed My Investment Approach.',
    author: 'Kiran Singh',
    role: 'Entrepreneur',
    videoUrl: 'https://www.youtube.com/watch?v=example9',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '10',
    title: 'Early Retirement Success Story',
    description: 'How Smart Planning Let Me Retire at 45.',
    author: 'Vikram Khanna',
    role: 'Early Retiree',
    videoUrl: 'https://www.youtube.com/watch?v=example10',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
  },
];

const textTestimonials: Testimonial[] = [
  {
    text: 'Working with Spring Money changed my financial future. My advisor helped me create a solid retirement plan and optimise my investments. I\'ve seen a 15 % increase in my portfolio over the last year alone!',
    author: 'Michael Thompson',
    designation: 'Business Owner',
  },
  {
    text: 'I was overwhelmed by managing my finances after inheriting my family business. My advisor at Spring Money provided clear guidance that helped me make confident decisions.',
    author: 'Sarah Williams',
    designation: 'Entrepreneur',
  },
  {
    text: 'The personalised approach at Spring Money makes all the difference. My advisor takes the time to understand my goals and risk tolerance.',
    author: 'David Chen',
    designation: 'Healthcare Professional',
  },
  {
    text: 'Planning for retirement seemed impossible until I connected with Spring Money. My advisor created a roadmap that gives me confidence for the future.',
    author: 'Jennifer Lopez',
    designation: 'Education Director',
  },
  {
    text: 'Spring Money advisors excel at explaining complex financial concepts in understandable terms. I finally feel in control of my finances.',
    author: 'Robert Jackson',
    designation: 'Technology Consultant',
  },
  {
    text: 'After working with my Spring Money advisor, I\'ve doubled my savings rate without feeling deprived.',
    author: 'Emma Watson',
    designation: 'Project Manager',
  },
  {
    text: 'My advisor\'s strategic approach to debt management helped me eliminate $50 000 in high-interest debt in just two years.',
    author: 'James Wilson',
    designation: 'Sales Director',
  },
  {
    text: 'As someone who always found investing intimidating, I appreciate how my Spring Money advisor builds my confidence.',
    author: 'Sophia Garcia',
    designation: 'Creative Director',
  },
  {
    text: 'My family\'s multi-generational wealth plan gives me peace of mind about our future.',
    author: 'Daniel Lee',
    designation: 'Business Consultant',
  },
  {
    text: 'Working with Spring Money helped me align my investments with my values without sacrificing returns.',
    author: 'Olivia Martinez',
    designation: 'Environmental Scientist',
  },
];

/* ───────── component ───────── */
const TestimonialsCarousel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'text'>('video');
  const [activeIndex, setActiveIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [emblaRefText, emblaApiText] = useEmblaCarousel({ loop: true });

  /* auto-scroll */
  useEffect(() => {
    const id =
      activeTab === 'video'
        ? setInterval(() => emblaApi?.scrollNext(), 5000)
        : setInterval(() => emblaApiText?.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [activeTab, emblaApi, emblaApiText]);

  useEffect(() => {
    emblaApi?.on('select', () => setActiveIndex(emblaApi.selectedScrollSnap()));
    emblaApiText?.on('select', () =>
      setActiveIndex(emblaApiText.selectedScrollSnap()),
    );
  }, [emblaApi, emblaApiText]);

  const openVideo = (url: string) => window.open(url, '_blank');

  /* ───────── render ───────── */
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#272A2B] mb-6">
            Do not just take our word for it
          </h2>
          <p className="text-xl text-[#108E66] font-medium mb-8">
            Real People, Real Results.
          </p>
          {/* tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                className={`px-6 py-2 text-sm font-medium rounded-l-lg border ${
                  activeTab === 'video'
                    ? 'bg-[#108E66] text-white border-[#108E66]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('video')}
              >
                Video Testimonials
              </button>
              {/* <button
                className={`px-6 py-2 text-sm font-medium rounded-r-lg border ${
                  activeTab === 'text'
                    ? 'bg-[#108E66] text-white border-[#108E66]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('text')}
              >
                Client Reviews
              </button> */}
            </div>
          </div>
        </div>

        {/* ============ VIDEO ============ */}
        {activeTab === 'video' && (
          <div className="relative px-4">
            <Carousel ref={emblaRef} className="w-full">
              <CarouselContent>
                {videoTestimonials.map((v) => (
                  <CarouselItem
                    key={v.id}
                    className="md:basis-1/2 lg:basis-1/3 pl-4"
                  >
                    <Card className="border border-gray-200 rounded-lg overflow-hidden h-full">
                      <CardContent className="p-0">
                        <div className="flex flex-col h-full">
                          {/* thumbnail */}
                          <div
                            className="relative w-full aspect-video cursor-pointer"
                            onClick={() => openVideo(v.videoUrl)}
                          >
                            <Image
                              src={v.thumbnailUrl}
                              alt={v.title}
                              fill
                              sizes="(max-width: 768px) 100vw,
                                     (max-width: 1024px) 50vw,
                                     33vw"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 hover:scale-105">
                              <Youtube className="w-10 h-10 text-[#108E66]" />
                            </div>
                          </div>

                          {/* text + button */}
                          <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-semibold text-xl text-[#272A2B] line-clamp-2">
                              {v.title}
                            </h3>
                            <p className="text-gray-600 mb-4 min-h-[3.5rem] line-clamp-3">
                              {v.description}
                            </p>
                            <p className="font-medium text-[#272A2B]">
                              {v.author}
                            </p>
                            <p className="text-sm text-gray-500">{v.role}</p>

                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-auto border-[#108E66] text-[#108E66] hover:bg-[#108E66] hover:text-white w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                openVideo(v.videoUrl);
                              }}
                            >
                              Watch Full Video on Youtube
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex justify-center items-center gap-2 mt-8">
                <CarouselPrevious className="static transform-none" />
                <div className="flex items-center gap-2 mx-4">
                  {videoTestimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === activeIndex ? 'w-6 bg-[#108E66]' : 'w-2 bg-gray-300'
                      }`}
                      onClick={() => emblaApi?.scrollTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          </div>
        )}

        {/* ============ TEXT ============ */}
        {activeTab === 'text' && (
          <Carousel
            ref={emblaRefText}
            opts={{ align: 'start', loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {textTestimonials.map((t, i) => (
                <CarouselItem
                  key={i}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <TestimonialCard testimonial={t} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="static transform-none" />
              <div className="flex items-center gap-2 mx-4">
                {textTestimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === activeIndex ? 'w-6 bg-[#108E66]' : 'w-2 bg-gray-300'
                    }`}
                    onClick={() => emblaApiText?.scrollTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <CarouselNext className="static transform-none" />
            </div>
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;

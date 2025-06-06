/*
  [TEMPORARILY DISABLED]
  The PowerPlayCTA component is commented out to temporarily remove it from the website UI.
  To restore, uncomment this block and ensure it is imported and used where needed.

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { ChevronRight, Briefcase, Globe, TrendingUp } from 'lucide-react';

interface OfferSlideProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  bgColor: string;
  icon: React.ReactNode;
}

const OfferSlide: React.FC<OfferSlideProps> = ({ 
  title, 
  subtitle,
  description, 
  ctaText, 
  bgColor,
  icon
}) => {
  return (
    <div className={`h-full w-full rounded-lg p-8 ${bgColor} flex flex-col justify-between`}>
      <div>
        <div className="text-[#FCFFFE] mb-4">
          {icon}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-[#FCFFFE] mb-1">{title}</h3>
        <h4 className="text-lg md:text-xl font-semibold text-[#FCFFFE]/90 mb-3">{subtitle}</h4>
        <p className="text-[#FCFFFE] opacity-90 mb-6 max-w-md">{description}</p>
      </div>
      <Button 
        variant="spring" 
        className="self-start bg-[#FCFFFE] text-[#108E66] hover:bg-[#FCFFFE]/90"
      >
        {ctaText} <ChevronRight className="ml-1" size={16} />
      </Button>
    </div>
  );
};

const PowerPlayCTA: React.FC = () => {
  const offers = [
    {
      title: "Introducing EMPOWER",
      subtitle: "Empower Your Workforce",
      description: "Boost employee financial wellness and productivity with expert guidance and tailored tools.",
      ctaText: "Learn More",
      bgColor: "bg-gradient-to-r from-[#108E66] to-[#1aab80]",
      icon: <Briefcase size={40} strokeWidth={1.5} />
    },
    {
      title: "Introducing NRICH",
      subtitle: "NRI Financial Solutions",
      description: "Seamlessly manage your finances across borders with expert guidance and specialized tools.",
      ctaText: "Get Started",
      bgColor: "bg-gradient-to-r from-[#108E66] to-[#1aab80]",
      icon: <Globe size={40} strokeWidth={1.5} />
    },
    {
      title: "Introducing POWER PLAY",
      subtitle: "Empowering Young Professionals",
      description: "Build a solid financial future with expert guidance from the start.",
      ctaText: "Discover More",
      bgColor: "bg-gradient-to-r from-[#108E66] to-[#1aab80]",
      icon: <TrendingUp size={40} strokeWidth={1.5} />
    }
  ];

  return (
    <div className="py-16 px-4 bg-[#FCFFFE]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#272A2B] mb-3">Special Offers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take advantage of these specialized services to enhance your financial future
          </p>
        </div>
        
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {offers.map((offer, index) => (
                <CarouselItem key={index} className="md:basis-3/4 lg:basis-2/3 h-[320px]">
                  <OfferSlide
                    title={offer.title}
                    subtitle={offer.subtitle}
                    description={offer.description}
                    ctaText={offer.ctaText}
                    bgColor={offer.bgColor}
                    icon={offer.icon}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="relative transform-none rounded-full" />
              <CarouselNext className="relative transform-none rounded-full" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default PowerPlayCTA;

  [END OF TEMPORARY DISABLE]
  To re-enable this component, remove the surrounding comment block and restore its imports/usages in relevant files.

  [NOTE]
  Related code in src/app/marketplace/page.tsx has also been commented out:
    - The import statement for PowerPlayCTA
    - The JSX usage of <PowerPlayCTA />
  Both are marked with clear comments for future reference. Be sure to restore those as well if you re-enable this component.
*/

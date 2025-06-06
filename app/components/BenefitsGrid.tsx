
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TestimonialsSection from './TestimonialsSection';


interface BenefitCardProps {
  title: string;
  description: string;
  image: string;
  alt: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ title, description, image, alt }) => {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-center mb-2">
          <img src={image} alt={alt} className="w-[240px] h-[158px] object-contain" />
        </div>
        <CardTitle className="text-xl text-center text-[#272A2B]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-center">{description}</p>
      </CardContent>
    </Card>
  );
};

const BenefitsGrid: React.FC = () => {
  const benefits = [
    {
      id: 1,
      title: "Build Wealth & Secure Your Future",
      description: "Personalized strategies for growth and retirement.",
      image: "../../images/pana.svg",
      alt: "Illustration of people building wealth and planning for the future",
    },
    {
      id: 2,
      title: "Maximize Returns, Minimize Taxes",
      description: "Expert investment strategies across diverse assets.",
      image: "../../images/bro.svg",
      alt: "Illustration of investment growth and tax optimization",
    },
    {
      id: 3,
      title: "Protect Your Future",
      description: "Tailored insurance planning for you, your family and your assets.",
      image: "../../images/amico.svg",
      alt: "Illustration of family protection and insurance",
    },
    {
      id: 4,
      title: "Secure Your Legacy",
      description: "Plan your estate and ensure a smooth wealth transfer.",
      image: "../../images/legacy.svg",
      alt: "Illustration of estate planning and wealth transfer",
    },
  ];

  return (
    <>
      <div className="py-4 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#272A2B] mb-4">Why Choose Spring Money Advisors?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform connects you with verified advisors who provide expert financial guidance tailored to your unique needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={benefit.id}
                title={benefit.title}
                description={benefit.description}
                image={benefit.image}
                alt={benefit.alt}
              />
            ))}
          </div>
        </div>
      </div>
      <TestimonialsSection />
    </>
  );
};

export default BenefitsGrid;

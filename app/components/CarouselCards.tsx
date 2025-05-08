import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const carouselItems = [
  {
    title: "The Financial Advice That Changed My Life",
    description: "From Influencer Tips to Expert Plans: Peace of Mind.",
    button: "Watch Full Video on Youtube",
    image: "/carousel-cards/carousel1.svg",
    link: "https://youtu.be/2YlOxs78WPc?si=QIZELFCXGXWebmct",
    guest: "~ Harshal Patil",
  },
  {
    title: "A Smarter Approach to Wealth Building",
    description: "Hands-Off Wealth: Focus on Career, Not Portfolio.",
    button: "Watch Full Video on Youtube",
    image: "/carousel-cards/carousel2.svg",
    link: "https://youtu.be/nXjwXqpnBPI",
    guest: "~ Vijit Neema",
  },
  {
    title: "Breaking Free from Financial Mistakes",
    description: "From Impulsive to Planned: Financial Freedom.",
    button: "Watch Full Video on Youtube",
    image: "/carousel-cards/carousel3.svg",
    link: "https://www.youtube.com/watch?v=5m5Qigm2j7w",
    guest: "~ Sandeep Mahajan",
  },
  {
    title: "Making Smarter, Goal-Based Investments",
    description: "Goals Achieved: Beyond Investments, Life Planning.",
    button: "Watch Full Video on Youtube",
    image: "/carousel-cards/carousel5.svg",
    link: "https://www.youtube.com/watch?v=jx_6soC3wuM",
    guest: "~ Abhi Kasturi",
  },
];

export default function CarouselCards() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = 450 + 32; // Card width (450px) + gap (32px)

  // Duplicate the items to create the illusion of infinite scrolling
  const duplicatedItems = [
    ...carouselItems,
    ...carouselItems,
    ...carouselItems,
    ...carouselItems,
  ];

  useEffect(() => {
    const animate = () => {
      if (carouselRef.current) {
        // Increment scroll position
        setScrollPosition((prev) => prev + 1);

        // When we've scrolled past the first set of cards, reset position to beginning
        if (scrollPosition >= cardWidth * carouselItems.length) {
          setScrollPosition(0);
        }
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [scrollPosition, carouselItems.length]);

  return (
    <div className="flex flex-col p-4 md:p-[60px] items-center">
      <p className="text-[40px] font-semibold text-[#108E66] mb-2 text-center">
        Don&apos;t just take our word for it
      </p>
      <p className="text-xl font-medium text-[#108E66] mb-4 text-center">
        Real People, Real Results.
      </p>

      <div className="relative overflow-hidden w-full">
        <div
          ref={carouselRef}
          className="flex space-x-8"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
            transition: "transform 0.05s linear",
            width: "max-content",
          }}
        >
          {duplicatedItems.map((item, index) => (
            <motion.div
              key={index}
              className="md:p-8 flex flex-col w-[450px] gap-4 justify-center bg-[#FCFFFE] border border-[#108E66] rounded-lg"
            >
              <div className="block">
                <Image
                  src={item.image}
                  width={560}
                  height={400}
                  alt="home frame"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-[#272B2A] text-2xl font-bold">
                    {item.title}
                  </p>
                  <p className="text-[#272b2abf] text-1.5xl font-normal">
                    {item.description}
                  </p>
                </div>
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-6 py-3 border border-[#108E66] mt-6 rounded"
                >
                  <span className="text-[#108E66] text-base font-semibold">
                    {item.button}
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

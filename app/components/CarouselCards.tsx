import Image from "next/image";
 import { useEffect, useRef, useState } from "react";
 import Link from "next/link";
 import { motion } from "framer-motion";

 const carouselItems = [
  {
  title: "Why Financial Planning is Life-Saving! Learn from My Story!",
  description: "Life-saving financial planning insights.",
  button: "Watch Full Video on Youtube",
  image: "/images/testimonial-aishwarya.svg",
  link: "https://youtu.be/XcrNiRIoGP0?si=PxPRco7imCqBjEqi",
  guest: "~ Aishwarya Pawar",
  },
  {
  title: "From Debt to Wealth – Their Journey!",
  description: "Their debt-to-wealth transformation.",
  button: "Watch Full Video on Youtube",
  image: "/images/testimonial-kaumudi.svg",
  link: "https://youtu.be/3vOna5OaVkk?si=wHLFw6NCB74-p1iD",
  guest: "~ Arnav & Kaumudi",
  },
  {
  title: "Financial Planning for Youngsters - Budgeting, Investing & Beyond",
  description: "Budgeting, investing, and financial freedom.",
  button: "Watch Full Video on Youtube",
  image: "images/testimonial-ria.svg",
  link: "https://youtu.be/IMkBkwZUI6k?si=NSlL0vNzzvZyivwH",
  guest: "~ Ria Unawane",
  },
  {
  title: "From Financial Uncertainty to Confident Wealth Planning",
  description: "Achieving confident wealth management.",
  image: "/images/testimonial-neha.svg",
  link: "https://youtu.be/6xACFcllpE0?si=G-pvty9iNIFBpwu4",
  guest: "~ Neha Saggam",
  button: "Watch Full Video on Youtube",
  },
  
 ];

 export default function CarouselCards() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardWidth = 450;

  const duplicatedItems = [
  ...carouselItems,
  ...carouselItems,
  ...carouselItems,
  ...carouselItems,
  ];

  useEffect(() => {
  const animate = () => {
  if (carouselRef.current) {
  setScrollPosition((prev) => prev + 1);

  if (scrollPosition >= cardWidth * carouselItems.length) {
  setScrollPosition(0);
  }
  }
  };

  const animationId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationId);
  }, [scrollPosition, carouselItems.length]);

  return (
  <div className="flex flex-col p-2 md:p-4 items-center">
  <p className="text-3xl md:text-4xl font-semibold text-[#108E66] mb-2 text-center">
  Don't just take our word for it
  </p>
  <p className="text-lg md:text-xl font-medium text-[#108E66] mb-4 text-center">
  Real People, Real Results.
  </p>

  <div className="relative overflow-hidden w-full">
  <div
  ref={carouselRef}
  className="flex space-x-4"
  style={{
  transform: `translateX(-${scrollPosition}px)`,
  transition: "transform 0.05s linear",
  width: "max-content",
  }}
  >
  {duplicatedItems.map((item, index) => (
  <motion.div
  key={index}
  className="flex flex-col w-[450px] gap-4 bg-[#FCFFFE] border-2 border-[#272a2b] rounded-lg overflow-hidden" // Increased border thickness, added overflow-hidden
  >
  <div className="block">
  <Image
  src={item.image}
  width={560}
  height={400}
  alt="home frame"
  />
  </div>

  <div className="flex flex-col justify-between h-full px-4 pb-4"> {/* Added h-full and justify-between */}
  <div className="flex flex-col gap-2 text-left"> {/* Changed to text-left */}
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
  className="w-full text-center px-6 py-3 border border-[#108E66] mt-6 rounded bg-[#FCFFFE]"
  >
  <span className="text-[#108e66] text-base font-semibold">
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
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import homeFrame from "../../public/home-frame.svg";
import { desc } from "framer-motion/client";
import CarouselCards from "../components/CarouselCards";
import FAQAccordion from "../components/FAQAccordion";
import { BasePrivateKeyEncodingOptions } from "crypto";

// Data for core financial services
const financialServices = [
  {
    id: 1,
    title: "Build Wealth & Secure Your Future",
    description: "Personalized strategies for growth and retirement.",
    image: "/services/pana.svg",
  },
  {
    id: 2,
    title: "Maximize Returns, Minimize Taxes",
    description: "Expert investment strategies across diverse assets.",
    image: "/services/bro.svg",
  },
  {
    id: 3,
    title: "Protect Your Future",
    description:
      "Tailored insurance planning for you, your family and your assets.",
    image: "/services/amico.svg",
  },
  {
    id: 4,
    title: "Secure Your Legacy",
    description: "Plan your estate and ensure a smooth wealth transfer.",
    image: "/services/legacy.svg",
  },
];

const carouselComponents = [
  {
    title: "Introducing EMPOWER",
    description:
      "Empower Your Workforce Boost employee financial wellness and productivity with expert guidance and tailored tools.",
    btnUrl: "/programs/empower",
  },
  {
    title: "Introducing NRICH",
    description:
      "NRI Financial Solutions Seamlessly manage your finances across borders with expert guidance and specialized tools.",
    btnUrl: "/programs/nrich",
  },
  {
    title: "Introducing POWER PLAY",
    description:
      " Empowering Young Professionals Build a solid financial future with expert guidance from the start.",
    btnUrl: "/programs/power-play",
  },
];

const ourPartners = [
  {
    title: "NS Wealth Financial Planners",
    description:
      "NS Wealth Solutions empowers clients with unbiased advice and cutting-edge technology to achieve their financial goals.",
    image: "/services/ns-wealth.svg",
    btnUrl: "https://nswealth.in/",
    partnerPage: "/services/ns-wealth-solution",
  },
  {
    title: "Artha FinPlan",
    description:
      "ARTHA FinPlan offers personalized financial planning and investment advice, guiding clients towards their goals with a holistic approach.",
    image: "/services/artha.svg",
    btnUrl: "https://arthafinplan.com/",
    partnerPage: "/services/artha-finplan",
  },
  {
    title: "FinSharpe Investment Advisors",
    description:
      "FinSharpe Investment Advisors provides data-driven, unbiased advice, helping investors make rational decisions with a transparent approach.",
    image: "/services/finsharp.svg",
    btnUrl: "https://finsharpe.com/",
    partnerPage: "/services/finsharpe",
  },
];

const faqs = [
  {
    question: "Who are the financial advisors on Spring Money?",
    answer:
      "Our network consists exclusively of SEBI-registered investment advisors. This ensures that you receive expert financial guidance from professionals who are regulated and held to the highest ethical and professional standards.",
  },
  {
    question: "How does Spring Money connect me with an advisor?",
    answer:
      "To begin, simply reach out to us via WhatsApp. We'll initiate a conversation to understand your specific financial goals, current situation, and preferences. Based on this, we'll match you with a suitable advisor from our network. This personalized approach ensures you find an advisor whose expertise aligns with your needs.",
  },
  {
    question: "What types of financial planning do you offer?",
    answer:
      "Our partner advisors provide personalized financial planning services designed to address your unique circumstances. They offer a comprehensive suite of solutions, encompassing everything from holistic financial planning that integrates investments, retirement, insurance, tax optimization, debt management, and budgeting, to focused strategies for building and managing your investment portfolio. Additionally, they specialize in retirement planning to ensure a secure future and goal-based planning to help you achieve specific financial objectives like homeownership or educational funding.",
  },
  {
    question: "Is Spring Money suitable for all income levels?",
    answer:
      "Yes, absolutely. We believe that everyone deserves access to quality financial advice. Our services are designed to be flexible and adaptable, catering to individuals at every stage of their financial journey, from those just starting out to those managing substantial wealth.",
  },
  {
    question: "Are the financial tools on your website free to use?",
    answer:
      "Yes, our financial calculators are completely free to use. They are designed to provide you with valuable insights and help you make informed financial decisions.",
  },
  {
    question: "What are the costs associated with financial planning?",
    answer:
      "You get a range of financial planning options, including one-time consultations and comprehensive, ongoing planning services. Pricing varies depending on the complexity of your financial situation and the services you require. We recommend contacting us via WhatsApp to discuss your specific needs and receive a personalized quote.",
  },
];

export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % carouselComponents.length;
      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeIndex, carouselComponents.length]);
  return (
    <div className="">
      {/* HERO SECTION */}
      <section className="bg-[#108e66] py-20 px-4 text-center border-b border-[#272B2A]">
        <h1 className="text-4xl md:text-5xl font-bold text-[#FCFFFE] mb-4">
          Personalized Financial Planning, Simplified
        </h1>
        <p className="text-lg md:text-xl text-[#FCFFFE] max-w-3xl mx-auto">
          Find Your Ideal Financial Advisor and Start Building Your Future
          Today.
        </p>
        <Link
          href="https://wa.me/+918668484607"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-[#fcfffe] text-[#108e66] px-8 py-3 rounded-md font-semibold border border-[#108e66] hover:bg-[#fcfffe] transition-colors"
        >
          Get Started Now
        </Link>
      </section>

      {/* CORE FINANCIAL SERVICES SECTION */}
      <section className="mx-auto py-16 flex flex-col items-center w-full">
        <h2 className="text-[40px] font-semibold text-center text-[#272B2A] mb-2">
          Our Expertise, Your Financial Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:max-xl:px-[60px] max-w-screen-xl">
          {financialServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#FCFFFE] flex flex-col justify-center items-center w-full p-6 rounded-md shadow hover:shadow-xl transition transform hover:scale-105 border border-[#108E66]"
            >
              <Image
                width={240}
                height={158}
                src={service.image}
                alt="Financial Planning"
                className="w-[240px] h-[158px]"
              />
              <h3 className="text-xl font-medium text-[#272B2A] mt-4 mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-[#272B2A] text-sm font-normal text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto flex flex-col gap-4 items-center px-4 md:max-xl:px-[60px] py-8 md:py-16">
        <p className="text-[#108E66] text-[40px] font-semibold text-center">
          How it works ?
        </p>
        <div className="p-4 md:p-8 flex flex-col md:flex-row gap-8 w-full justify-center bg-[#FCFFFE] border rounded border-[#108E66]  max-w-screen-xl">
          <div className="block md:w-[45%]">
            <Image
              src={"/services/nikhil-51.svg"}
              width={1032}
              height={400}
              alt="home frame"
            />
          </div>
          <div className="flex flex-col justify-between w-full md:w-[55%]">
            <div className="flex flex-col gap-2">
              <p className="text-[#272B2A] text-[32px] font-bold">
                Financial Planning, Simplified: A Step-by-Step Guide
              </p>
              <p className="text-[#272b2abf] text-2xl font-normal">
                Learn how Spring Money simplifies financial planning. This video
                guides you through the process, from goal setting to expert
                advisor support. Gain clarity and achieve your financial
                aspirations.
              </p>
            </div>
            <Link
              href={"https://youtu.be/0LTAmuIidsI?si=8TZEOLyMHBGHXveP"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit px-6 py-3 border border-[#108E66] rounded"
            >
              <span className="text-[#108E66] text-base font-semibold ">
                Start Your Journey Now !
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex flex-col items-center bg-linearGradient5 py-8 md:py-16">
        <h2 className="text-[40px] font-semibold text-center text-[#272B2A] mb-2">
          Our Partners
        </h2>
        <p className="text-[#272B2A] text-xl font-normal text-center mb-4">
          We specialize in providing customized financial solutions for a
          diverse range of professionals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center px-4 md:max-xl:px-[60px]  max-w-screen-xl">
          {ourPartners.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 flex flex-col items-center border border-[#108E66] rounded-lg bg-[#FCFFFE]"
            >
              <Link
                href={partner.partnerPage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <Image
                  src={partner.image}
                  width={50}
                  height={50}
                  alt="partner image"
                  className="w-[290px] h-[100px] mb-4"
                />
                <p className="text-[#272B2A] text-xl font-medium mb-1">
                  {partner.title}
                </p>
                <p className="text-[#272b2abf] text-base font-normal mb-2">
                  {partner.description}
                </p>
              </Link>
              <Link
                href={partner.btnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#108E66] rounded w-full py-3 flex justify-center text-[#FFF] text-sm font-semibold mt-auto"
              >
                Visit Website
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 px-[60px] py-8 bg-[#F0FAF7] md:py-16">
        <p className="text-[#108E66] text-[40px] font-bold text-center">
          {carouselComponents[activeIndex].title}
        </p>
        <p className="text-[#108E66] text-center text-2xl font-medium  max-w-screen-xl">
          {carouselComponents[activeIndex].description}
        </p>
        <Link
          href={carouselComponents[activeIndex].btnUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#108E66] text-base font-semibold px-6 py-3 border border-[#108E66] rounded"
        >
          Learn More
        </Link>
        <div className="flex justify-center">
          {carouselComponents.map((item, index) => (
            <button
              key={index}
              className={`mx-2 h-[1rem] text-sm  rounded-lg w-8 ${
                activeIndex === index ? "bg-[#108E66]" : "bg-[#108e668a] "
              }`}
              onClick={() => setActiveIndex(index)}
            ></button>
          ))}
        </div>
      </div>

      <div className="bg-linearGradient3">
        <CarouselCards />
      </div>

      <FAQAccordion faqs={faqs} />
    </div>
  );
}

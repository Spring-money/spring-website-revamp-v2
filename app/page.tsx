"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import FAQAccordion from "./components/FAQAccordion";
import sideArrow from "../public/Arrow 1.svg";
import CarouselCards from "./components/CarouselCards";

/* ---------------------------------
   Carousel Component with Auto-Scrolling Animation
--------------------------------- */
const Carousel = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden w-full">
    <div className="flex space-x-4 animate-autoScroll w-max">{children}</div>
  </div>
);

interface WhoWeServeCardsProps {
  img: string;
  heading: string;
  subHeading: string;
}

/* ---------------------------------
   Tools (Calculators) Data for Home Page
   (Three new placeholder tools are added on top)
--------------------------------- */

const baseCalculators = [
  {
    id: 1,
    title: "Should I Buy or Rent a Home?",
    description:
      "Analyze whether it's more cost-effective to buy a house or continue renting.",
    slug: "buyVsRent",
  },
  {
    id: 2,
    title: "Buy a Car vs. Commute Calculator",
    description:
      "Compare the costs of owning a car versus using alternative commuting options.",
    slug: "carVsCommute",
  },
  {
    id: 3,
    title: "EMI Calculator",
    description:
      "Estimate monthly loan payments for car, home, or other loans.",
    slug: "emiCalculator",
  },
  {
    id: 4,
    title: "Endowment Calculator",
    description:
      "Determine whether to continue your endowment policy or surrender it.",
    slug: "endowmentVsTerm",
  },
  {
    id: 5,
    title: "FD vs RD Calculator",
    description:
      "Project maturity values and growth for Fixed and Recurring Deposits.",
    slug: "fdRdCalculator",
  },
  {
    id: 6,
    title: "FD-Based Retirement Calculator",
    description: "Plan your retirement corpus using FD-based projections.",
    slug: "fdRetirementCalculator",
  },
  // {
  //   id: 7,
  //   title: "FIRE Calculator",
  //   description:
  //     "Evaluate if 25x your annual expenses is enough for early retirement.",
  //   slug: "fireCalculator",
  // },
  // {
  //   id: 8,
  //   title: "When Will I Make My First Crore?",
  //   description:
  //     "Find out how long it takes to accumulate ₹1 crore based on your investments.",
  //   slug: "firstCrore",
  // },
  // {
  //   id: 9,
  //   title: "Fuel vs. Electric Vehicle Calculator",
  //   description:
  //     "Compare long-term costs of fuel-based versus electric vehicles.",
  //   slug: "fuelVsEv",
  // },
  // {
  //   id: 10,
  //   title: "Hourly Wage Calculator",
  //   description: "Convert your annual or monthly salary into an hourly wage.",
  //   slug: "hourlyWage",
  // },
  // {
  //   id: 11,
  //   title: "MBA ROI Calculator",
  //   description:
  //     "Assess lost earnings during an MBA versus potential salary growth post-MBA.",
  //   slug: "mbaRoi",
  // },
  // {
  //   id: 12,
  //   title: "Mutual Fund vs. NPS Tier I Calculator",
  //   description:
  //     "Compare market-driven Mutual Funds with government-backed NPS Tier I investments.",
  //   slug: "npsVsMf",
  // },
  // {
  //   id: 13,
  //   title: "CTC vs. In-Hand Salary Calculator",
  //   description:
  //     "Break down your Cost-to-Company into net monthly take-home pay.",
  //   slug: "salaryCalculator",
  // },
  // {
  //   id: 14,
  //   title: "SIP Calculator",
  //   description:
  //     "Explore potential returns of Systematic Investment Plans over time.",
  //   slug: "sipCalculator",
  // },
  // {
  //   id: 15,
  //   title: "Sukanya Samriddhi Yojana Calculator",
  //   description:
  //     "Compute maturity amounts and benefits of the SSY savings scheme.",
  //   slug: "sukanyaSamruddhi",
  // },
];
const calculators = [...baseCalculators];

/* ---------------------------------
   HomePage Component
--------------------------------- */

const faqs = [
  {
    question: "Who are the financial advisors on Spring Money?",
    answer:
      "Our network consists exclusively of SEBI-registered investment advisors. This ensures that you receive expert financial guidance from professionals who are regulated and held to the highest ethical and professional standards.",
  },
  {
    question:
      "How does Spring Money connect me with an advisor?",
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

const WhoWeServeCards: React.FC<WhoWeServeCardsProps> = ({
  img,
  heading,
  subHeading,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#108E66] bg-[#FCFFFE] p-6 items-center">
      <Image src={img} width={441} height={400} alt="who we serve image" className="mb-4 w-full h-auto object-contain"/>
      <span className="text-[24px] md:text-[28px] font-semibold text-[#272a2b] mb-2">
        {heading}
      </span>
      <span className="text-[18px] md:text-[20px] font-normal text-[#272a2b]">{subHeading}</span>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="font-sans space-y-16">
      {/* HERO SECTION (Solid Background, No Gradient) */}
      <section className="bg-[#108e66] text-white lg:pb-0">
        <div className="mx-auto flex flex-col lg:flex-row items-center lg:justify-between">
          <div className="lg:w-[70%] text-center lg:text-left space-y-4 px-16 py-16 lg:py-0">
            <h1 className="text-4xl lg:text-5xl font-bold">
            Smart, Comprehensive and Unbiased Financial Planning
            </h1>
            <p className="text-lg md:text-xl">
            Experience digital-first, personalised and goal-based financial planning for every stage of your life
            </p>
            <Link
              href="/services"
              className="inline-block bg-[#fcfffe] text-[#108e66] px-8 py-3 rounded-md font-semibold border border-[#108e66] hover:bg-[#fcfffe] transition-colors"
            >
              Get Started
            </Link>
          </div>

          <Image
            src="/dashboard.svg"
            alt="Fintech Hero Illustration"
            className="hidden lg:block w-auto max-w-full"
            width={100}
            height={100}
            priority={true}
          />
        </div>
      </section>

      {/* WHO WE SERVE SECTION (Carousel with Auto-Scrolling) */}
      <section className="mx-auto  max-w-screen-xl">
        <h2 className="text-3xl font-bold text-center text-[#272B2A] mb-4">
        We Serve You and Your Aspirations
        </h2>
        <p className="text-center text-[#272B2A] mb-10 max-w-2xl mx-auto text-xl font-normal">
          Tailored Financial Strategies for Every Professional Journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 md:px-16 max-w-screen-xl">
          <WhoWeServeCards
            img="/who-we-serve/it.svg"
            heading="IT Professionals"
            subHeading="Maximize IT Earnings: ESOP & Wealth Strategies."
          />
          <WhoWeServeCards
            img="/who-we-serve/mba.svg"
            heading="MBA Graduates"
            subHeading="MBA Financial Edge: Maximize Income, Minimize Taxes."
          />
          <WhoWeServeCards
            img="/who-we-serve/professional.svg"
            heading="Young Professionals"
            subHeading="Young Pro Wealth: Smart Start, Long-Term Growth"
          />
          <WhoWeServeCards
            img="/who-we-serve/forces.svg"
            heading="Armed Forces & Government Officials"
            subHeading="Serve & Secure: Pension & Investment Strategies"
          />
          <WhoWeServeCards
            img="/who-we-serve/doctors.svg"
            heading="Doctors & Medical Professionals"
            subHeading="Secure Your Practice: Loan, Tax & Retirement Planning."
          />
          <WhoWeServeCards
            img="/who-we-serve/lawyer.svg"
            heading="Lawyers & Legal Professionals"
            subHeading="Legal Wealth: Navigate Irregular Income & Taxes."
          />
        </div>
      </section>

      <CarouselCards />

      {/* TOOLS SECTION (Carousel with Auto-Scrolling) */}
      <section className="mx-auto py-20 text-center bg-[#fcfffe] text-[#272B2A] max-w-screen-xl p">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-[40px] font-semibold mb-4 text-[#108E66]">
            Smart Financial Tools
          </h1>
          <p className="text-xl mb-8 text-[#108E66] font-normal">
          Empower Your Financial Decisions with comprehensive Calculators.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              // whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 bg-[#F0FAF7] border border-[#108e6633] p-4 rounded-2xl shadow-md  items-start hover:shadow-xl transition-shadow flex flex-col"
            >
              <h2 className="text-xl text-[#272B2A] font-medium mb-2">
                {calc.title}
              </h2>
              <p className="mb-6 text-[#272b2ae6] text-base font-normal text-start flex-grow">
                {calc.description}
              </p>
              <Link
                href={`/tools/${calc.slug}`}
                className="flex border border-[#108E66] gap-[6px] px-4 py-2 rounded-md hover:bg-white transition text-center"
              >
                <p className="text-base font-semibold text-[#108E66]">
                  Check Now
                </p>
                <Image
                  src={sideArrow}
                  width={10}
                  height={10}
                  alt="right arrow"
                />
              </Link>
            </div>
          ))}
          <div className="flex justify-center "></div>
          <Link
              href="/tools"
              className="inline-block bg-[#fcfffe] text-[#108e66] mt-4 px-8 py-3 rounded-md font-medium border border-[#108e66] hover:bg-[#108e66] hover:text-[#fcfffe] transition-colors"
            >
              View all tools
            </Link>
        </div>
      </section>

      {/* MISSION & VISION SECTION */}
      <section className="container mx-auto px-4 py-16 max-w-screen-xl">
        <div className="flex flex-col items-center text-center justify-center gap-4">
          <p className="text-[#272B2A] text-[40px] font-semibold">
            Our Mission & Vision
          </p>
          <p className="text-[#272B2A] text-xl font-normal">
          Democratizing Expert Financial Advice: Comprehensive, Transparent, Effective.
          </p>
          <Link
            href="/meet-the-team"
            className="inline-block bg-[#108e66] text-[#fcfffe] px-8 py-3 rounded-md font-medium hover:bg-[#272B2A] transition-colors"
          >
            Meet the team
          </Link>
        </div>
      </section>
      {/* FAQ Accordion remains intact */}
      <FAQAccordion faqs={faqs} />
    </div>
  );
}

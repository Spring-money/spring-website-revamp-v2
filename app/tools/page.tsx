// app/tools/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import sideArrow from "../../public/Arrow 1.svg";
import FAQAccordion from "../components/FAQAccordion";

// Three additional placeholder tools to appear at the top
const additionalCalculators = [
  {
    id: 16,
    title: "Placeholder Tool 1",
    description: "This is a placeholder tool for future features.",
    slug: "placeholder-tool-1",
  },
  {
    id: 17,
    title: "Placeholder Tool 2",
    description: "This is a placeholder tool for future features.",
    slug: "placeholder-tool-2",
  },
  {
    id: 18,
    title: "Placeholder Tool 3",
    description: "This is a placeholder tool for future features.",
    slug: "placeholder-tool-3",
  },
];

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

// Existing calculators list
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
  {
    id: 7,
    title: "FIRE Calculator",
    description:
      "Evaluate if 25x your annual expenses is enough for early retirement.",
    slug: "fireCalculator",
  },
  {
    id: 8,
    title: "When Will I Make My First Crore?",
    description:
      "Find out how long it takes to accumulate ₹1 crore based on your investments.",
    slug: "firstCrore",
  },
  {
    id: 9,
    title: "Fuel vs. Electric Vehicle Calculator",
    description:
      "Compare long-term costs of fuel-based versus electric vehicles.",
    slug: "fuelVsEv",
  },
  {
    id: 10,
    title: "Hourly Wage Calculator",
    description: "Convert your annual or monthly salary into an hourly wage.",
    slug: "hourlyWage",
  },
  {
    id: 11,
    title: "MBA ROI Calculator",
    description:
      "Assess lost earnings during an MBA versus potential salary growth post-MBA.",
    slug: "mbaRoi",
  },
  {
    id: 12,
    title: "Mutual Fund vs. NPS Tier I Calculator",
    description:
      "Compare market-driven Mutual Funds with government-backed NPS Tier I investments.",
    slug: "npsVsMf",
  },
  {
    id: 13,
    title: "CTC vs. In-Hand Salary Calculator",
    description:
      "Break down your Cost-to-Company into net monthly take-home pay.",
    slug: "salaryCalculator",
  },
  {
    id: 14,
    title: "SIP Calculator",
    description:
      "Explore potential returns of Systematic Investment Plans over time.",
    slug: "sipCalculator",
  },
  {
    id: 15,
    title: "Sukanya Samriddhi Yojana Calculator",
    description:
      "Compute maturity amounts and benefits of the SSY savings scheme.",
    slug: "sukanyaSamruddhi",
  },
  {
    id: 19,
    title: "Retirement Goals Calculator",
    description:
      "Find your target corpus and monthly savings to secure your retirement.",
    slug: "retirement-goal-calculator",
  },
];

// Merge additional tools on top of the existing calculators
const calculators = [...baseCalculators];

export default function ToolsPage() {
  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {/* Hero / Intro Section without gradients */}
      <div className="flex flex-col gap-2 text-center mt-12">
        <p className="text-[#108E66] text-[40px] font-semibold">
          Smart Financial Tools
        </p>
        <p className="text-[#108E66] text-xl font-normal">
          Experience innovative, tailored, and comprehensive financial planning
          for every stage of your life.
        </p>
      </div>

      {/* Calculators Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  px-4 md:max-xl:px-[60px]  max-w-screen-xl pb-12">
        {calculators.map((calc) => (
          <div
            key={calc.id}
            className="bg-[#F0FAF7] border border-[#108e6633] p-4 rounded-2xl shadow-md  items-start hover:shadow-xl transition-shadow flex flex-col"
          >
            <h2 className="text-xl text-[#272B2A] font-medium mb-2">
              {calc.title}
            </h2>
            <p className="mb-6 text-[#272b2ae6] text-base font-normal text-start flex-grow">
              {calc.description}
            </p>
            <Link
              href={`/tools/${calc.slug}`}
              className="flex border border-[#108E66] gap-[6px] px-4 py-2 rounded-md hover:bg-[#108E66] transition text-center text-[#108E66] hover:text-white"
            >
              <p className="text-base font-semibold">
                Check Now
              </p>
              <Image src={sideArrow} width={10} height={10} alt="right arrow" />
            </Link>
          </div>
        ))}
      </div>

      <section className="py-16  bg-[#fcfffe] w-full">
        <div className="flex flex-col items-center text-center justify-center gap-4">
          <p className="text-[#272B2A] text-[40px] font-semibold">
            Our Mission & Vision
          </p>
          <p className="text-[#272B2A] text-xl font-normal  px-4 md:max-xl:px-[60px]  max-w-screen-xl">
            Spring Money believes in making expert financial advice accessible.
            Our core values drive us to deliver simple, transparent, and
            effective financial planning.
          </p>
          <Link
            href="/services"
            className="inline-block bg-[#108e66] text-[#fcfffe] px-8 py-3 rounded-md font-medium hover:bg-[#272B2A] transition-colors"
          >
            Learn More About Our Financial Planning
          </Link>
        </div>
      </section>

      <FAQAccordion faqs={faqs}/>
    </div>
  );
}

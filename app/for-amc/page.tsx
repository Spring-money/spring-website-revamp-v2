// app/for-amc/page.tsx
import React from "react";
import Link from "next/link";
import FAQAccordion from "../components/FAQAccordion";
import Image from "next/image";
import experienceFrame from "../../public/Frame-1431.svg";

interface Service {
  id: number;
  title: string;
  description: string;
}

interface EmpowerCardsProps {
  heading: string;
  subHeading: string;
}

const listDelimiter = "=";

const faqs = [
  {
    question: "Who is Spring Money designed for in the AMC space?",
    answer:
      "Spring Money is designed for Asset Management Companies (AMCs) seeking to enhance investor engagement, streamline operations, and drive growth through digital innovation, Our platform provides the tools and integrations necessary to modernize your investor experience.",
  },
  {
    question:
      "What are the key benefits of using Spring Money for AMCs?",
    answer:
      "Our platform offers: Seamless API integrations with leading fintech applications, Data-driven insights into investor behaviour, Customizable branded client portals, Personalized wealth management tools, Streamlined client onboarding processes.",
  },
  {
    question: "How does Spring Money enhance investor engagement?",
    answer:
      "We provide tools for personalized communication, interactive portfolio analysis, and educational resources, all designed to keep investors engaged and informed.",
  },
  {
    question: "What kind of support does Spring Money offer to AMCs?",
    answer:
      "We provide comprehensive support, including onboarding assistance and technical support to ensure you maximize the benefits of our platform.",
  },
  {
    question: "How do I request a demo of the Spring Money platform?",
    answer:
      "Simply click the 'Talk to us' button on our website, and we will contact you to arrange a convenient time for a personalized demonstration.",
  },
];

// const investmentSolutions: Service= [
//   {
//     id: 1,
//     title: "Stocks",
//     description:
//       "Seamless integration for efficient stock investments with minimal hassle.",
//   },
//   {
//     id: 2,
//     title: "Mutual Funds",
//     description:
//       "Robust tools to manage mutual fund investments with real-time updates and precision.",
//   },
//   {
//     id: 3,
//     title: "Multi AA",
//     description:
//       "Advanced analytics for comprehensive account aggregation and informed decision-making.",
//   },
//   {
//     id: 4,
//     title: "Mutual Funds Trading",
//     description:
//       "Efficient processing and trading tools designed specifically for NSE mutual fund operations.",
//   },
// ];

// const complianceSolutions: Service= [
//   {
//     id: 5,
//     title: "KYC Process",
//     description:
//       "Streamlined KYC processes that expedite onboarding and ensure full regulatory compliance.",
//   },
//   {
//     id: 6,
//     title: "KYC Verification",
//     description:
//       "Secure and compliant digital KYC verification tailored for asset management.",
//   },
//   {
//     id: 7,
//     title: "Aadhar & PAN eKYC",
//     description:
//       "Fast and reliable digital KYC services that simplify customer verification.",
//   },
//   {
//     id: 8,
//     title: "Signzy Solutions",
//     description:
//       "Cutting-edge digital verification tools to modernize your compliance procedures.",
//   },
// ];

// const digitalServices: Service= [
//   {
//     id: 9,
//     title: "CAMS || CAS",
//     description:
//       "Real-time insights on portfolio holdings to ensure accurate and timely reporting.",
//   },
//   {
//     id: 10,
//     title: "Digital Agreements",
//     description:
//       "Secure electronic agreements and documentation for streamlined legal processes.",
//   },
//   {
//     id: 11,
//     title: "Credit Report Soft Pull",
//     description:
//       "Comprehensive, non-intrusive credit reporting services to gauge client creditworthiness.",
//   },
// ];

const ServiceCard: React.FC<Service> = ({ title, description }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow hover:shadow-2xl transition transform hover:-translate-y-1">
      <h3 className="text-2xl font-semibold mb-2" style={{ color: "#1B1F13" }}>
        {title}
      </h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

const EmpowerCards: React.FC<EmpowerCardsProps> = ({ heading, subHeading }) => {
  return (
    <div className="p-4 rounded-lg bg-[#FCFFFE] border border-[#108E66] text-center flex flex-col gap-2 flex-1 justify-center">
      <p className="text-[#272B2A] text-xl font-medium">{heading}</p>
      <p className="text-[#272b2abf] text-sm font-normal">{subHeading}</p>
    </div>
  );
};

export default function ForAmcPage() {
  return (
    <div
      className=""
      style={{ backgroundColor: "#fcfffe", color: "#1B1F13" }}
    >
      {/* Hero / Intro Section */}
      <section className="py-20 px-4 text-center bg-[#F0FAF7]">
        <h1 className="text-[40px] font-semibold text-[#108E66] mb-2">
          Transform Your Investor Experience with Spring Money.
        </h1>
        <p className="text-lg md:text-xl text-[#108E66] max-w-3xl mx-auto">
          Drive engagement and growth with integrated & hyper-personalised
          digital assets
        </p>
        <div className="mt-8">
          <Link
            href="https://wa.me/+918668484607"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#108E66] text-[#FCFFFE] px-8 py-3 rounded-md font-semibold hover:bg-[#FCFFFE] hover:text-[#108E66] transition"
          >
            Talk to Us
          </Link>
        </div>
      </section>

      <div className="flex flex-col items-center py-16 bg-gradient-to-b from-[#F0FAF7] to-white">
        {" "}
        {/* Gradient Background */}
        <p className="text-[40px] font-semibold text-[#272B2A] mb-2 text-center">
          Key Features for Modern Investor Engagement
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4 md:max-xl:px-[60px] w-full max-w-screen-xl">
          <div className="flex flex-col gap-6">
            {" "}
            {/* Wrapper div with gap */}
            <EmpowerCards
              heading="Data enriched prospecting & engagement"
              subHeading="Leverage rich data insights to identify, engage, and convert high-potential prospects with precision and efficiency."
            />
          </div>
          <div className="flex flex-col gap-6">
            {" "}
            {/* Wrapper div with gap */}
            <EmpowerCards
              heading="Stand out in the chaos"
              subHeading="Use behavioral, transactional, and aspirational insights to craft personalized engagements that capture attention and drive action."
            />
          </div>
          <div className="flex flex-col gap-6">
            {" "}
            {/* Wrapper div with gap */}
            <EmpowerCards
              heading="Bespoke, on-premise, fully secure & compliant"
              subHeading="A tailor-made, on-premise solution ensuring top-tier security, full compliance, and complete data control."
            />
          </div>
          <div className="flex flex-col gap-6">
            {" "}
            {/* Wrapper div with gap */}
            <EmpowerCards
              heading="Personalized Wealth Management Tools"
              subHeading="Offer clients interactive tools for portfolio analysis, goal setting, and performance tracking."
            />
          </div>
          <div className="flex flex-col gap-6">
            {" "}
            {/* Wrapper div with gap */}
            <EmpowerCards
              heading="Integrated, Automated & AI-First"
              subHeading="Streamline onboarding with digital workflows, automated data capture, and driven by AI to optimize efficiency and enhance decision-making."
            />
          </div>
        </div>
      </div>

      <section className="py-16 px-4 text-center bg-gradient-to-b from-white to-[#F0FAF7]">
        {" "}
        {/* Gradient Background */}
        <h1 className="text-[40px] font-semibold text-[#272B2A] mb-2">
          Your Digital Partner for Hyper Growth
        </h1>
        <p className="text-lg md:text-xl text-[#272B2A] max-w-3xl mx-auto">
        Spring Money provides a comprehensive suite of digital assets  which can be integrated seamlessly with existing platforms at AMC to enhance investor engagement, streamline operations, and drive growth.
        </p>
      </section>

      {/* <div className="flex flex-col items-center py-16 bg-linearGradient4">
        <p className="text-[40px] font-semibold text-[#272B2A] mb-2 text-center">
          What you get
        </p>
        <p className="text-lg md:text-xl text-[#272B2A] text-center">
          We specialize in providing customized financial solutions for a diverse
          range of professionals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-4 md:max-xl:px-[60px] w-full max-w-screen-xl">
          <EmpowerCards
            heading="Acquisition Toolkit"
            subHeading="Turn First Impresssions into Lasting Relationships"
          />
          <EmpowerCards
            heading="Engagement Toolkit"
            subHeading="Engage Customers, Generate Leads"
          />
          <EmpowerCards
            heading="Knowledge Toolkit"
            subHeading="Educate, Empower & Build Trust Effortlessly"
          />
          <EmpowerCards
            heading="AI-Future Toolkit"
            subHeading="Automated, Cutting-Edge, Conversational"
          />
          <EmpowerCards
            heading="Customer Journeys Toolkit"
            subHeading="UX-First, Consent-led & Efficient"
          />
          <EmpowerCards
            heading="Analytics Toolkit"
            subHeading="Accurate Real-time & Insightful"
          />
        </div>
      </div> */}

      <div className="bg-[#F0FAF7] flex justify-center py-16">
        <Image
          src={experienceFrame}
          width={1000}
          height={800}
          alt="frame image"
        />
      </div>

      <div className="flex flex-col items-center py-14 md:py-28 bg-gradient-to-b from-[#F0FAF7] to-white">
        {" "}
        {/* Gradient Background */}
        <h1 className="text-4xl md:text-5xl font-bold mb-1 text-[#108E66] px-4 md:max-xl:px-[60px] w-full max-w-screen-xl text-center">
          Let&apos;s build the tomorrow together
        </h1>
        {/* <p className="text-lg md:text-xl  mx-auto text-[#108E66] px-4 md:max-xl:px-[60px] w-full max-w-screen-xl text-center">
          Schedule a free demo to learn how the Spring Money platform can
          transform your RIA experience.
        </p> */}
        <div className="flex justify-center mt-4">
          <Link
            href="https://wa.me/+918668484607"
            target="_blank"
            rel="noopener noreferrer"
            className=" items-center text-[#108E66] border border-[#108E66] bg-[#FCFFFE] px-8 py-3 rounded-md font-semibold hover:bg-[#108E66] hover:text-[#FCFFFE] transition"
          >
            Talk to Us
          </Link>
        </div>
      </div>

      <FAQAccordion faqs={faqs} />
    </div>
  );
}
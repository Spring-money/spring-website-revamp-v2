"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { sub } from "framer-motion/client";
import RiaFaqAccordion from "../components/RiaFaqAccordion";

interface InfoCardProps {
  imageSrc?: string;
  alt?: string;
  title: string;
  description: string;
}

interface FinancialAdvisorInfoProps {
  heading: string;
  subHeading1: string;
  subHeading2: string;
  subHeading3: string;
}

interface WhatYouGetInfoProps {
  heading: string;
  subHeading: string;
}

const faqs = [
  {
    question: "Who is Spring Money designed for?",
    answer:
      "Spring Money is specifically designed for accredited financial advisors who are looking to modernize their practices and enhance their client service offerings. We cater to advisors who want to leverage technology to gain a competitive edge in the rapidly evolving financial advisory landscape.",
  },
  {
    question: "What are the key benefits of using Spring Money?",
    answer:
      "Spring Money offers a comprehensive suite of benefits, including : Unified Platform - Manage client onboarding, transactions, and more, all in one place. Flexible & Scalable - Grow your business with a system that adapts to your needs. Enhanced Security - Robust encryption and automated compliance tracking. AI-Powered Insights: Make smarter decisions with data-driven intelligence. Improved Client Engagement - Tools to improve client communication, and overall client satisfaction.",
  },
  {
    question: "How does Spring Money help with compliance?",
    answer:
      "Compliance is a critical aspect of financial advisory. Spring Money simplifies this process by providing: Built-in Reporting Tools: Generate compliance reports quickly and easily, saving you time and reducing the risk of errors. Secure Data Management - Robust encryption and secure data storage protect sensitive client informationand ensure compliance with data protection regulations. Audit Trails - Maintain comprehensive audit trails for all client interactions and transactions, facilitating easy compliance audits.",
  },
  {
    question: "What kind of support does Spring Money offer?",
    answer:
      "We are committed to providing exceptional support to our advisors at every step. Our onboarding assistance ensures a smooth start with personalized guidance and hands-on training. If you encounter any technical issues, our dedicated support team is always available to provide prompt assistance. To help you stay ahead, we also offer ongoing training, keeping you updated on the latest features and best practices. No matter what you need, we’re here to support you every step of the way.",
  },
  {
    question: "What are the pricing options for Spring Money?",
    answer:
      "We offer flexible pricing plans that are tailored to the size and needs of your advisory practice. Our pricing is based on factors such as the number of advisors and clients, the features you require, and the level of support you need. We recommend contacting us to discuss your specific requirements and receive a personalized quote. We can also provide a free trial of our product.",
  },
];

const InfoCard: React.FC<InfoCardProps> = ({
  imageSrc,
  alt,
  title,
  description,
}) => {
  return (
    <div className="bg-[#FCFFFE] flex flex-col items-center rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-[#525ECC] p-4 gap-4">
      {imageSrc && (
        <div className="mb-4">
          <Image
            src={imageSrc}
            alt={alt || title}
            width={400}
            height={250}
            className="rounded-md object-cover w-full h-40"
          />
        </div>
      )}
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-xl font-medium text-[#272B2A]">{title}</h3>
        <p className="text-[#272b2abf] font-normal text-sm text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

const InfoCardSolution: React.FC<InfoCardProps> = ({
  imageSrc,
  alt,
  title,
  description,
}) => {
  return (
    <div className="bg-[#FCFFFE] flex flex-col-reverse items-center rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-[#525ECC] p-4 gap-4">
      {imageSrc && (
        <div className="mb-4">
          <Image
            src={imageSrc}
            alt={alt || title}
            width={400}
            height={250}
            className="rounded-md object-cover w-full h-40"
          />
        </div>
      )}
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-xl font-medium text-[#272B2A]">{title}</h3>
        <p className="text-[#272b2abf] font-normal text-sm ">{description}</p>
      </div>
    </div>
  );
};

const FinancialAdvisorInfo: React.FC<FinancialAdvisorInfoProps> = ({
  heading,
  subHeading1,
  subHeading2,
  subHeading3,
}) => {
  return (
    <div className="flex flex-col rounded-lg bg-[#FCFFFE] border border-[#525ECC] p-4">
      <p className="text-[#272B2A] text-xl font-medium mb-8 text-center">
        {heading}
      </p>
      <div className="rounded-[4px] border border-[#525ecccc] bg-[#EBECFA] py-2 mb-6">
        <p className="text-[#525ECC] text-base font-semibold text-center">
          {subHeading1}
        </p>
      </div>
      <div className="rounded-[4px] border border-[#525ecccc] bg-[#EBECFA] py-2 mb-6">
        <p className="text-[#525ECC] text-base font-semibold text-center">
          {subHeading2}
        </p>
      </div>
      <div className="rounded-[4px] border border-[#525ecccc] bg-[#EBECFA] py-2 mb-6">
        <p className="text-[#525ECC] text-base font-semibold text-center">
          {subHeading3}
        </p>
      </div>
    </div>
  );
};

const WhatYouGetInfo: React.FC<WhatYouGetInfoProps> = ({
  heading,
  subHeading,
}) => {
  return (
    <div className="rounded-lg bg-[#FCFFFE] border border-[#525ECC] text-center flex flex-col gap-2 p-4">
      <p className="text-[#272B2A] text-xl font-medium">{heading}</p>
      <p className="text-[#272b2abf] text-sm font-normal">{subHeading}</p>
    </div>
  );
};

export default function ForRiaPage() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ backgroundColor: "#fcfffe", color: "#272B2A" }}>
      {/* Hero Section */}
      <section className="text-center bg-[#EBECFA] py-16 md:py-20 px-4 md:px-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#525ECC]">
          The Digital Office for Financial Advisors
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-[#525ECC]">
          Streamline operations, automate workflows, and ensure compliance—all
          in one powerful platform.
        </p>
        <div className="mt-8">
          <Link
            href="https://wa.me/+918668484607"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#525ECC] text-[#FCFFFE] px-8 py-3 rounded-md font-semibold hover:bg-[#FCFFFE] hover:text-[#525ECC] transition"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="mx-auto py-16 md:py-20  flex flex-col items-center bg-gradient-to-b from-[#EBECFA] to-[#FCFFFE] px-4 md:px-16">
        <p className="text-4xl md:text-4xl font-bold mb-2 text-[#272B2A] text-center">
          Pressing Challenges for Advisors
        </p>
        <h2 className="text-xl font-normal text-center mb-8">
          We understand the hurdles you face in today&apos;s financial
          landscape.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-screen-xl text-center">
          <InfoCard
            imageSrc="/for-ria/rafiki3.svg"
            title="Inefficient Systems"
            description="Disconnected tools lead to wasted time and resources."
          />
          <InfoCard
            imageSrc="/for-ria/rafiki.svg"
            title="Time-Consuming Tasks"
            description="Manual workflows hinder growth and productivity."
          />
          <InfoCard
            imageSrc="/for-ria/computer.svg"
            title="Siloed Data"
            description="Fragmented information slows down decision-making."
          />
          <InfoCard
            imageSrc="/for-ria/bro.svg"
            title="Regulatory Complexity"
            description="Navigating evolving regulations adds risk and stress."
          />
        </div>
      </section>

      <section className="mx-auto py-16 md:py-20 flex flex-col items-center bg-[#FCFFFE] w-full px-4 md:px-16">
        <h1 className="text-4xl md:text-4xl font-bold mb-8 text-[#525ECC] text-center">
          A Complete Ecosystem for Advisors
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 max-w-screen-xl">
          <div className="flex flex-col gap-6 ">
            {" "}
            {/* Added wrapper div with gap */}
            <FinancialAdvisorInfo
              heading="TRANSFORMATION"
              subHeading1="Data Processing Excellence"
              subHeading2="Continuous Improvement"
              subHeading3="Value Generation"
            />
          </div>
          <div className="flex flex-col gap-6">
            {" "}
            {/* Added wrapper div with gap */}
            <FinancialAdvisorInfo
              gap-8
              mb-8
              max-w-screen-xl
              heading="INTELLIGENCE"
              subHeading1="Smart Analytics"
              subHeading2="Predictive Insights"
              subHeading3="Research-Driven Decisions"
            />
          </div>
          <div className="flex flex-col gap-6">
            {" "}
            {/* Added wrapper div with gap */}
            <FinancialAdvisorInfo
              gap-8
              mb-8
              max-w-screen-xl
              heading="INTEGRATION"
              subHeading1="Seamless Connectivity"
              subHeading2="Unified Platform"
              subHeading3="Harmonized Operations"
            />
          </div>
          <div className="flex flex-col gap-6 ">
            {" "}
            {/* Added wrapper div with gap */}
            <FinancialAdvisorInfo
              heading="TRUST"
              subHeading1="Security"
              subHeading2="Compliance"
              subHeading3="Reliability"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href="https://wa.me/+918668484607"
            target="_blank"
            rel="noopener noreferrer"
            className="items-center text-[#525ECC] border border-[#525ECC] bg-[#FCFFFE] px-8 py-3 rounded-md font-semibold hover:bg-[#525ECC] hover:text-[#FCFFFE] transition"
          >
            Get in touch to learn more
          </Link>
        </div>
      </section>

      {/* Solution Section */}
      <section className="mx-auto py-16 md:py-20  flex flex-col items-center w-full bg-gradient-to-b from-[#FCFFFE] to-[#EBECFA] px-4 md:px-16">
        <p className="text-4xl md:text-4xl font-bold mb-2 text-[#272B2A] text-center">
          The Spring Money Advantage
        </p>
        <h2 className="text-xl font-normal text-center mb-8">
          Unlock the tools and support you need to thrive.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-screen-xl">
          <InfoCardSolution
            imageSrc="/for-ria/rafiki1.svg"
            title="End-to-End Coverage"
            description="A Comprehensive Operating System for Financial Planning & Advisory Services"
          />
          <InfoCardSolution
            imageSrc="/for-ria/amico.svg"
            title="Modular & Scalable"
            description="Grow your business with a system that adapts to your needs."
          />
          <InfoCardSolution
            imageSrc="/for-ria/bro1.svg"
            title="Security & Compliance"
            description="Robust encryption and built-in regulatory tracking."
          />
          <InfoCardSolution
            imageSrc="/for-ria/bro2.svg"
            title="Integrated Intelligence"
            description="AI-powered insights for smarter decision-making."
          />
        </div>
      </section>

      <section className="mx-auto py-16 md:py-20  flex flex-col items-center w-full bg-[#EBECFA] px-4 md:px-16">
        <p className="text-4xl md:text-4xl font-bold mb-2 text-[#272B2A] text-center">
          Components Of Our Platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-xl mt-8">
          <Image
            src={"/for-ria/components.svg"}
            width={650}
            height={532}
            alt="component image"
          />
          <div className="flex flex-col gap-4 justify-center">
            {[
              "A Comprehensive Operating System for Financial Planning & Advisory Services",
              "Transforming Data into Valuable Insights",
              "A Comprehensive Operating System for Financial Planning & Advisory Services",
            ].map((text, index) => (
              <div
                key={index}
                className="rounded-lg bg-[#FCFFFE] border border-[#525ECC] text-center flex flex-col p-4 flex-1 justify-center"
              >
                <p className="text-[#272B2A] text-xl font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto py-16 md:py-20 gap-8 md:gap-8 flex flex-col items-center w-full bg-[#EBECFA] px-4 md:px-16">
        <h1 className="text-4xl md:text-4xl font-bold mb-2 text-[#272B2A] text-center">
          Empowering Your Practice with Powerful Tools
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl">
          <WhatYouGetInfo
            heading="Acquisition Toolkit"
            subHeading="Turn First Impresssions into Lasting Relationships"
          />
          <WhatYouGetInfo
            heading="Engagement Toolkit"
            subHeading="Engage Customers, Generate Leads"
          />
          <WhatYouGetInfo
            heading="Knowledge Toolkit"
            subHeading="Educate, Empower & Build Trust Effortlessly"
          />
          <WhatYouGetInfo
            heading="AI-Future Toolkit"
            subHeading="Automated, Cutting-Edge, Conversational"
          />
          <WhatYouGetInfo
            heading="Customer Journeys Toolkit"
            subHeading="UX-First, Consent-led & Efficient"
          />
          <WhatYouGetInfo
            heading="Analytics Toolkit"
            subHeading="Accurate Real-time & Insightful"
          />
        </div>
      </section>

      <div className="bg-gradient-to-b from-[#EBECFA] to-[#FCFFFE] py-16 md:py-20 px-4 md:px-16 flex flex-col items-center gap-8">
        <h1 className="text-3xl md:text-5xl font-bold text-[#525ECC] text-center w-full max-w-screen-xl">
          See Spring Money in Action
        </h1>
        <p className="text-lg md:text-xl text-[#525ECC] text-center w-full max-w-screen-xl">
          Schedule a free demo to discover how our platform can transform your
          advisory practice.
        </p>
        <div className="flex justify-center">
          <Link
            href="https://wa.me/+918668484607"
            target="_blank"
            rel="noopener noreferrer"
            className="items-center text-[#525ECC] border border-[#525ECC] bg-[#FCFFFE] px-8 py-3 rounded-md font-semibold hover:bg-[#525ECC] hover:text-[#FCFFFE] transition"
          >
            Schedule Your Demo Today
          </Link>
        </div>
      </div>

      <RiaFaqAccordion faqs={faqs} />
    </div>
  );
}

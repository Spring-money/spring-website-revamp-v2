"use client";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import React from "react";
import { Link } from "react-alice-carousel";
import CardWithDescription from "../../components/empower/CardWithDescription";
import FaqDropDown from "../../components/empower/faqDropDown";

const Nrich = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)"
  );
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const faqData = [
    {
      title: "Who can benefit from the NRIch program?",
      description:
        "NRIch is tailored for Non-Resident Indians who need expert guidance to manage their cross-border finances efficiently.",
    },
    {
      title: "Can NRIch help with real estate investments in India?",
      description:
        "Yes, we provide expert guidance for property purchases, rental management, and tax-efficient sales.",
    },
    {
      title: "What tax-saving strategies does NRIch offer for NRIs?",
      description:
        "We specialize in minimizing tax liabilities through DTAAs and personalized financial strategies.",
    },
    {
      title: "How do I begin my journey with NRIch?",
      description:
        "Start with a free consultation where our advisors assess your needs and recommend tailored solutions.",
    },
    {
      title: "What financial services does NRIch provide?",
      description:
        "From investments to taxation and real estate management, NRIch offers end-to-end financial planning for NRIs.",
    },
  ];
  return (
    <div className="flex flex-col items-center gap-9 pb-[2.25rem] self-stretch w-full">
      <div
        className="flex p-[3.75rem] sm:py-[3.75] sm:px-4 flex-col justify-center items-start gap-8 self-stretch bg-lightGray bg-cover bg-no-repeat flex-wrap"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #272B2A 0%, rgba(39, 43, 42, 0.60) 100%), url('/old-images/nrich_main.webp')",
          backgroundPosition: "50%",
        }}
      >
        <div className="flex flex-col justify-center items-center gap-2 self-stretch">
          <div className="self-stretch text-white text-[4rem] sm:text-[2rem] font-semibold leading-none tracking-[0.046rem] sm:tracking-[0.023rem]">
            Empowering NRIs to Manage Finances Seamlessly Across Countries
          </div>
          <div className="self-stretch text-[rgba(252,255,254,0.80)] font-poppins text-xl sm:text-[1rem] font-normal">
            Equipping you with tools and guidance to manage financial
            complexities and achieve stability in India and abroad.
          </div>
        </div>
        <Link
          href="https://wa.me/+918668484607"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex p-3 px-6 justify-center items-center gap-2 rounded-md bg-teal-600">
            <Image
              src="/old-images/whatsapp.svg"
              width={32}
              height={32}
              alt="whatsapp"
            />
            <span className="text-[#FCFFFE] font-poppins text-lg font-semibold leading-normal sm:text-[1rem]">
              Drop us a message to get started !
            </span>
          </div>
        </Link>
      </div>

      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            Why Choose NRIch?
          </span>
        </div>
        <div
          className="flex h-[46.875rem] sm:h-auto p-[7.5rem_3.75rem_3.75rem] flex-col justify-end items-center gap-2 self-stretch bg-lightGray bg-cover bg-no-repeat rounded-[0.5rem]"
          style={{
            backgroundImage: "url('/old-images/nrich_main_2.webp')",
            backgroundPosition: "50%",
          }}
        >
          <div className="flex p-8 flex-col justify-center items-start gap-8 self-stretch rounded-[0.5rem] bg-white shadow-lg">
            <span className=" text-[#108E66] font-poppins text-2xl font-semibold">
              Managing finances in two countries can be a significant challenge
              for NRIs, often impacting their productivity and peace of mind.
            </span>
            <span className="text-xl font-semibold leading-normal">
              NRIch is designed to address these challenges with tailored
              strategies, professional expertise, and practical tools that help
              employees manage their financial responsibilities in India and
              abroad. By providing clarity and confidence, NRIch empowers your
              workforce to focus on what matters most—personal and professional
              success.
            </span>
          </div>
        </div>
      </div>
      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            Comprehensive Services Tailored for NRIs
          </span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Investment Guidance"
              description="Empower employees to grow their wealth through mutual funds, equities, and alternative investment options."
              image={"/old-images/nrich-1.svg"}
            />
          </div>
          <div className="flex flex-col items-start  flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Tax Optimization"
              description="Minimize tax liabilities and optimize income management for employees working across jurisdictions."
              image={"/old-images/nrich-2.svg"}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Real Estate Management"
              description="Help employees navigate property ownership, rental income, and tax-optimized property sales with ease."
              image={"/old-images/nrich-3.svg"}
            />
          </div>
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Succession Planning"
              description="Support seamless wealth transfer with wills and trusts tailored for dual-country requirements."
              image={"/old-images/nrich-4.svg"}
            />
          </div>
        </div>
      </div>
      {isLargeScreen && (
        <Image
          src="/old-images/nrich_work_1.svg"
          width={1440}
          height={516}
          alt="nrich_work"
        />
      )}

      {isMediumScreen && (
        <Image
          src="/old-images/nrich_work_2.svg"
          width={1440}
          height={516}
          alt="nrich_work"
        />
      )}
      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-0">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            Guided by Expertise, Backed by Experience
          </span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <div className="flex p-4 flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Nitin Sawant"
              description="NS Wealth"
              image={"/old-images/nitin_sawant.svg"}
            />
          </div>
          <div className="flex p-4 flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Rohan Borawke"
              description="FinSharpe"
              image={"/old-images/rohan.svg"}
            />
          </div>
          <div className="flex p-4 flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Priyadarshini Mulay"
              description="Artha Fin Plan"
              image={"/old-images/priyadarshani.svg"}
            />
          </div>
        </div>
      </div>
      <span className="self-stretch text-gray-900 font-poppins text-[1.5rem] font-normal leading-normal sm:text-start px-4">
        With over 15 years of experience, our SEBI-registered advisors are
        experts in helping NRIs manage their financial responsibilities across
        two countries. By providing customized solutions, they ensure your
        employees achieve financial stability and long-term success, benefiting
        both their personal and professional lives.
      </span>
      <div
        className="flex p-[3.75rem] flex-col items-start gap-4 self-stretch"
        style={{
          background: "linear-gradient(0deg, #272B2A 0%, #353F3D 100%)",
        }}
      >
        <div className="flex flex-col justify-center items-center gap-2 self-stretch">
          <div className="self-stretch text-white text-[4rem] sm:text-[2rem] font-semibold leading-none tracking-[0.046rem] sm:tracking-[0.023rem]">
            Invest in your financial peace of mind.
          </div>
          <div className="self-stretch text-[rgba(252,255,254,0.80)] font-poppins text-xl sm:text-[1rem] font-normal">
            Let NRIch help you thrive across borders.
          </div>
        </div>
        <Link
          href="https://wa.me/+918668484607"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex p-3 px-6 justify-center items-center gap-2 rounded-md bg-teal-600">
            <Image
              src="/old-images/whatsapp.svg"
              width={32}
              height={32}
              alt="whatsapp"
            />
            <span className="text-[#FCFFFE] font-poppins text-lg font-semibold leading-normal sm:text-[1rem]">
              Drop us a message to get started !
            </span>
          </div>
        </Link>
      </div>
      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4 w-full">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            Common FAQs
          </span>
        </div>
        <div className="flex flex-col p-4 items-start gap-4 self-stretch rounded-md border border-gray-900_25 bg-white-A700">
          {faqData.map((data, index) => (
            <div key={index} className="flex flex-col gap-1 w-full">
              <FaqDropDown title={data.title} description={data.description} />
              {faqData.length - 1 !== index && (
                <hr className="w-full border-t border-gray-900_25 my-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nrich;

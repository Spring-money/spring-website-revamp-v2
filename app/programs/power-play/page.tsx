"use client";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import React from "react";
import { Link } from "react-alice-carousel";
import CardWithDescription from "../../components/empower/CardWithDescription";
import FaqDropDown from "../../components/empower/faqDropDown";

const PowerPlay = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)"
  );
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const faqData = [
    {
      title: "Who is this program for?",
      description:
        "Power Play is designed for students and new employees looking to build strong financial foundations.",
    },
    {
      title: "Do I need prior financial knowledge?",
      description:
        "Not at all! The program is beginner-friendly and tailored for first-time financial planners.",
    },
    {
      title: "How can I access personalized advice?",
      description:
        "Our SEBI registered investment advisors will guide you with tailored financial strategies.",
    },
    {
      title: "What tools are included in the program?",
      description:
        "You'll get access to financial management apps and resources for budgeting and investment tracking.",
    },
    {
      title: "Is Power Play relevant for the Indian market?",
      description:
        "Yes, all content is tailored to Indian financial scenarios and challenges.",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-9 pb-9 self-stretch w-full">
      <div
        className="flex p-[3.75rem] sm:py-[3.75] sm:px-4 flex-col justify-center items-start gap-8 self-stretch bg-lightGray bg-cover bg-no-repeat flex-wrap"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #272B2A 0%, rgba(39, 43, 42, 0.60) 100%), url('/old-images/powerPlay/pp-main-1.svg')",
          backgroundPosition: "50%",
        }}
      >
        <div className="flex flex-col justify-center items-center gap-2 self-stretch">
          <div className="self-stretch text-white text-[4rem] sm:text-[2rem] font-semibold leading-none tracking-[0.046rem] sm:tracking-[0.023rem]">
            Building a Strong Financial Foundation for India&apos;s Youth
          </div>
          <div className="self-stretch text-[rgba(252,255,254,0.80)] font-poppins text-xl sm:text-[1rem] font-normal">
            Your Partner in Conquering Finances—Start Smart Today!
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
              Start Your Journey Today!
            </span>
          </div>
        </Link>
      </div>

      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            What is Power Play
          </span>
        </div>
        <div
          className="flex h-[46.875rem] p-[7.5rem_3.75rem_3.75rem] flex-col justify-end items-center gap-2 self-stretch bg-lightGray bg-cover bg-no-repeat rounded-[0.5rem]"
          style={{
            backgroundImage: "url('/old-images/powerPlay/pp-main-1.svg')",
            backgroundPosition: "50%",
          }}
        >
          <div className="flex p-8 flex-col justify-center items-start gap-8 self-stretch rounded-[0.5rem] bg-white shadow-lg">
            <span className=" text-[#108E66] font-poppins text-2xl font-semibold">
              Your First Step to Financial Independence
            </span>
            <span className="text-xl font-semibold leading-normal">
              Managing personal finances as a student or new employee doesn&apos;t
              have to be daunting. Power Play by Spring Money equips you with
              practical tools and expert guidance to make smarter money
              decisions. Learn to build savings, invest early, and grow with
              advice from SEBI registered investment advisors.
            </span>
          </div>
        </div>
      </div>
      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            What You&apos;ll Gain with Power Play
          </span>
        </div>
        <div className="flex items-start gap-8 self-stretch flex-wrap">
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Master the Fundamentals"
              description="Grasp the basics of income, expenses, and budgeting with ease."
              image={"/old-images/powerPlay/pp-1.svg"}
            />
          </div>
          <div className="flex flex-col items-start  flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Plan Your Finances Wisely"
              description="Build a roadmap for managing personal finances, tailored for your needs."
              image={"/old-images/powerPlay/pp-2.svg"}
            />
          </div>
        </div>
        <div className="flex items-start gap-8 self-stretch">
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Invest in Your Future"
              description="Unlock beginner-friendly investment strategies suited to the Indian market."
              image={"/old-images/powerPlay/pp-3.svg"}
            />
          </div>
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Handle Debt Strategically"
              description="Discover effective ways to manage and minimize debt, including student loans."
              image={"/old-images/powerPlay/pp-4.svg"}
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
      <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4">
        <div className="flex flex-col items-center gap-6 self-stretch">
          <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
            Why Power Play Stands Out
          </span>
        </div>
        <div className="flex items-start gap-8 self-stretch flex-wrap">
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Future-Ready Skills"
              description="Learn tools and techniques to secure your financial future and achieve life goals with confidence."
              image={"/old-images/powerPlay/pp-highlight-1.svg"}
            />
          </div>
          <div className="flex flex-col items-start  flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Hands-On Learning"
              description="Practical lessons tailored to everyday financial decisions and long-term money management."
              image={"/old-images/powerPlay/pp-highlight-2.svg"}
            />
          </div>
        </div>
        <div className="flex items-start gap-8 self-stretch">
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Expert Support"
              description="Collaborate with SEBI registered investment advisors for professional guidance and strategies."
              image={"/old-images/powerPlay/pp-highlight-3.svg"}
            />
          </div>
          <div className="flex flex-col items-start gap-4 flex-1 self-stretch rounded-[0.5rem] border border-[rgba(39,43,42,0.15)] bg-white_A700 shadow-md">
            <CardWithDescription
              title="Engaging and Relatable"
              description="Interactive sessions designed to make financial planning fun and easy for beginners."
              image={"/old-images/powerPlay/pp-highlight-4.svg"}
            />
          </div>
        </div>
      </div>
      <div
        className="flex p-[3.75rem] flex-col items-start gap-4 self-stretch"
        style={{
          background: "linear-gradient(0deg, #272B2A 0%, #353F3D 100%)",
        }}
      >
        <div className="flex flex-col justify-center items-center gap-2 self-stretch">
          <div className="self-stretch text-white text-[4rem] sm:text-[2rem] font-semibold leading-none tracking-[0.046rem] sm:tracking-[0.023rem]">
            Take Charge Today!
          </div>
          <div className="self-stretch text-[rgba(252,255,254,0.80)] font-poppins text-xl sm:text-[1rem] font-normal">
            Build the skills to manage your finances with expert tools and
            guidance.
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
              Join Now
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

export default PowerPlay;

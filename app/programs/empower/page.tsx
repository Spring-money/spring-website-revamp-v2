"use client";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import ImageWithDescription from "../../components/empower/ImageWithDescription";
import CardWithDescription from "../../components/empower/CardWithDescription";
import FaqDropDown from "../../components/empower/faqDropDown";
import TestimonialCard from "../../components/testimonialCard";

const EmpowerPage = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1023px)"
  );
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const cardData = [
    {
      title: "Strengthen Relationships",
      description:
        "Empower your team to build stronger relationships with clients, partners, and customers, leading to increased sales and loyalty.",
      image: "/old-images/cardImage1.png",
    },
    {
      title: "Boost Your Sales",
      description:
        "Empower your team to drive higher sales, reduce lead times, and increase customer satisfaction.",
      image: "/old-images/cardImage-2.png",
    },
    {
      title: "Optimize Your Process",
      description:
        "Empower your team to streamline your processes, reduce errors, and increase efficiency.",
      image: "/old-images/cardImage3.png",
    },
    {
      title: "Increase Customer Loyalty",
      description:
        "Empower your team to increase customer loyalty, build repeat business, and drive more satisfied customers.",
      image: "/old-images/cardImage4.png",
    },
    {
      title: "Boost Your Sales",
      description:
        "Empower your team to drive higher sales, reduce lead times, and increase customer satisfaction.",
      image: "/old-images/cardImage5.png",
    },
    {
      title: "Optimize Your Process",
      description:
        "Empower your team to streamline your processes, reduce errors, and increase efficiency.",
      image: "/old-images/cardImage6.png",
    },
  ];

  const ImageData = [
    {
      title: "Start Early, Grow Big",
      description:
        "Early investments leverage compounding, turning small contributions into significant wealth over time.",
      image: "/old-images/empowerImage1.png",
    },
    {
      title: "Invest in Yourself",
      description:
        "Skill development and financial education enhance earning potential and smarter decision-making.",
      image: "/old-images/empowerImage2.png",
    },
    {
      title: "Explore New Avenues",
      description:
        "From mutual funds to real estate and digital gold, a range of investments can drive wealth creation.",
      image: "/old-images/empowerImage3.png",
    },
    {
      title: "Save Taxes, Build Wealth",
      description:
        "ELSS funds, NPS, and insurance offer dual benefits of tax savings and long-term financial growth.",
      image: "/old-images/empowerImage4.png",
    },
    {
      title: "Be Ready for Life",
      description:
        "Build an emergency fund and secure insurance to handle unexpected events with confidence.",
      image: "/old-images/empowerImage5.png",
    },
    {
      title: "Retire Stress-Free",
      description:
        "Start long-term investments now to ensure a comfortable and financially secure retirement.",
      image: "/old-images/empowerImage6.png",
    },
  ];

  const benefitsData = [
    {
      title: "Boost Your Team's Financial Confidence",
      description:
        "Empower your team with expert guidance, personalized tools, and actionable insights to enhance their financial confidence.",
      image: "/old-images/empowerBenefit1.png",
    },
    {
      title: "Empower Your Team to Build Stronger Relationships",
      description:
        "Empower your team to build stronger relationships with clients, partners, and customers, leading to increased sales and loyalty.",
      image: "/old-images/empowerBenefit2.png",
    },
    {
      title: "Empower Your Team to Boost Your Sales",
      description:
        "Empower your team to drive higher sales, reduce lead times, and increase customer satisfaction.",
      image: "/old-images/empowerBenefit3.png",
    },
  ];

  const portfolioData = [
    {
      title: "Spring Money x Jain Online University",
      image: "/old-images/empowerPortfolio1.png",
      isImage: true,
      secondaryImage: "/old-images/portfolioImage1.png",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7249364433280368640",
      linkText: "View Post On LinkedIn",
    },
    {
      title: "Spring Money x Zoop",
      image: "/old-images/empowerPortfolio2.png",
      isImage: true,
      secondaryImage: "/old-images/portfolioImage2.png",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7244988148684881920",
      linkText: "View Post On LinkedIn",
    },
    {
      title: "Spring Money x Technogise",
      image: "/old-images/empowerPortfolio3.png",
      isImage: true,
      secondaryImage: "/old-images/portfolioImage3.png",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7244556232143863808",
      linkText: "View Post On LinkedIn",
    },
    {
      title: "Spring Money x Dainik Bhaskar",
      image: "/old-images/empowerPortfolio4.png",
      isImage: true,
      secondaryImage: "/old-images/portfolioImage4.png",
      link: "https://www.linkedin.com/feed/update/urn:li:activity:7250076294762135552",
      linkText: "View Post On LinkedIn",
    },
  ];

  const faqData = [
    {
      title: "How much does the EmpPower program cost?",
      description:
        "The cost of the program depends on the size of your team and the level of customization required. We offer a free consultation to understand your needs and provide a tailored pricing plan that ensures maximum value for your organization.",
    },
    {
      title: "How much time will my employees need to invest in the program?",
      description:
        "The initial workshop takes just 45 minutes and is designed to fit into your team’s schedule seamlessly. Ongoing support and financial planning are personalized, allowing employees to engage at their own pace.",
    },
    {
      title: "What kind of results can I expect as an employer?",
      description:
        "Organizations that prioritize financial wellness see increased employee retention, reduced absenteeism, and improved productivity. By alleviating financial stress, your employees will be more focused, motivated, and loyal to your company.",
    },
    {
      title: "How secure is the financial information shared by employees?",
      description:
        "We prioritize data security and confidentiality. All financial information is handled by SEBI-registered advisors under strict compliance with industry regulations. Your employees’ data is encrypted and never shared without consent.",
    },
    {
      title:
        "Can this program be customized for specific industries or employee groups?",
      description:
        "Absolutely! Whether your team consists of tech professionals, retail staff, or executives, we tailor the program to address their unique financial challenges and goals.",
    },
  ];

  return (
    <div>
      <Head>
        <title>
          Comprehensive Financial Planning & SEBI-Registered Investment Advisory
          Services | Spring Money
        </title>
        <meta
          name="description"
          content="Secure your financial future with personalized financial planning and SEBI-registered investment advisory services from Spring Money. Tailored strategies to achieve your financial goals."
        />
      </Head>

      <div className="flex flex-col items-center gap-9 pb-[2.25rem] self-stretch w-full">
        <div
          className="flex p-[3.75rem] sm:py-[3.75] sm:px-4 flex-col justify-center items-start gap-8 self-stretch bg-lightGray bg-cover bg-no-repeat flex-wrap"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #272B2A 0%, rgba(39, 43, 42, 0.60) 100%), url('/old-images/empower_main.webp')",
            backgroundPosition: "50%",
          }}
        >
          <div className="flex flex-col justify-center items-center gap-2 self-stretch">
            <div className="self-stretch text-white text-[4rem] text-white sm:text-[2rem] font-semibold leading-none tracking-[0.046rem] sm:tracking-[0.023rem]">
              Empower Your Team, Enhance Productivity
            </div>
            <div className="self-stretch text-[rgba(252,255,254,0.80)]  text-xl sm:text-[1rem] font-normal">
              Boost your employees’ financial confidence with expert guidance,
              personalized tools, and actionable insights.
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
              <span className="text-[#FCFFFE] text-lg font-semibold leading-normal sm:text-[1rem]">
                Drop us a message to get started !
              </span>
            </div>
          </Link>
        </div>

        <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4">
          <div className="flex flex-col items-center gap-6 self-stretch">
            <span className="self-stretch text-center text-gray-900  text-3xl font-semibold leading-normal">
              Problem Statement
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {cardData.map((data, index) => (
              <div
                key={index}
                className="grid grid-col-1 md:grid-col-2 lg:gride-col-3 rounded-lg bg-white shadow-lg"
              >
                <CardWithDescription
                  image={data.image}
                  title={data.title}
                  description={data.description}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4 w-full">
          <div className="flex flex-col items-center gap-6 self-stretch">
            <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
              Opportunities For Growth
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full sm:w-full">
            {ImageData.map((data, index) => {
              return (
                <div key={index} className="flex w-1/2 sm:w-full flex-shrink-0">
                  <ImageWithDescription
                    image={data.image}
                    title={data.title}
                    description={data.description}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4 w-full items-center">
          <div className="flex flex-col items-center gap-6 self-stretch">
            <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
              Benefits For Employers
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-5">
            {benefitsData.map((data, index) => (
              <div
                key={index}
                className="flex-[1_1_calc(33.333%_-_1rem)] sm:flex-[1_1_calc(50%_-_1rem)] rounded-lg bg-white shadow-lg"
              >
                <CardWithDescription
                  title={data.title}
                  description={data.description}
                  image={data.image}
                />
              </div>
            ))}
          </div>
        </div>
        {isLargeScreen && (
          <Image
            src="/old-images/empPower/empower-1.svg"
            width={1440}
            height={516}
            alt="empower"
          />
        )}

        {isMediumScreen && (
          <Image
            src="/old-images/empPower/empower-1.svg"
            width={1440}
            height={516}
            alt="empower"
          />
        )}

        {isSmallScreen && (
          <Image
            src="/old-images/empPower/empower-2.svg"
            width={1440}
            height={516}
            alt="empower"
          />
        )}

        <div className="flex px-[3.75rem] py-[0.5rem] flex-col items-start gap-2 bg-white sm:py-0 sm:px-4 w-full">
          <div className="flex flex-col items-center gap-6 self-stretch">
            <span className="self-stretch text-center text-gray-900 font-poppins text-3xl font-semibold leading-normal">
              Our EmpPower Portfolio
            </span>
          </div>
          <div className="flex items-center justify-center gap-5 self-stretch flex-wrap ">
            {portfolioData.map((data, index) => (
              <TestimonialCard
                key={index}
                title={data.title}
                image={data.image}
                isImage={data.isImage}
                secondayImage={data.secondaryImage}
                link={data.link}
                linkText={data.linkText}
              />
            ))}
          </div>
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
                <FaqDropDown
                  title={data.title}
                  description={data.description}
                />
                {faqData.length - 1 !== index && (
                  <hr className="w-full border-t border-gray-900_25 my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpowerPage;

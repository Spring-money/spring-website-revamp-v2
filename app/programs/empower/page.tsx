"use client";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import ImageWithDescription from "../../components/empower/ImageWithDescription";
import CardWithDescription from "../../components/empower/CardWithDescription";
import FaqDropDown from "../../components/empower/faqDropDown";
import TestimonialCard from "../../components/TestimonialCard";
import PortfolioCard from "../../components/PortfolioCard";

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
        "The initial workshop takes just 45 minutes and is designed to fit into your team's schedule seamlessly. Ongoing support and financial planning are personalized, allowing employees to engage at their own pace.",
    },
    {
      title: "What kind of results can I expect as an employer?",
      description:
        "Organizations that prioritize financial wellness see increased employee retention, reduced absenteeism, and improved productivity. By alleviating financial stress, your employees will be more focused, motivated, and loyal to your company.",
    },
    {
      title: "How secure is the financial information shared by employees?",
      description:
        "We prioritize data security and confidentiality. All financial information is handled by SEBI-registered advisors under strict compliance with industry regulations. Your employees' data is encrypted and never shared without consent.",
    },
    {
      title:
        "Can this program be customized for specific industries or employee groups?",
      description:
        "Absolutely! Whether your team consists of tech professionals, retail staff, or executives, we tailor the program to address their unique financial challenges and goals.",
    },
  ];

  const testimonials = [
    {
      description: "Testimonial 1 description",
      author: "Author 1",
    },
    {
      description: "Testimonial 2 description",
      author: "Author 2",
    },
    {
      description: "Testimonial 3 description",
      author: "Author 3",
    },
  ];

  return (
    <div>
      <Head>
        <title>
          Empower Your Team with Financial Wellness | Spring Money
        </title>
        <meta
          name="description"
          content="Transform your workplace with Spring Money's financial wellness programs. Boost productivity and retention by empowering your team with expert financial guidance."
        />
      </Head>
      <div className="py-20 px-10 flex items-center justify-center flex-col gap-10">
        <div className="flex flex-col items-center justify-center gap-5 w-[70%]">
          <span className="text-5xl font-semibold text-gray-900 text-center">
            Unlock Your Team&apos;s Potential with Financial Wellness
          </span>
          <span className="text-xl font-normal text-gray-600 text-center">
            Transform your workplace with Spring Money&apos;s financial wellness programs.
            Boost productivity and retention by empowering your team with expert
            financial guidance.
          </span>
        </div>
        <div className="flex gap-5">
          <button className="bg-green-500 rounded-lg text-white font-semibold text-lg px-5 py-3">
            Request a free demo
          </button>
          <button className="border border-gray-900 rounded-lg text-gray-900 font-semibold text-lg px-5 py-3">
            Learn More
          </button>
        </div>
      </div>
      <div className="bg-[#FAFAFA] py-20 px-10 flex flex-col items-center justify-center gap-10">
        <span className="text-5xl font-semibold text-gray-900">
          Our trusted partners
        </span>
        <div className="flex gap-10">
          <Image
            src="/old-images/partner1.png"
            width={120}
            height={40}
            alt="jain university"
          />
          <Image src="/old-images/partner2.png" width={120} height={40} alt="zoop" />
          <Image
            src="/old-images/partner3.png"
            width={120}
            height={40}
            alt="technogise"
          />
          <Image
            src="/old-images/partner4.png"
            width={120}
            height={40}
            alt="dainik bhaskar"
          />
        </div>
      </div>
      <div className="py-20 px-10 flex flex-col gap-10 items-center justify-center">
        <span className="text-5xl font-semibold text-gray-900">
          Transform Your Team&apos;s Financial Future
        </span>
        <div className="grid grid-cols-3 gap-5">
          {cardData.map((item, index) => (
            <CardWithDescription
              key={index}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="py-20 px-10 flex flex-col gap-10">
        <span className="text-5xl font-semibold text-gray-900 text-center">
          Invest in Your Team&apos;s Success
        </span>
        <div className="grid grid-cols-3 gap-5">
          {ImageData.map((item, index) => (
            <ImageWithDescription
              key={index}
              title={item.title}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </div>
      <div className="bg-[#000] py-20 px-10 flex flex-col gap-10 items-center justify-center">
        <div className="flex flex-col gap-5 w-[70%] text-center">
          <span className="text-5xl font-semibold text-white">
            Why Financial Wellness Matters
          </span>
          <span className="text-xl font-normal text-gray-300">
            A financially secure team is a productive team. See how our
            programs drive tangible results for your business.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {benefitsData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 p-5 border border-gray-700 rounded-lg"
            >
              <Image src={item.image} width={364} height={200} alt="benefit" />
              <div className="flex flex-col gap-2">
                <span className="text-2xl font-semibold text-white">
                  {item.title}
                </span>
                <span className="text-base font-normal text-gray-300">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-20 px-10 flex flex-col gap-10 items-center justify-center">
        <span className="text-5xl font-semibold text-gray-900">
          Our Portfolio
        </span>
        <div className="grid grid-cols-2 gap-10">
          {portfolioData.map((item, index) => (
            <PortfolioCard
              key={index}
              title={item.title}
              image={item.image}
              isImage={item.isImage}
              secondayImage={item.secondaryImage}
              link={item.link}
              linkText={item.linkText}
            />
          ))}
        </div>
      </div>
      <div className="bg-[#FAFAFA] py-20 px-10 flex flex-col gap-10 items-center justify-center">
        <div className="flex flex-col gap-5 w-[70%]">
          <span className="text-5xl font-semibold text-gray-900 text-center">
            What Our Partners Say
          </span>
          <span className="text-xl font-normal text-gray-600 text-center">
            Hear from leaders who have transformed their workplaces with Spring
            Money.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={{
                text: testimonial.description,
                author: testimonial.author,
              }}
            />
          ))}
        </div>
      </div>
      <div className="py-20 px-10 flex flex-col gap-10 items-center justify-center">
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
  );
};

export default EmpowerPage;

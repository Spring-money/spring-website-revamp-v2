"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Blog from "../../components/Blog";
import Image from "next/image";
import sideArrow from "../../../public/Arrow 1.svg";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  minutesToRead: number;
  media: {
    wixMedia: {
      image: {
        url: string;
      };
    };
  };
}

const Carousel = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden w-full">
    <div className="flex space-x-4 animate-autoScroll w-max">{children}</div>
  </div>
);

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
];
const calculators = [...baseCalculators];

// interface BlogListingPageProps {
//   data: {
//     posts: Post[];
//   };
// }
const BlogListingPage = () => {
  const [completeData, setCompleteData] = useState<Post[]>();
  const [slicedData, setSlicedData] = useState<Post[]>();
  const [currentPage, setCurrentPage] = useState<number>(2);

  useEffect(() => {
    const fetchBlogLists = async () => {
      const response = await fetch("/api/blog", {
        method: "GET",
      });
      const data = await response?.json();
      console.log("data from list....", data);
      setCompleteData(data.posts);
      setSlicedData(data.posts.slice(0, 20));
    };
    fetchBlogLists();
    // setData(props.data.posts.slice(0, 20));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowMore = (): void => {
    const nextPageData = completeData?.slice(
      currentPage * 10,
      (currentPage + 1) * 10
    );
    setSlicedData((prevData) =>
      prevData && nextPageData ? [...prevData, ...nextPageData] : prevData || []
    );
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleBackToTop = (): void => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="  py-10 text-center bg-[#fcfffe] text-[#272B2A] w-screen flex flex-col gap-4 px-4 md:max-xl:px-[60px] max-w-screen-xl">
        <p className="text-[#108E66] text-xl font-semibold text-start">
          Experience innovative, tailored, and comprehensive financial planning
          for every stage of your life.
        </p>
        <Carousel>
          {calculators.map((calc) => (
            <motion.div
              key={calc.id}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 bg-[#F0FAF7] border border-[#108e6633] p-4 rounded-2xl shadow-md w-96 items-start hover:shadow-xl transition-shadow flex flex-col"
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
            </motion.div>
          ))}
        </Carousel>
      </div>
      <div className="flex flex-col gap-[0.50rem] px-4 md:max-xl:px-[60px] max-w-screen-xl">
        {slicedData?.map((d, index) => (
          <Link key={d.id} href={`/blog/${d.slug}`}>
            <Blog
              blogTitle={d.title}
              blogDesc={d.excerpt}
              blogImg={d.media.wixMedia.image.url}
              blogTime={d.minutesToRead}
              className="flex flex-1 flex-col gap-[0.50rem] rounded-lg border border-solid border-gray-900_3f bg-white-A700 p-4"
            />
          </Link>
        ))}
      </div>

      {slicedData &&
        completeData &&
        slicedData?.length < completeData?.length && (
          <div className="px-4 md:max-xl:px-[60px] w-full max-w-screen-xl">
            <button
              className="border border-[#272B2A] rounded flex justify-center py-2 mt-2 w-full"
              onClick={handleShowMore}
            >
              <span className="text-[#272B2A] text-sm font-medium">
                Show more
              </span>
            </button>
          </div>
        )}
      {!slicedData && (
        <div className="flex w-full justify-center min-h-screen">
          <ClipLoader color="#108e66" />
        </div>
      )}
      <div className="flex flex-col py-8 md:py-16 items-center justify-center bg-[#108E66] w-full mt-8 md:mt-16 px-4">
        <Image
          src={"/logo2.svg"}
          width={300}
          height={100}
          alt="spring money logo"
        ></Image>
        <span className="text-[#FCFFFE] text-[28px] font-semibold mt-4 text-center">
          To Learn More - Download Our App !
        </span>
        <div className="flex gap-4 mt-8">
          <Link
            href={
              "https://play.google.com/store/apps/details?id=com.spring.money"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/footer/play-store.svg"}
              width={160}
              height={40}
              alt="play store image"
            />
          </Link>
          <Link
            href={"https://apps.apple.com/in/app/spring-money/id1660751993"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={"/footer/app-store.svg"}
              width={160}
              height={40}
              alt="app store image"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogListingPage;

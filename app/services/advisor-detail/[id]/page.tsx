// /src/app/advisor-detail/[id]/page.tsx

import { use } from "react";
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Calendar,
  Video,
  Users,
  Newspaper,
  ChartBar,
  Calculator,
  Globe,
  Download,
  TrendingUp,
} from "lucide-react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import type {
  Advisor,
  AudienceType,
  Testimonial,
  ServiceItem,
  FeeItem,
  QA,
  CustomCTA,
} from "@/services/data/advisors";
import {
  mockAdvisors,
  customCTAMap,
  feeStructureMap,
  videoMap,
  faqBank,
  clientTypePillsMap,
  idealClientDescriptionMap,
} from "@/services/data/advisors";
import TestimonialCard from "@/components/TestimonialCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FAQVideosSection from '@/components/FAQVideosSection';
import CredentialsSection from '@/components/CredentialsSection';
import { getAdvisorName } from '@/services/lib/advisorData';

/* --------------------------------------------------------------------
   Types & Constants
-------------------------------------------------------------------- */

/* --------------------------------------------------------------------
   Client Description Map
-------------------------------------------------------------------- */
const clientDescriptionMap: Record<
  string,
  { description: string; icon: React.ReactNode }
> = {
  Salaried: {
    description:
      "Professionals seeking financial stability, tax optimization, and long-term wealth building through systematic investment planning.",
    icon: <Users size={16} className="text-spring-green" />,
  },
  "Business Owners": {
    description:
      "Entrepreneurs looking for business succession planning, tax strategies, and wealth preservation for their business and personal assets.",
    icon: <TrendingUp size={16} className="text-spring-green" />,
  },
  Retired: {
    description:
      "Retirees focused on wealth preservation, estate planning, and generating sustainable income from their retirement corpus.",
    icon: <ChartBar size={16} className="text-spring-green" />,
  },
  HNI: {
    description:
      "High net worth individuals seeking sophisticated investment strategies, tax optimization, and comprehensive wealth management solutions.",
    icon: <Globe size={16} className="text-spring-green" />,
  },
  NRIs: {
    description:
      "Non-resident Indians looking for cross-border investment opportunities, tax planning, and wealth management across multiple jurisdictions.",
    icon: <Globe size={16} className="text-spring-green" />,
  },
  "Young Professionals": {
    description:
      "Early career professionals seeking guidance on financial planning, investment strategies, and building a strong financial foundation.",
    icon: <Users size={16} className="text-spring-green" />,
  },
};

const sampleBlogs = [
  {
    id: "1",
    title: "Understanding Mutual Fund Expense Ratios",
    excerpt:
      "Learn how expense ratios impact your investment returns and what to look for when choosing mutual funds.",
    date: "June 15, 2023",
    slug: "understanding-mutual-fund-expense-ratios",
    image:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=60",
    author: "John Doe",
  },
  {
    id: "2",
    title: "Tax Planning Strategies for High‑Income Professionals",
    excerpt:
      "Discover effective tax‑planning strategies specifically designed for doctors, lawyers, and other high‑income professionals.",
    date: "May 22, 2023",
    slug: "tax-planning-strategies-high-income",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=60",
    author: "Jane Smith",
  },
  {
    id: "3",
    title: "Retirement Planning in Your 40s: What You Need to Know",
    excerpt:
      "It's never too late to start planning for retirement. Here's what to focus on if you're beginning in your 40s.",
    date: "April 10, 2023",
    slug: "retirement-planning-40s",
    image:
      "https://images.unsplash.com/photo-1559519529-0936e4058364?auto=format&fit=crop&w=800&q=60",
    author: "Michael Johnson",
  },
];

/* --------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------- */
function getAdvisor(id: string): Advisor {
  const found = mockAdvisors.find((a): a is Advisor => String(a.id) === id);
  if (!found) notFound();
  return found;
}

/* --------------------------------------------------------------------
   Page Component
-------------------------------------------------------------------- */
export default function AdvisorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const advisorName = getAdvisorName(id);
  const advisor = getAdvisor(id);

  /* Derived data */
  const address = advisor.location ?? "Location not specified";
  const sebiReg = advisor.reg ?? "INA1000137000";
  const services: ServiceItem[] = advisor.services ?? [];
  const feeStructure: FeeItem[] = feeStructureMap[id] ?? [];
  const customCTAs: CustomCTA[] = customCTAMap[id] ?? [];
  const testimonials = (advisor.testimonials ?? []) as Testimonial[];
  const faqs = faqBank[id] ?? [];
  const advisorVideo = videoMap[id];
  const isSpecial = id === "1";

  // Add FAQ videos only for specific advisor IDs
  const faqVideos = (() => {
    switch(advisorName) {
      case "Candor Investing":
        return [
          {
            id: "1",
            title: "How does Candor help with financial planning?",
            videoId: "t8jtaw6fq2Y", // Replace with actual YouTube ID
            // Optional: custom thumbnail
            // thumbnailUrl: "/images/advisors/candor-faq1-thumb.jpg"
          },
          {
            id: "2",
            title: "Long-Term Investing Explained: The Power of Compounding for Financial Freedom",
            videoId: "7KWRbgw3C28" // Replace with actual YouTube ID
          },
          {
            id: "3",
            title: "Stocks vs Gold vs Bitcoin – What Really Builds Wealth?",
            videoId: "WVLqiC0CGk8" // Replace with actual YouTube ID
          }
        ];
      case "Bachhat":
        return [
          {
            id: "1",
            title: "Bachhat investment philosophy",
            videoId: "dQw4w9WgXcQ" // Replace with actual YouTube ID
          },
          {
            id: "2",
            title: "How Bachhat Money helps you save",
            videoId: "dQw4w9WgXcQ" // Replace with actual YouTube ID
          },
          {
            id: "3",
            title: "Bachhat Money's portfolio management approach",
            videoId: "dQw4w9WgXcQ" // Replace with actual YouTube ID
          }
        ];
      default:
        return null;
    }
  })();

  /* Card factories */
  const FeeCard = () => (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#272A2B]">
          Fee Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {feeStructure.map(({ service, amount }) => (
            <div key={service} className="flex justify-between">
              <span className="text-[#272A2B]">{service}</span>
              <span className="font-medium text-[#272A2B]">{amount}</span>
            </div>
          ))}
        </div>
        <p className="pt-4 text-xs text-gray-500">
          * Fees may vary depending on scope.
        </p>
      </CardContent>
    </Card>
  );

  const CredentialsCard = () => (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-[#272A2B]">
          Credentials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {advisorCredentials.map((cred) => (
            <li key={cred} className="flex items-center">
              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-spring-green">
                ✓
              </span>
              <span className="text-[#272A2B]">{cred}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const IdealClientsCard = () => (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold text-[#272A2B]">
          <Users size={18} className="mr-2 text-spring-green" />
          Ideal Clients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(clientTypePillsMap[id] || advisor.audience).map(
              (pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800"
                >
                  {pill}
                </span>
              )
            )}
          </div>
          <p className="text-sm text-gray-600">
            {idealClientDescriptionMap[id] ||
              "Clients seeking personalized financial advice and wealth management solutions."}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const SidebarStack = () => (
    <div className="flex flex-col space-y-6">
      {FeeCard()}
      {CredentialsCard()}
      {IdealClientsCard()}
    </div>
  );

  const InfoCardsGrid = () => (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {FeeCard()}
        {CredentialsCard()}
        {IdealClientsCard()}
      </div>
    </div>
  );

  const FAQSection = () =>
    faqs.length ? (
      <div className="mx-auto mt-12 max-w-7xl px-4 pb-12">
        <h2 className="mb-4 text-2xl font-semibold text-[#272A2B]">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map(({ question, answer }, idx: number) => (
            <details
              key={idx}
              className="group rounded-lg border border-spring-green bg-[#F5FFFB] p-4 shadow-sm open:shadow-md"
            >
              <summary className="flex items-center justify-between cursor-pointer text-spring-green font-semibold">
                <span>{question}</span>
                <ChevronDown
                  size={16}
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <hr className="-mx-4 my-2 h-px w-[calc(100%+2rem)] border-0 bg-spring-green" />
              <p className="text-sm text-[#272A2B]">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    ) : null;

  // Define credentials for each advisor
  const getAdvisorCredentials = (advisorId: string) => {
    const name = getAdvisorName(advisorId);
    
    switch(name) {
      case "MyGuide2Wealth":
        return [
          "Certified Financial Planner (CFP)",
          "SEBI Registered Investment Advisor"
        ];
      case "Candor Investing":
        return [
          "Certified Investment Advisor (CIA)",
          "SEBI Registered Investment Advisor",
          "Masters in Financial Analysis"
        ];
      case "NS Wealth Solution":
        return [
          "SEBI Registered Investment Advisor"
        ];
      case "Artha Fin Plan":
        return [
          "Financial Planning Specialist",
          "MBA Finance"
        ];
      case "FinSharpe Investment Advisors":
        return [
          "SEBI Registered Investment Advisor",
          "Wealth Management Certified Professional"
        ];
      case "Bachhat":
        return [
          "Certified Financial Analyst (CFA)",
          "SEBI Registered Investment Advisor",
          "Chartered Accountant",
        ];
      default:
        return [];
    }
  };
  
  const advisorCredentials = getAdvisorCredentials(id);

  /* ----------------------------- JSX ----------------------------- */
  return (
    <main className="mx-auto w-[90%] overflow-x-hidden">
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* ----------------------------- Hero Section ----------------------------- */}
        <div className="border-b border-gray-200 bg-[#FCFFFE] pb-2 md:pb-4">
          <div className="mx-auto max-w-7xl px-4 pt-8">
            <Link
              href="/services#advisorList"
              className="mb-6 inline-flex items-center text-spring-green hover:text-opacity-80"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Advisors
            </Link>

            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-0">
                <div className="flex flex-col gap-8 md:flex-row">
                  {/* Photo */}
                  <div className="md:w-1/4">
                    <div className="aspect-[1/1] overflow-hidden rounded-lg bg-gray-100 shadow-md">
                      <Image
                        src={advisor.photo}
                        alt={advisorName}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="md:w-2/3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl font-bold text-[#272A2B]">
                        {advisorName}
                      </h1>
                      {advisor.verifiedBySpring && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-spring-green">
                          <CheckCircle size={14} className="mr-1" />
                          Verified by Spring
                        </span>
                      )}
                    </div>
                    <div className="mb-4 flex flex-wrap items-center gap-x-8 gap-y-2">
                      <p className="text-sm">
                        <span className="font-semibold text-[#272A2B]">
                          Principal Advisor:
                        </span>{" "}
                        {advisor.PrincipalAdvisor}
                      </p>
                      <p className="text-sm font-semibold text-[#272A2B]">
                        {sebiReg}
                      </p>
                    </div>
                    <div className="mb-6 flex items-center text-gray-500">
                      <MapPin size={16} className="mr-1" />
                      {address}
                    </div>
                    <p className="mb-6 text-gray-700">{advisor.about}</p>
                    <div className="-m-1 flex flex-wrap">
                      {advisor.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="m-1 inline-flex whitespace-nowrap rounded-full bg-[#018e66] px-2.5 py-0.5 text-xs font-semibold text-[#fcfffe]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-4">
                      {/* Custom CTAs */}
                      {customCTAs.map((cta, index) => (
                        <a
                          key={index}
                          href={cta.href}
                          target={
                            cta.href.startsWith("tel:") ? undefined : "_blank"
                          }
                          rel={
                            cta.href.startsWith("tel:")
                              ? undefined
                              : "noopener noreferrer"
                          }
                          className={`inline-flex h-10 items-center justify-center rounded-md px-4 font-medium ${
                            cta.variant === "primary"
                              ? "bg-[#108e66] text-white shadow hover:bg-[#0d7a55] focus:outline-none focus:ring-2 focus:ring-[#108E66] focus:ring-offset-2"
                              : "border border-spring-green bg-transparent text-spring-green hover:bg-green-50"
                          }`}
                        >
                          {cta.icon}
                          {cta.text}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --------------------------- Conditional Layout --------------------------- */}
        {isSpecial ? (
          InfoCardsGrid()
        ) : (
          <div className="mx-auto max-w-7xl gap-8 px-4 py-8 lg:grid lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Card className="h-[calc(100%+5px)]">
                <CardHeader className="flex flex-col items-start pb-2">
                  <div className="mb-1 flex items-center text-2xl font-semibold text-[#272A2B]">
                    <Video size={24} className="mr-2 text-spring-green" />
                    Meet {advisorName}
                  </div>
                  <p className="text-lg font-light text-[#272A2B]">
                    {advisor.tagline}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <AspectRatio ratio={16 / 9} className="h-[calc(100%+3px)]">
                    <iframe
                      src={advisorVideo}
                      title="intro video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full rounded-md object-cover"
                    />
                  </AspectRatio>
                </CardContent>
              </Card>
            </div>
            <aside className="mt-8 lg:mt-0">{SidebarStack()}</aside>
          </div>
        )}

        {/* ---------------------------- Services Offered --------------------------- */}
        <div className="mx-auto mb-8 max-w-7xl px-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-semibold text-[#272A2B]">
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {services.map((svc) => (
                  <div
                    key={svc.name}
                    className="flex items-start gap-3 rounded-lg bg-white p-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-spring-green">
                      ✓
                    </span>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <h3 className="font-medium text-[#272A2B]">{svc.name}</h3>
                      <p className="break-words text-sm text-gray-500">
                        {svc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------------------------------- About --------------------------------- */}
        <div className="mx-auto max-w-7xl px-4">
          <Card>
            <CardHeader className="pt-5 pb-2">
              <CardTitle className="text-2xl font-semibold text-[#272A2B]">
                About {advisorName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#272A2B]">{advisor.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* --------------------------- Testimonials ------------------------------- */}
        {testimonials.length > 0 && (
          <div className="mx-auto mt-12 max-w-7xl px-4">
            <h2 className="mb-4 text-2xl font-semibold text-[#272A2B]">
              Client Testimonials
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, idx) => (
                <TestimonialCard key={idx} testimonial={t} />
              ))}
            </div>
          </div>
        )}

        {/* --------------------------- Latest Articles --------------------------- */}
        {/* <div className="mx-auto mt-12 max-w-7xl px-4"> */}
        {/* <header className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#272A2B]">
              Latest Articles
            </h2>
            <Link
              href={`/services/advisor-detail/${advisor.id}/blogs`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Newspaper size={16} />
              Blogs
            </Link>
          </header>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {sampleBlogs.map(({ id, title, excerpt, date, slug, image }) => (
              <div key={id} className="rounded-lg bg-white p-6 shadow-lg">
                <div className="h-48 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#272A2B]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{excerpt}</p>
                <p className="mt-4 text-xs text-gray-400">{date}</p>
                <Link
                  href={`/blog/${slug}`}
                  className="mt-4 inline-block text-sm font-medium text-spring-green hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div> */}
      </div>
      {/* </div> */}

      {/* FAQ Section */}
      {FAQSection()}

      {/* Only show FAQ videos for specified advisors */}
      {faqVideos && <FAQVideosSection videos={faqVideos} />}
    </main>
  );
}

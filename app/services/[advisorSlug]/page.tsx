"use client";

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
  Service,
  FeeItem,
  QA,
  CustomCTA,
} from "@/services/data/advisors";
import {
  advisors,
} from "@/services/data/advisors";
import TestimonialCard from "@/components/TestimonialCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FAQVideosSection from "@/components/FAQVideosSection";
import CredentialsSection from "@/components/CredentialsSection";
import { generateAdvisorSlug } from "@/services/lib/advisorData";

/* --------------------------------------------------------------------
   Helpers
-------------------------------------------------------------------- */
function getAdvisorBySlug(advisorSlug: string): Advisor | null {
  // Find advisor by matching the slug
  const found = advisors.find((advisor) => {
    const advisorNameSlug = generateAdvisorSlug(advisor.advisorName);
    const firmNameSlug = generateAdvisorSlug(advisor.firmName);
    const expectedSlug = `${advisorNameSlug}-${firmNameSlug}`;
    return expectedSlug === advisorSlug;
  });
  
  return found || null;
}

/* --------------------------------------------------------------------
   Page Component
-------------------------------------------------------------------- */
export default function AdvisorDetailPage({
  params,
}: {
  params: Promise<{ advisorSlug: string }>;
}) {
  const { advisorSlug } = use(params);
  const advisor = getAdvisorBySlug(advisorSlug);
  
  if (!advisor) {
    notFound();
  }
  
  // Use firm name directly from advisor data instead of hardcoded mapping
  const advisorName = advisor.firmName;

  // Generate custom video section title
  const getVideoTitle = () => {
    if (advisorName === "Advent Financial") {
      return "Meet Rahul, Founder & Principal Adviser of Advent Financial";
    }
    return `Meet ${advisorName}`;
  };

  /* Derived data */
  const address = advisor.location ?? "Location not specified";
  const sebiReg = advisor.reg ?? "INA1000137000";
  const services: Service[] = advisor.services ?? [];
  const feeStructure: FeeItem[] = advisor.feeStructure ?? [];
  const advisorCTAs: CustomCTA[] = advisor.cta ?? [];
  const testimonials = (advisor.testimonials ?? []) as Testimonial[];
  const faqs = advisor.faqs ?? [];
  const advisorVideo = advisor.videoUrl;
  const isSpecial = advisor.id === "1" || advisor.id === "7" || advisor.id === "9";

  // Add FAQ videos only for specific advisor IDs
  const faqVideos = (() => {
    switch (advisorName) {
      case "Candor Investing":
        return [
          {
            id: "1",
            title: "How does Candor help with financial planning?",
            videoId: "t8jtaw6fq2Y",
          },
          {
            id: "2",
            title:
              "Long-Term Investing Explained: The Power of Compounding for Financial Freedom",
            videoId: "7KWRbgw3C28",
          },
          {
            id: "3",
            title: "Stocks vs Gold vs Bitcoin – What Really Builds Wealth?",
            videoId: "WVLqiC0CGk8",
          },
        ];
      case "Bachhat":
        return [
          {
            id: "1",
            title: "Markets at All-Time High: Should You Invest or Wait?",
            videoId: "46dL41WNvhI",
          },
          {
            id: "2",
            title: "How to Ensure Your Kids Get Your Wealth",
            videoId: "k0Tw2mHySI0",
          },
          {
            id: "3",
            title: "Can You Retire at 45 with a ₹1 Lakh Monthly Salary?",
            videoId: "__gBuogQNTE",
          },
        ];
      
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
            {(advisor.clientTypePills || advisor.audience).map((pill: string) => (
              <span
                key={pill}
                className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800"
              >
                {pill}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            {advisor.idealClientDescription ||
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
          {faqs.map(({ question, answer }: { question: string; answer: string }, idx: number) => (
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
    // Get the advisor data directly
    const advisor = getAdvisorBySlug(advisorSlug);
    if (!advisor) return [];
    
    // Base credentials that all advisors should have
    const baseCredentials = ["SEBI Registered Investment Advisor"];
    
    // Add additional credentials based on advisor data or specializations
    const additionalCredentials = [];
    
    // Add CFP if advisor has financial planning specializations
    if (advisor.specializations.includes("Financial Planning") || 
        advisor.specializations.includes("Retirement Planning") ||
        advisor.specializations.includes("Tax Planning")) {
      additionalCredentials.push("Certified Financial Planner (CFP)");
    }
    
    // Add MBA Finance for certain advisors (you can customize this logic)
    if (advisor.firmName.includes("Capital") || 
        advisor.firmName.includes("Elite") ||
        advisor.firmName.includes("Cedrus")) {
      additionalCredentials.push("MBA Finance");
    }
    
    // Add Chartered Accountant for tax-focused advisors
    if (advisor.specializations.includes("Tax Planning") && 
        (advisor.firmName.includes("Tax") || advisor.firmName.includes("Bachhat"))) {
      additionalCredentials.push("Chartered Accountant");
    }
    
    // Add Legal Expert for estate planning advisors
    if (advisor.specializations.includes("Estate Planning")) {
      additionalCredentials.push("Legal Expert");
    }
    
    // Add NISM certification for investment-focused advisors
    if (advisor.specializations.includes("Stock Investments") || 
        advisor.specializations.includes("Mutual Funds")) {
      additionalCredentials.push("NISM Series-X-B: Investment Advisor Level 2");
    }
    
    // Special case for MyGuide2Wealth (advisor 1)
    if (advisorId === "1") {
      return ["SEBI Registered Investment Advisor", "NISM Certified Research Analyst and Equity Derivatives Specialist", "Certified Financial Planner (CFP)"];
    }
    
    // Special case for FinSharpe (advisor 5)
    if (advisorId === "5") {
      return ["SEBI Registered Investment Advisor", "NISM Series-X-B: Investment Advisor Level 2"];
    }
    // Special case for Bachhat (advisor 6)
    if (advisorId === "6") {
      return ["SEBI Registered Investment Advisor", "Chartered Accountant and CFA (Level 3 Passed Out)"];
    }
    if (advisorId === "7") {
      return ["SEBI Registered Investment Advisor", "Associate of Indian Insitute of India", "PG Diploma in Business Finance"];
    }
    if (advisorId === "8") {
      return ["SEBI Registered Investment Advisor", "Certified Financial Planner", "Registered Life Planner"];
    }
    
    // Special case for Ketan Kiran Gogte (advisor 10)
    if (advisorId === "10") {
      return ["SEBI Registered Investment Advisor", "MBA from IIT Kharagpur"];
    }
    
    // Special case for Jay Sheth (advisor 11)
    if (advisorId === "11") {
      return ["SEBI Registered Investment Advisor", "MBA", "ACCA"];
    }
    
    // Return combined credentials
    return [...baseCredentials, ...additionalCredentials];
  };

  const advisorCredentials = getAdvisorCredentials(advisor.id);

  return (
    <main className="mx-auto w-[90%] overflow-x-hidden">
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Hero Section */}
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
                        {advisor.principalAdvisor}
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
                      {advisorCTAs.map((cta, index) => (
                        <a
                          key={index}
                          href={cta.href}
                          target={cta.href.startsWith("tel:") ? undefined : "_blank"}
                          rel={cta.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
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

        {/* Conditional Layout */}
        {isSpecial ? (
          InfoCardsGrid()
        ) : (
          <div className="mx-auto max-w-7xl gap-8 px-4 py-8 lg:grid lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Card className="h-[calc(100%+5px)]">
                <CardHeader className="flex flex-col items-start pb-2">
                  <div className="mb-1 flex items-center text-2xl font-semibold text-[#272A2B]">
                    <Video size={24} className="mr-2 text-spring-green" />
                    {getVideoTitle()}
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

        {/* Services Offered */}
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

        {/* About */}
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

        {/* Testimonials */}
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

        {/* FAQ Section */}
        {FAQSection()}

        {/* FAQ Videos */}
        {faqVideos && <FAQVideosSection videos={faqVideos} />}
      </div>
    </main>
  );
} 
// /src/app/advisor-detail/[id]/page.tsx
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  Calendar,
  Video,
  Users,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  mockAdvisors,
  type Advisor,
  type Testimonial,
  type Specialization,
  type AudienceType,
} from "@/services/data/advisors";
import TestimonialCard from "@/components/TestimonialCard";
import BlogPost, { BlogPostType } from "@/components/BlogPost";
import ClientImage from "@/components/ClientImage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

/* --------------------------------------------------------------------
   Helper types
-------------------------------------------------------------------- */
interface ServiceItem {
  name: string;
  description: string;
}
interface FeeItem {
  service: string;
  amount: string;
}

/* --------------------------------------------------------------------
   Sample blog data (static for UI mock‑up)
-------------------------------------------------------------------- */
const sampleBlogs: BlogPostType[] = [
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
   Static intro‑video map (1‑to‑1 with mock advisor ids)
-------------------------------------------------------------------- */
const videoMap: Record<string, string> = {
  "1": "https://www.youtube.com/embed/JWcG7FCQu1w",
  "2": "https://www.youtube.com/embed/TvnX-xEjQYk",
  "3": "https://www.youtube.com/embed/VIDEO_ID_3",
  "4": "https://www.youtube.com/embed/VIDEO_ID_4",
  "5": "https://www.youtube.com/embed/VIDEO_ID_5",
};

/* -------------------------------------------------------------------- 
   Page component 
-------------------------------------------------------------------- */
// Helper function to get advisor data
function getAdvisor(id: string) {
  const advisor = mockAdvisors.find((a) => String(a.id) === id);
  if (!advisor) notFound();
  return advisor;
}

export default async function AdvisorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>   // <-- params is now a Promise
}) {
  const { id } = await params;      // <-- resolve it immediately
  const advisor = getAdvisor(id);   // synchronous lookup against mock data

  /* ------------------------------------------------------------------
     Derived & fallback data
  ------------------------------------------------------------------ */
  const address = advisor.location ?? "Location not specified";
  const sebiReg = advisor.reg ?? "INA1000137000";
  const services: ServiceItem[] = (advisor.services as ServiceItem[]) ?? [];
  const feeStructure: FeeItem[] = [
    { service: "Financial Planning", amount: "₹15 000 – ₹35 000" },
    { service: "Investment Management", amount: "0.75 – 1.25 % of AUM" },
    { service: "Hourly Consultation", amount: "₹2 500 / hour" },
  ];

  const credentials = [
    "Certified Financial Planner (CFP)",
    "SEBI Registered Investment Advisor",
  ];

  const testimonials = (advisor.testimonials ?? []).slice(0, 3);
  const advisorVideo = videoMap[advisor.id];

  return (
    <main className="mx-auto w-[90%] overflow-x-hidden">
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* ------------------------------------------------------------ */}
        {/*                        Hero Section                        */}
        {/* ------------------------------------------------------------ */}
        <div className="border-b border-gray-200 bg-[#FCFFFE] pb-2 md:pb-4">
          <div className="mx-auto max-w-7xl px-4 pt-8">
            <Link
              href="/services"
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
                      <ClientImage
                        src={advisor.photo}
                        alt={advisor.advisorName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="md:w-2/3">
                    {/* Firm name + badge */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl font-bold text-[#272A2B]">
                        {advisor.firmName}
                      </h1>
                      {advisor.verifiedBySpring && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-spring-green">
                          <CheckCircle size={14} className="mr-1" />
                          Verified by Spring
                        </span>
                      )}
                    </div>

                    {/* Principal advisor + SEBI reg */}
                    <div className="mb-4 flex flex-wrap items-center gap-x-8 gap-y-2">
                      <p className="text-sm">
                        <span className="font-semibold text-[#272A2B]">
                          Principal Advisor:
                        </span>{" "}
                        <span className="font-semibold text-[#272A2B]">
                          {advisor.PrincipalAdvisor}
                        </span>
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

                    {/* Specialisation chips */}
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

                    {/* CTA */}
                    {advisor.contactDetails.calendlyLink && (
                      <div className="mt-6">
                        <a
                          href={advisor.contactDetails.calendlyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center justify-center rounded-md bg-[#018e66] px-4 font-medium text-[#fcfffe] shadow hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#108E66] focus:ring-offset-2"
                        >
                          <Calendar size={16} className="mr-2" />
                          Schedule Meeting
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*                Main Grid (primary + sidebar)               */}
        {/* ------------------------------------------------------------ */}
        <div className="mx-auto max-w-7xl gap-8 px-4 py-4 lg:grid lg:grid-cols-3">
          {/* ---------------- Primary column -------------------- */}
          <div className="space-y-8 lg:col-span-2">
            {/* Intro video */}
            <Card>
              <CardHeader className="flex flex-col items-start pb-4">
                <div className="mb-1 flex items-center text-2xl font-semibold text-[#272A2B]">
                  <Video size={24} className="mr-2 text-spring-green" />
                  Meet {advisor.advisorName}
                </div>
                <p className="text-lg font-light text-[#272A2B]">
                  {advisor.tagline}
                </p>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={advisorVideo}
                    title={`${advisor.advisorName} introduction video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full rounded-md object-cover"
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          </div>

          {/* ---------------- Sidebar --------------------------- */}
          <aside className="mt-8 flex flex-col space-y-6 lg:mt-0">
            {/* Fee structure */}
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-[#272A2B]">
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <div className="space-y-1 text-sm">
                  {feeStructure.map((f) => (
                    <div key={f.service} className="flex justify-between">
                      <span className="text-[#272A2B]">{f.service}</span>
                      <span className="font-medium text-[#272A2B]">
                        {f.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-auto pt-4 text-xs text-gray-500">
                  * Fees may vary according to complexity and scope of work
                </p>
              </CardContent>
            </Card>

            {/* Credentials */}
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-[#272A2B]">
                  Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <ul className="space-y-1">
                  {credentials.map((cred) => (
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

            {/* Ideal clients */}
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-semibold text-[#272A2B]">
                  <Users size={18} className="mr-2 text-spring-green" />
                  Ideal Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="grow">
                <div className="mt-6 flex flex-wrap gap-2">
                  {advisor.audience.map((aud: AudienceType) => (
                    <span key={aud} className="m-1 inline-flex whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {aud}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  These are the client profiles{" "}
                  {advisor.advisorName.split(" ")[0]} works with most often.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*                   Services Offered Card                     */}
        {/* ------------------------------------------------------------ */}
        <div className="mx-auto mb-8 max-w-7xl px-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-semibold text-[#272A2B]">
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {services.map((svc, index) => (
                  <div
                    key={svc.name}
                    className={`flex items-start gap-3 rounded-lg bg-white p-2 ${
                      index === 0 && advisor.id === "4" ? "col-span-2" : "" // Only for advisor with ID 4, first service takes full width
                    }`}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-spring-green">
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

        {/* ------------------------------------------------------------ */}
        {/*                        About Section                        */}
        {/* ------------------------------------------------------------ */}
        <div className="mx-auto max-w-7xl px-4">
          <Card>
            <CardHeader className="pt-5 pb-2">
              <CardTitle className="text-2xl font-semibold text-[#272A2B]">
                About {advisor.firmName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#272A2B]">{advisor.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------ */}
        {/*                       Testimonials                         */}
        {/* ------------------------------------------------------------ */}
        {testimonials.length > 0 && (
          <div className="mx-auto mt-12 max-w-7xl px-4">
            <h2 className="mb-4 text-2xl font-semibold text-[#272A2B]">
              Client Testimonials
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t: Testimonial, i: number) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </div>
          </div>
        )}

{/* ------------------------------------------------------------ */}
{/*                       Latest Articles Section               */}
{/* ------------------------------------------------------------ */}
<div className="mx-auto mt-12 max-w-7xl px-4">
  <header className="mb-4 flex items-center justify-between">
    <h2 className="text-2xl font-semibold text-[#272A2B]">
      Latest Articles
    </h2>
    <Link
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
      href={`/services/advisor-detail/${advisor.id}/blogs`}
    >
      <Newspaper size={16} />
      Blogs
    </Link>
  </header>
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {sampleBlogs.map((post) => (
      <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-[#272A2B]">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{post.excerpt}</p>
        <p className="mt-4 text-xs text-gray-400">{post.date}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-block text-sm font-medium text-spring-green hover:underline"
        >
          Read More
        </Link>
      </div>
    ))}
  </div>
</div>

      </div>
    </main>
  );
}

import { Calendar, ChartBar } from "lucide-react";
import type { Advisor } from "./advisors";

export interface AdvisorInput {
  id: string;
  firmName: string;
  advisorName: string;
  principalAdvisor: string;
  sebiReg: string;
  photo?: string;
  location: string;
  tagline: string;
  specializations: string[];
  audience: string[];
  about: string;
  description: string;
  services: Array<{name: string, description: string}>;
  feeStructure: Array<{service: string, amount: string}>;
  testimonials?: Array<{text: string, author: string, designation?: string}>;
  videoUrl?: string;
  ctaLinks: Array<{text: string, href: string, variant: "primary" | "secondary"}>;
  faqs?: Array<{question: string, answer: string}>;
  clientTypePills?: string[];
  idealClientDescription?: string;
  successStories?: string[];
  grievanceOfficer?: {name: string, email: string};
  verifiedBySpring?: boolean;
}

export const createAdvisorProfile = (data: AdvisorInput): Advisor => ({
  id: data.id,
  firmName: data.firmName,
  advisorName: data.advisorName,
  principalAdvisor: data.principalAdvisor,
  reg: `SEBI RIA REG NO: ${data.sebiReg}`,
  photo: data.photo || "/advisors/default-advisor.svg",
  location: data.location as any,
  tagline: data.tagline,
  specializations: data.specializations as any,
  audience: data.audience as any,
  about: data.about,
  description: data.description,
  services: data.services,
  feeStructure: data.feeStructure,
  successStories: data.successStories,
  testimonials: data.testimonials || [],
  videoUrl: data.videoUrl,
  sebiRegistrationNumber: data.sebiReg,
  verifiedBySpring: data.verifiedBySpring ?? false,
  grievanceOfficer: data.grievanceOfficer || { 
    name: "Support Team", 
    email: "support@springmoney.in" 
  },
  cta: data.ctaLinks.map(link => ({
    ...link,
    icon: undefined // Icons will be added in the component rendering
  })),
  faqs: data.faqs,
  clientTypePills: data.clientTypePills,
  idealClientDescription: data.idealClientDescription
}); 
import { Calendar, ChartBar } from "lucide-react";

export type Specialization =
  | "Retirement Planning"
  | "Tax Planning"
  | "NRI Services"
  | "Estate Planning"
  | "Mutual Funds"
  | "Insurance"
  | "Stock Investments"
  | "Financial Planning"
  | "Wealth Management"
  | "Debt Management";

export type AudienceType =
  | "Salaried"
  | "Business Owners"
  | "Retired"
  | "HNI"
  | "NRIs"
  | "Young Professionals";

export type Location =
  | "Mumbai"
  | "Delhi"
  | "Bengaluru"
  | "Hyderabad"
  | "Chennai"
  | "Pune, Maharashtra"
  | "Kolkata"
  | "Remote/Virtual"
  | "Noida, Uttar Pardesh";

export interface Testimonial {
  text: string;
  author: string;
  designation?: string;
}

/**
 * Individual service offered by an advisor.
 */
export interface Service {
  /** Display name of the service */
  name: string;
  /** Short marketing‑friendly description shown on the advisor card or detail page */
  description: string;
}

export interface Advisor {
  id: string;
  firmName: string;
  advisorName: string;
  PrincipalAdvisor: string;
  reg: string;
  photo: string;
  location: Location;
  tagline: string;
  specializations: Specialization[];
  audience: AudienceType[];
  about: string;
  /**
   * Long‑form narrative for the advisor card (added 2025‑06‑04).
   */
  description: string;
  /**
   * List of primary services with short copy (updated 2025‑06‑04).
   */
  services: Service[];
  /**
   * List of professional credentials and certifications (added 2025‑01‑27).
   */
  credentials: string[];
  testimonials?: Testimonial[];
  verifiedBySpring: boolean;
}

/* ------------ mock advisors ------------ */
export const mockAdvisors: Advisor[] = [
  {
    id: "1",
    firmName: "My guide 2 Wealth",
    advisorName: "Robins Joseph",
    PrincipalAdvisor: "Robins Joseph",
    reg: "SEBI RIA REG NO: INA100013700",
    photo: "/advisors/RobinsJoseph1.svg",
    location: "Noida, Uttar Pardesh",
    tagline: "Your partner on a journey Towards prosperity and Financial wellness",
    specializations: [
      "Financial Planning",
      "Retirement Planning",
      "Tax Planning",
    ],
    audience: ["Salaried", "HNI"],
    about:
      "At MyGuide2Wealth, we're not just financial advisors — we're your partners on a journey towards prosperity and financial wellness.",
    description:
      `At MyGuide2Wealth, we're not just financial advisors—we're your partners on a journey towards prosperity and financial wellness. With 10 years of experience in financial advisory, Robins Joseph has helped numerous clients achieve their financial goals through personalized strategies and dedicated service.  Our personalized approach ensures that each client receives a customized financial strategy that works for their unique situation. We believe in building wealth strategies for your peace of mind.`,
    services: [
      {
        name: " Financial Planning",
        description: "Professional Comprehensive Financial Planning services tailored to your needs.",
      },
      {
        name: "Retirement Strategy",
        description: "Professional Retirement Strategy services tailored to your needs.",
      },
      {
        name: "Tax Optimization",
        description: "Professional Tax Optimization services tailored to your needs.",
      },
      {
        name: "Investment Portfolio Design",
        description: "Professional Investment Portfolio Design services tailored to your needs.",
      },
    ],
    credentials: [
      "Certified Financial Planner (CFP®)",
      "SEBI Registered Investment Advisor",
      
    ],
    testimonials: [
      {
        text: "Rajiv's financial guidance has completely transformed our approach to retirement planning. We now feel confident about our future.",
        author: "Priya Sharma",
        designation: "IT Professional",
      },
      {
        text: "Working with MyGuide2Wealth has been the best financial decision we have made. Their tax strategies alone paid for their services multiple times over.",
        author: "Amit Patel",
        designation: "Business Owner",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "2",
    firmName: "Candor Investing",
    advisorName: "Amey Kulkarni",
    PrincipalAdvisor: "Amey Kulkarni",
    reg: "SEBI RIA REG NO: INA000019479",
    photo: "/advisors/AmeyKulkarni2.svg",
    location: "Pune, Maharashtra",
    tagline: "Building your financial future with Candor",
    specializations: [
      "Stock Investments",
      "Mutual Funds",
      "Financial Planning",
    ],
    audience: ["Young Professionals", "Salaried"],
    about:
      "Future Forward Financial helps tech professionals and young earners build wealth through strategic investments and methodical financial planning.",
    description:
      `At Candor Investing, we believe in transparent, client‑centric financial guidance. We're dedicated to empowering you with clear insights and personalized strategies, helping you navigate the complexities of the market with confidence and achieve your financial aspirations. `,
    services: [
      {
        name: "Investment Advisiory",
        description: "Expert investment advice tailored to your financial goals and risk profile..",
      },
      {
        name: "Portfolio Manangement",
        description: "Professional management of your investment portfolio for optimal growth..",
      },
      {
        name: "Financial Goal Planning",
        description: "Crafting actionable plans to achieve your short-term and long-term financial goals.",
      },
      {
        name: "Wealth Management",
        description: "Comprehensive strategies for preserving and growing your wealth over time.. ",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
      
      
    ],
    testimonials: [
      {
        text: "Priya helped me understand my company ESOPs and create a diversification strategy that made a huge difference to my portfolio.",
        author: "Karthik Raman",
        designation: "Software Engineer",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "3",
    firmName: "NS Wealth",
    advisorName: "Nitin Sawant",
    PrincipalAdvisor: "Nitin Sawant",
    reg: "SEBI RIA REG NO: INA000009551",
    photo: "/advisors/NitinSawant3.svg",
    location: "Pune, Maharashtra",
    tagline: "Specializing in NRI financial planning and investments",
    specializations: ["NRI Services", "Tax Planning", "Estate Planning"],
    audience: ["NRIs", "HNI"],
    about:
      "Global Indian Advisors focuses on the unique financial challenges faced by Non‑Resident Indians, including cross‑border taxation and asset repatriation.",
    description:
      `At NS Wealth, we are committed to providing personalized and ethical financial guidance. We help you build robust strategies, understand your investments, and achieve your financial milestones with clarity and confidence. Our focus is on your long‑term prosperity.`,
    services: [
      {
        name: "Financial Planning",
        description: "Holistic plans covering income, spending, goals, and risk tailored to NRI realities.",
      },
      {
        name: "Retirement Strategy",
        description: "Blueprints to accumulate and repatriate retirement wealth across geographies, tax‑efficiently.",
      },
      {
        name: "Tax Optimization",
        description: "Minimizing double‑tax through DTAA awareness and strategic use of foreign income exclusions.",
      },
      {
        name: "Tax Advisory",
        description: "On‑call expertise for specific queries like property sale, remittances, or inheritance taxation.",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
     
    ],
    testimonials: [
      {
        text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
        author: "Rohan Mehra",
        designation: "NRI, Singapore",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "4",
    firmName: "Artha Fin Plan",
    advisorName: "Priyadarshini Mulye",
    PrincipalAdvisor: "Ajay Vaidya",
    reg: "SEBI RIA REG NO: INH000009551",
    photo: "/advisors/Priya4.svg",
    location: "Pune, Maharashtra",
    tagline: "Planning for the retirement you deserve",
    specializations: ["Retirement Planning", "Financial Planning", "Insurance"],
    audience: ["Retired", "Salaried"],
    about:
      " ARTHA FinPlan is s SEBI Registered Investment Advisor dedicated to providing personalized , professional, and unbisaed financial planning and advisory services.",
    description:
      `ARTHA FinPlan is a SEBI Registered Investment Advisor dedicated to providing personalized, professional, and unbiased financial planning and investment advisory services. Founded by Priyadarshini Mulye, a seasoned financial expert with an MBA in Finance and CFP® certification, our core philosophy revolves around helping clients achieve their realistic financial goals through a holistic, fee‑only approach.\nWe believe in educating our clients about personal finance management, acting as a reliable partner throughout their wealth‑building journey. As a fiduciary, we are committed to acting in your best interest, ensuring complete transparency and conflict‑free advice by not being involved in any product distribution.`,
    services: [
      {
        name: "Comprehensive Financial Planning",
        description: "Risk Profiling & Assessment, Goal-based Planning (Dream Home, Child's Education/Marriage, Retirement, World Tour, etc.), Review of Existing Investments & Insurance (Second Opinion), Tax Planning & Optimization, Insurance Planning (Adequate Coverage Assessment), Investment Planning (Aligned with Goals & Risk Profile), Retirement Planning",
      },
      {
        name: "Online Financial Advisory",
        description: "Serving clients across India and globally, with a significant client base from other cities.",
      },
      {
        name: "Implementation & Review",
        description: "We guide you through the implementation of your financial plan and provide regular reviews to track progress and make necessary adjustments.",
      },
      {
        name: "Retirement Planning",
        description: "Specialized retirement planning services including pension optimization, income planning, and wealth preservation strategies for retirees.",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
     
    ],
    testimonials: [
      {
        text: "Thanks to Ajay's methodical approach, we've secured our retirement and can help our children financially as well.",
        author: "Suresh & Lalita Murthy",
        designation: "Retired Government Officials",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "5",
    firmName: "Finsharpe",
    advisorName: "Rohan Borawake",
    PrincipalAdvisor: "Rohan Borawake",
    reg: "SEBI RIA REG NO: INH000005678",
    photo: "/advisors/RohanBorawake5.svg",
    location: "Pune, Maharashtra",
    tagline: "Sophisticated strategies for substantial wealth",
    specializations: ["Wealth Management", "Estate Planning", "Tax Planning"],
    audience: ["HNI", "Business Owners"],
    about:
      "Finsharpe is a SEBI Registered investment Advisor dedicated to providing comprehensive, personalized,and ethical financial planning and investment advisory.",
    description: `FinSharpe is a SEBI Registered Investment Advisor dedicated to providing comprehensive, personalized, and ethical financial planning and investment advisory services.\n\nFounded by Shuchi Mundra, a CERTIFIED FINANCIAL PLANNER (CFP®) and MBA (Finance), our mission is to empower individuals and families to achieve their financial aspirations through strategic guidance and unbiased advice.\n\nWe believe in fostering long‑term relationships built on trust, transparency, and education. As a fiduciary, FinSharpe is committed to always acting in your best interest, ensuring our recommendations are solely focused on your financial well‑being, free from product sales commissions.`,
    services: [
      {
        name: "Comprehensive Financial Planning",
        description: "Professional Comprehensive Financial Planning services tailored to your needs.",
      },
      {
        name: "Investment Advisiory Services",
        description: "Expert investment advice tailored to your financial goals and risk profile.",
      },
      {
        name: "Financial Wellness Program",
        description: "Tailored solutions for individuals and families seeking financial clarity and growth.",
      },
      {
        name: "Online financial Advisor",
        description: "Serving clients across India and globally, providing convenient access to expert advice.",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
     
    ],
    testimonials: [
      {
        text: "Nisha's expertise in structuring our family wealth has been invaluable, especially for business succession across generations.",
        author: "Raj Malhotra",
        designation: "Business Owner",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "6",
    firmName: "Bachhat",
    advisorName: "Vishal Bharat Shah",
    PrincipalAdvisor: "Vishal Bharat Shah",
    reg: "SEBI RIA REG NO: INA000019220",
    photo: "/advisors/NitinSawant3.svg",
    location: "Pune, Maharashtra",
    tagline: "Specializing in NRI financial planning and investments",
    specializations: [ "Financial Planning", "Retirement Planning"],
    audience: ["NRIs", "HNI", "Young Professionals"],
    about:
      "Global Indian Advisors focuses on the unique financial challenges faced by Non‑Resident Indians, including cross‑border taxation and asset repatriation.",
    description:
      `At NS Wealth, we are committed to providing personalized and ethical financial guidance. We help you build robust strategies, understand your investments, and achieve your financial milestones with clarity and confidence. Our focus is on your long‑term prosperity.`,
    services: [
      {
        name: "Financial Planning",
        description: "Holistic plans covering income, spending, goals, and risk tailored to NRI realities.",
      },
      {
        name: "Retirement Strategy",
        description: "Blueprints to accumulate and repatriate retirement wealth across geographies, tax‑efficiently.",
      },
      {
        name: "Tax Optimization",
        description: "Minimizing double‑tax through DTAA awareness and strategic use of foreign income exclusions.",
      },
      {
        name: "Tax Advisory",
        description: "On‑call expertise for specific queries like property sale, remittances, or inheritance taxation.",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
     
    ],
    testimonials: [
      {
        text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
        author: "Rohan Mehra",
        designation: "NRI, Singapore",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "7",
    firmName: "Hum Fauji",
    advisorName: "Name",
    PrincipalAdvisor: "Name",
    reg: "SEBI RIA REG NO: INA000009551",
    photo: "/advisors/NitinSawant3.svg",
    location: "Pune, Maharashtra",
    tagline: "Specializing in NRI financial planning and investments",
    specializations: ["NRI Services", "Tax Planning", "Estate Planning"],
    audience: ["NRIs", "HNI"],
    about:
      "Global Indian Advisors focuses on the unique financial challenges faced by Non‑Resident Indians, including cross‑border taxation and asset repatriation.",
    description:
      `At NS Wealth, we are committed to providing personalized and ethical financial guidance. We help you build robust strategies, understand your investments, and achieve your financial milestones with clarity and confidence. Our focus is on your long‑term prosperity.`,
    services: [
      {
        name: "Financial Planning",
        description: "Holistic plans covering income, spending, goals, and risk tailored to NRI realities.",
      },
      {
        name: "Retirement Strategy",
        description: "Blueprints to accumulate and repatriate retirement wealth across geographies, tax‑efficiently.",
      },
      {
        name: "Tax Optimization",
        description: "Minimizing double‑tax through DTAA awareness and strategic use of foreign income exclusions.",
      },
      {
        name: "Tax Advisory",
        description: "On‑call expertise for specific queries like property sale, remittances, or inheritance taxation.",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
     
    ],
    testimonials: [
      {
        text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
        author: "Rohan Mehra",
        designation: "NRI, Singapore",
      },
    ],
    verifiedBySpring: true,
  },
  {
    id: "8",
    firmName: "Prosperentia Investment Advisors LLP",
    advisorName: "Name",
    PrincipalAdvisor: "Name",
    reg: "SEBI RIA REG NO: INA000018957",
    photo: "/advisors/NitinSawant3.svg",
    location: "Mumbai",
    tagline: "Specializing in NRI financial planning and investments",
    specializations: ["NRI Services", "Tax Planning", "Estate Planning"],
    audience: ["NRIs", "HNI"],
    about:
      "Global Indian Advisors focuses on the unique financial challenges faced by Non‑Resident Indians, including cross‑border taxation and asset repatriation.",
    description:
      `At NS Wealth, we are committed to providing personalized and ethical financial guidance. We help you build robust strategies, understand your investments, and achieve your financial milestones with clarity and confidence. Our focus is on your long‑term prosperity.`,
    services: [
      {
        name: "Financial Planning",
        description: "Holistic plans covering income, spending, goals, and risk tailored to NRI realities.",
      },
      {
        name: "Retirement Strategy",
        description: "Blueprints to accumulate and repatriate retirement wealth across geographies, tax‑efficiently.",
      },
      {
        name: "Tax Optimization",
        description: "Minimizing double‑tax through DTAA awareness and strategic use of foreign income exclusions.",
      },
      {
        name: "Tax Advisory",
        description: "On‑call expertise for specific queries like property sale, remittances, or inheritance taxation.",
      },
    ],
    credentials: [
      "SEBI Registered Investment Advisor",
      
    ],
    testimonials: [
      {
        text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
        author: "Rohan Mehra",
        designation: "NRI, Singapore",
      },
    ],
    verifiedBySpring: true,
  },

];

export const specializations: Specialization[] = [
  "Retirement Planning",
  "Tax Planning",
  "NRI Services",
  "Estate Planning",
  "Mutual Funds",
  "Insurance",
  "Stock Investments",
  "Financial Planning",
  "Wealth Management",
  "Debt Management",
];

export const audienceTypes: AudienceType[] = [
  "Salaried",
  "Business Owners",
  "Retired",
  "HNI",
  "NRIs",
  "Young Professionals",
];

export const locations: Location[] = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune, Maharashtra",
  "Kolkata",
  "Remote/Virtual",
  "Noida, Uttar Pardesh",
];

/* --------------------------------------------------------------------
   Custom CTA Map
-------------------------------------------------------------------- */
export const customCTAMap: Record<string, CustomCTA[]> = {
  "1": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
  ],
  "2": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
    {
      text: "View Smallcase",
      href: "tel:+919000001122",
      variant: 'secondary',
      icon: <ChartBar size={16} className="mr-2" />
    },
  ],
  "3": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
  ],
  "4": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
  ],
  "5": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
    {
      text: "View Smallcase",
      href: "tel:+919833221144",
      variant: 'secondary',
      icon: <ChartBar size={16} className="mr-2" />
    },
  ],
  "6": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
  ],
  "7": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
  ],
  "8": [
    {
      text: "Schedule Meeting",
      href: ".",
      variant: 'primary',
      icon: <Calendar size={16} className="mr-2" />
    },
  ],
};

/* --------------------------------------------------------------------
   Fee Structure Map
-------------------------------------------------------------------- */
export const feeStructureMap: Record<string, FeeItem[]> = {
  "1": [
    { service: "Financial Planning", amount: "₹15,000 – ₹35,000" },
    { service: "Investment Management", amount: "0.75% – 1.25% of AUM" },
    { service: "Hourly Consultation", amount: "₹2,500 / hour" },
    { service: "Tax Planning", amount: "₹10,000 – ₹25,000" }
  ],
  "2": [
    { service: "Investment Advisory", amount: "₹20,000 – ₹40,000" },
    { service: "Portfolio Management", amount: "1% – 1.5% of AUM" },
    { service: "Financial Goal Planning", amount: "₹25,000 – ₹45,000" },
    { service: "Wealth Management", amount: "1.25% – 1.75% of AUM" }
  ],
  "3": [
    { service: "NRI Financial Planning", amount: "₹30,000 – ₹50,000" },
    { service: "Cross-border Tax Planning", amount: "₹25,000 – ₹45,000" },
    { service: "Estate Planning", amount: "₹35,000 – ₹55,000" },
    { service: "Investment Advisory", amount: "1% – 1.5% of AUM" }
  ],
  "4": [
    { service: "Comprehensive Financial Planning", amount: "₹25,000 – ₹45,000" },
    { service: "Online Financial Advisory", amount: "₹20,000 – ₹35,000" },
    { service: "Implementation & Review", amount: "₹15,000 / quarter" },
    { service: "Retirement Planning", amount: "₹30,000 – ₹50,000" }
  ],
  "5": [
    { service: "Wealth Management", amount: "1.5% – 2% of AUM" },
    { service: "Estate Planning", amount: "₹40,000 – ₹60,000" },
    { service: "Tax Planning", amount: "₹30,000 – ₹50,000" },
    { service: "Financial Wellness Program", amount: "₹35,000 – ₹55,000" }
  ],
  "6": [
    { service: "NRI Financial Planning", amount: "₹30,000 – ₹50,000" },
    { service: "Cross-border Tax Planning", amount: "₹25,000 – ₹45,000" },
    { service: "Estate Planning", amount: "₹35,000 – ₹55,000" },
    { service: "Investment Advisory", amount: "1% – 1.5% of AUM" }
  ],
  "7": [
    { service: "NRI Financial Planning", amount: "₹30,000 – ₹50,000" },
    { service: "Cross-border Tax Planning", amount: "₹25,000 – ₹45,000" },
    { service: "Estate Planning", amount: "₹35,000 – ₹55,000" },
    { service: "Investment Advisory", amount: "1% – 1.5% of AUM" }
  ],
  "8": [
    { service: "NRI Financial Planning", amount: "₹30,000 – ₹50,000" },
    { service: "Cross-border Tax Planning", amount: "₹25,000 – ₹45,000" },
    { service: "Estate Planning", amount: "₹35,000 – ₹55,000" },
    { service: "Investment Advisory", amount: "1% – 1.5% of AUM" }
  ],
};

/* --------------------------------------------------------------------
   Video Map
-------------------------------------------------------------------- */
export const videoMap: Record<string, string> = {
  "1": "https://www.youtube.com/embed/JWcG7FCQu1w",
  "2": "https://www.youtube.com/embed/TvnX-xEjQYk",
  "3": "https://www.youtube.com/embed/VIDEO_ID_3",
  "4": "https://www.youtube.com/embed/VIDEO_ID_4",
  "5": "https://www.youtube.com/embed/VIDEO_ID_5",
  "6": "https://www.youtube.com/embed/VIDEO_ID_6",
  "7": "https://www.youtube.com/embed/VIDEO_ID_7",
  "8": "https://www.youtube.com/embed/VIDEO_ID_8",
};

/* --------------------------------------------------------------------
   FAQ Bank
-------------------------------------------------------------------- */
export const faqBank: Record<string, QA[]> = {
  "1": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],
  "2": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],
  "3": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],
  "4": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],
  "5": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],
  "6": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],  
  "7": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],  
  "8": [
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
    { question: "Question?", answer: "Answer" },
  ],
};

/* --------------------------------------------------------------------
   Client Type Pills Map
-------------------------------------------------------------------- */
export const clientTypePillsMap: Record<string, string[]> = {
  "1": [
    "Salaried Professionals",
    "Young Families",
    "Tax Planning",
    "Investment Planning"
  ],
  "2": [
    "Business Owners",
    "Entrepreneurs",
    "Wealth Management",
    "Succession Planning"
  ],
  "3": [
    "NRIs",
    "Global Investors",
    "Cross-border Planning",
    "International Tax"
  ],
  "4": [
    "Retirees",
    "Pre-retirees",
    "Estate Planning",
    "Income Planning"
  ],
  "5": [
    "High Net Worth",
    "Family Offices",
    "Wealth Preservation",
    "Legacy Planning"
  ],
  "6": [
    "NRIs",
    "Global Investors",
    "Cross-border Planning",
    "International Tax"
  ],
  "7": [
    "NRIs",
    "Global Investors",
    "Cross-border Planning",
    "International Tax"
  ],
  "8": [
    "NRIs",
    "Global Investors",
    "Cross-border Planning",
    "International Tax"
  ],
};

/* --------------------------------------------------------------------
   Ideal Client Description Map
-------------------------------------------------------------------- */
export const idealClientDescriptionMap: Record<string, string> = {
  "1": "I specialize in helping salaried professionals and young families build a strong financial foundation. My approach focuses on creating sustainable wealth through systematic investment planning and tax optimization strategies.",
  "2": "I work with business owners and entrepreneurs who are looking to grow their wealth while managing their business finances effectively. My expertise lies in business succession planning and comprehensive wealth management.",
  "3": "I specialize in serving NRIs and global investors, providing expert guidance on cross-border investments, tax planning, and wealth management across multiple jurisdictions.",
  "4": "I focus on helping retirees and pre-retirees create sustainable income streams and preserve their wealth. My approach emphasizes estate planning and retirement income strategies.",
  "5": "I work with high net worth individuals and families, offering sophisticated investment strategies and comprehensive wealth management solutions tailored to their unique needs.",
  "6": "About Bachhat Wealth Management",
  "7": "About Hum Fauji",
  "8": "About Prosperentia Investment Advisors LLP",
};

/* --------------------------------------------------------------------
   Types
-------------------------------------------------------------------- */
export interface ServiceItem {
  name: string;
  description: string;
}

export interface FeeItem {
  service: string;
  amount: string;
}

export interface QA {
  question: string;
  answer: string;
}

export interface CustomCTA {
  text: string;
  href: string;
  variant: 'primary' | 'secondary';
  icon?: React.ReactNode;
}
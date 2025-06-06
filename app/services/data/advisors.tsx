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

export interface SocialMedia {
  type: "linkedin" | "twitter" | "facebook" | "instagram" | "website";
  url: string;
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
  successStories?: string[];
  testimonials?: Testimonial[];
  socialMedia?: SocialMedia[];
  contactDetails: {
    phone?: string;
    email: string;
    website?: string;
    calendlyLink?: string;
  };
  sebiRegistrationNumber: string;
  verifiedBySpring: boolean;
  grievanceOfficer?: {
    name: string;
    email: string;
  };
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
    successStories: [
      "Helped a client retire 5 years early through strategic planning and investment management",
      "Created a tax‑efficient portfolio that saved clients an average of 3.5 % annually",
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
    socialMedia: [
      { type: "linkedin", url: "https://linkedin.com/in/rajivmehta" },
      { type: "website", url: "https://wealthwisdom.in" },
    ],
    contactDetails: {
      phone: "+91 9876543210",
      email: "rajiv@wealthwisdom.in",
      website: "https://wealthwisdom.in",
      calendlyLink: "https://calendly.com/rajivmehta",
    },
    sebiRegistrationNumber: "INA100013700",
    verifiedBySpring: true,
    grievanceOfficer: {
      name: "Suman Joshi",
      email: "grievance@wealthwisdom.in",
    },
  },
  {
    id: "2",
    firmName: "Candor Investing",
    advisorName: "Amey Kulkarnai",
    PrincipalAdvisor: "Amey Kulkarnai",
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
        description: "Comprehensive strategies for preserving and growing your wealth over time.. ",
      },
    ],
    successStories: [
      "Guided over 1,000 employees through ESOP diversification.",
      "Built an automated model portfolio that outperformed the Nifty by 4 % CAGR since 2019.",
    ],
    testimonials: [
      {
        text: "Priya helped me understand my company ESOPs and create a diversification strategy that made a huge difference to my portfolio.",
        author: "Karthik Raman",
        designation: "Software Engineer",
      },
    ],
    socialMedia: [
      { type: "twitter", url: "https://twitter.com/futureforwardfin" },
      { type: "website", url: "https://futureforwardfinancial.in" },
    ],
    contactDetails: {
      phone: "+91 9000001122",
      email: "priya@futureforwardfinancial.in",
      website: "https://futureforwardfinancial.in",
      calendlyLink: "https://calendly.com/priyasingh",
    },
    sebiRegistrationNumber: "INH000002345",
    verifiedBySpring: true,
    grievanceOfficer: {
      name: "Support Team",
      email: "support@futureforwardfinancial.in",
    },
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
    successStories: [
      "Helped 200+ NRI families navigate complex cross‑border tax implications",
      "Managed repatriation of assets worth over ₹500 crores for clients returning to India",
    ],
    testimonials: [
      {
        text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
        author: "Rohan Mehra",
        designation: "NRI, Singapore",
      },
    ],
    socialMedia: [
      { type: "linkedin", url: "https://linkedin.com/in/vikramkhanna" },
      { type: "website", url: "https://globalindianadvisors.com" },
    ],
    contactDetails: {
      phone: "+91 9867452310",
      email: "vikram@globalindianadvisors.com",
      website: "https://globalindianadvisors.com",
      calendlyLink: "https://calendly.com/vikramkhanna",
    },
    sebiRegistrationNumber: "INH000003456",
    verifiedBySpring: true,
    grievanceOfficer: {
      name: "Neha Kapoor",
      email: "grievance@globalindianadvisors.com",
    },
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
        name: "Comprehensive financial Planning",
        description: "Risk Profiling & Assessment, Goal-based Planning (Dream Home, Child's Education/Marriage, Retirement, World Tour, etc.), Review of Existing Investments & Insurance (Second Opinion), Tax Planning & Optimization, Insurance Planning (Adequate Coverage Assessment), Investment Planning (Aligned with Goals & Risk Profile), Retirement Planning",
      },
      {
        name: "Online Financial Advisior",
        description: "Serving clients across India and globally, with a significant client base from other cities..",
      },
      {
        name: "Implementation & Review",
        description: "We guide you through the implementation of your financial plan and provide regular reviews to track progress and make necessary adjustments..",
      },
      // {
      //   name: "Senior Citizen Investment Advisory",
      //   description: "Low‑risk instruments and allocation guidance focused on capital preservation and regular cash‑flow.",
      // },
    ],
    successStories: [
      "Built inflation‑beating retirement plans for 500+ families.",
      "Helped clients generate reliable pension income exceeding ₹2 crores annually.",
    ],
    testimonials: [
      {
        text: "Thanks to Ajay's methodical approach, we've secured our retirement and can help our children financially as well.",
        author: "Suresh & Lalita Murthy",
        designation: "Retired Government Officials",
      },
    ],
    socialMedia: [
      { type: "facebook", url: "https://facebook.com/retireright" },
      { type: "website", url: "https://retireright.in" },
    ],
    contactDetails: {
      phone: "+91 9844556677",
      email: "ajay@retireright.in",
      website: "https://retireright.in",
      calendlyLink: "https://calendly.com/ajayvaidya",
    },
    sebiRegistrationNumber: "INH000004567",
    verifiedBySpring: true,
    grievanceOfficer: {
      name: "Customer Care",
      email: "grievance@retireright.in",
    },
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
    successStories: [
      "Structured a multi‑generational trust saving ₹50 crores in estate taxes",
      "Guided 30+ founders through pre‑IPO wealth diversification",
    ],
    testimonials: [
      {
        text: "Nisha's expertise in structuring our family wealth has been invaluable, especially for business succession across generations.",
        author: "Raj Malhotra",
        designation: "Business Owner",
      },
    ],
    socialMedia: [
      { type: "linkedin", url: "https://linkedin.com/in/nishaagarwal" },
      { type: "website", url: "https://elitewealthmanagers.com" },
    ],
    contactDetails: {
      phone: "+91 9833221144",
      email: "nisha@elitewealthmanagers.com",
      website: "https://elitewealthmanagers.com",
      calendlyLink: "https://calendly.com/nishaagarwal",
    },
    sebiRegistrationNumber: "INH000005678",
    verifiedBySpring: true,
    grievanceOfficer: {
      name: "Rahul Mehta",
      email: "grievance@elitewealthmanagers.com",
    },
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
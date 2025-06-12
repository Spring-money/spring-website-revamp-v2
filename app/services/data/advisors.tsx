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
    firmName: "MyGuide2Wealth",
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
      `MyGuide2Wealth is your dedicated partner on the path to financial planning and Investment advisory . We are accredited as SEBI Registered Investment Advisor and Certified Financial Planner CM  who are here to guide you towards your financial aspirations. . We are independent , unbiased and fee only financial planners based in Noida carving the best investment strategies, equity research & financial planning for our client all over the globe`,
    services: [
      {
        name: "Holistic Financial Planning",
        description: "Crafting personalized strategies to achieve your financial goals and secure your future.",
      },
      {
        name: "Personalized Retirement Planning",
        description: "Secure your golden years with custom retirement strategies designed to ensure a comfortable and worry-free future.",
      },
      {
        name: "Strategic Tax Optimization",
        description: "Reduce your taxable income and increase your net worth through proactive tax strategies and compliance expertise.",
      },
      {
        name: "Children Education Planning",
        description: "Invest in your child's future. We design smart investment portfolios to fund their higher education dreams.",
      },
    ],
    successStories: [
      "Helped a client retire 5 years early through strategic planning and investment management",
      "Created a tax‑efficient portfolio that saved clients an average of 3.5 % annually",
    ],
    testimonials: [
      {
        text: "I was always afraid about entering stock market. MyGuide2Wealth assisted me in opening a demat account and helped me in investing in large cap stocks and index fund investing. His balanced approach in allocation of equity and debt is helping me in achieving my retirement and children education goals.",
        author: "Col S Singh",
        designation: "Armed Forces, India",
      },
      {
        text: "I'm very happy with MyGuide2Wealth's guidance! Robins has been patient in dealing with my financial plan and his expertise in equity and mutual fund has helped in solving my future financial goals. His understanding of my risk taking capability was pivotal in crafting the roadmap of financial independence journey.",
        author: "Ankur Pundir",
        designation: "Software professional (USA)",
      },
      {
        text: "I always though retirement planning to be the last of the priority . MyGuide22Wealth told me Children education and Retirement planning are critical and most important. The great thing about them is they will no mater what will be in touch every month to help you in buying valued stocks and mutual funds",
        author: "N Kumar",
        designation: "Young Professional, Gurgaon",
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
      calendlyLink: ".", // Temporarily disabled: "https://calendly.com/rajivmehta"
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
    advisorName: "Amey Kulkarni",
    PrincipalAdvisor: "Amey Kulkarni",
    reg: "SEBI RIA REG NO: INA000019479",
    photo: "/advisors/AmeyKulkarni2.svg",
    location: "Pune, Maharashtra",
    tagline: "Building your wealth with right investments",
    specializations: [
      "Stock Investments",
      "Mutual Funds",
      "Financial Planning",
    ],
    audience: ["Young Professionals", "Salaried"],
    about:
      "Candor Investing is a SEBI registered investment advisory firm founded by Amey Kulkarni. Amey is a full-time investor who brings significant experience to the table, having worked for over 9 years in corporate roles at companies like L&T, Jindal Steel, and Siemens Ltd.",
    description:
      `Candor Investing, founded by SEBI registered investment advisor Amey Kulkarni, operates on a core philosophy of "buying quality businesses at reasonable valuations and holding until the company executes." This approach is underpinned by strong values: Integrity, ensuring clients receive appropriate advice and that responsibilities are fulfilled; Focus, driven by the organization's mission to achieve strong CAGR returns; Excellence, aiming for extraordinary results beyond average market performance; and Simplicity, advocating for straightforward investment approaches over complex or exotic solutions. With 15 years of experience, Candor Investing serves a diverse client base including 15 NRI clients and a total of 200 clients, guided by Amey's extensive background in reputable corporations like L&T and Siemens. `,
    services: [
      {
        name: "Custom Equity Portfolio Advisory",
        description: "Invest in your future with a strategically designed equity portfolio tailored specifically to your financial goals and risk profile. We handpick high-quality stocks to optimize for strategic asset growth and deliver personalized returns.",
      },
      {
        name: "Curated Model Portfolios (via Smallcase)",
        description: "Gain access to our expertly curated model portfolios designed for diverse investment objectives, easily accessible and investable through the Smallcase platform. Benefit from our strategic allocation and regular rebalancing for optimal performance.",
      },
      {
        name: "Forensic Accounting Insights for Investors",
        description: "Equip yourself with crucial knowledge to identify red flags and protect your investments from potential accounting frauds and financial misrepresentation. Our program empowers investors with the skills for due diligence and fraud detection.",
      },
      {
        name: "Personalized Mutual Fund Advisory",
        description: "Achieve your financial milestones with a customized mutual fund portfolio meticulously designed to align with your unique risk appetite and investment objectives. Benefit from expert guidance and transparent support every step of the way.",
      },
    ],
    successStories: [
      "Guided over 1,000 employees through ESOP diversification.",
      "Built an automated model portfolio that outperformed the Nifty by 4 % CAGR since 2019.",
    ],
    testimonials: [
      {
        text: "Amey demonstrated a profound understanding of investment strategies possesses an outstanding depth of Market research skill. I couldn't be more satisfied with the experience.",
        author: "Kevin D'Souza",
        designation: "Branch Vertical Head, BCCL (The Times of India)",
      },
      {
        text: "Have been with Arney for four plus years. His calm approach to the market is striking. He rarely gets excited or anxious about the short term and focusses on the fundamentals.",
        author: "Pradeep Kumar Arora",
        designation: "Ex-Defence, India",
      },
      {
        text: "I started with some hesitation but Amey’s approach is all about focus, keeping yourself grounded and think long term. It has paid off for me.",
        author: "Varun Rajkumar",
        designation: "Cognizant, USA",
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
      calendlyLink: ".", // Temporarily disabled: "https://calendly.com/priyasingh"
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
    tagline: "Your search for Financial Independence ends here!",
    specializations: ["NRI Services", "Tax Planning", "Estate Planning"],
    audience: ["Doctors", "IT Professionals", "Business Owners",],
    about:
      "Our team of qualified financial planners, including CFP certificants, collaborates to craft holistic financial plans that deliver clarity and exceptional value to our clients.",
    description:
      `Founded by Nitin Sawant and a cadre of seasoned professionals, NS Wealth was born from a vision to establish an all-encompassing financial management system. We recognized the need for services that could be customized to grant individuals freedom from financial burdens, thereby offering a life free from monetary stress. By embracing our proprietary 'Dream > Decide > Do' approach, we empower you to Implement and execute your personalized plan with our guidance. Our commitment to you is unwavering: we provide measurable, executable strategies that propel you toward your goals. Our strength lies in delivering comprehensive financial plans, consolidated investment reports, and end-to-end solutions that bring unparalleled convenience to your financial journey.`,
    services: [
      {
        name: "1-on-1 Rapid Investment Consultation",
        description: "Need quick, expert insights on an urgent investment query or a specific portfolio decision? Our focused 1-on-1 session provides direct, actionable advice to help you navigate immediate investment opportunities or challenges with confidence. Get the answers you need, fast.",
      },
      {
        name: "Master Your Money with Budgeting 101",
        description: "Take control of your finances and build a solid foundation for your financial future. Our Budgeting 101 session guides you through practical steps to create an effective budget, track your spending, identify savings opportunities, and achieve your short-term and long-term financial goals. Start your journey to financial freedom today.",
      },
      {
        name: "Navigate Will & Probate Procedures",
        description: "Understanding the legal processes after a loved one's passing can be complex. Get expert answers on paperwork, legal requirements, and the steps involved in fulfilling a will's provisions to ensure a smooth estate settlement process.",
      },
      {
        name: "Comprehensive Financial Consultation for Your Future",
        description: "This in-depth consultation covers your goals, assets, liabilities, and current financial strategies. Receive personalized advice on wealth building, retirement planning, risk management, and long-term financial security to chart a clear path towards your aspirations.",
      },
    ],
    successStories: [
      "Helped 200+ NRI families navigate complex cross‑border tax implications",
      "Managed repatriation of assets worth over ₹500 crores for clients returning to India",
    ],
    testimonials: [
      {
        text: "Have engaged with NS Wealth for almost 9 years. It is a one stop place for all your financial goals and investments. The team helps you understand your financial goals. How much one needs to save. It has really helped me in being disciplined related to savings. The quarterly and yearly review is very helpful and the team is transparent about the investments.",
        author: "Pratibha Jadhav",
        //designation: "NRI, Singapore",
      },
      {
        text: "Since I came in contact with Nitin, my finance guru, I can not only work with twice the efficiency, but importantly, work freely without any stress. Today I am satisfied with getting even 2 rupees or 2 lakh rupees because whatever my expectations and goals I had set, I have already completed 70-80% of them via my finance.",  
        author: "Dr. Abhijeet",
        //designation: "Doctor",
      },
      {
        text: "Very very nice experience with Mr. Nitin Sawant.He is handling client very professionally. His guidance has help us for to improve our financial issue. Within small year we saved lot of money we got nice benefits from this guidance. He has very nice plan and idea. I will always recommend for your personal financial plan advice has to take from Mr. Nitin Sawant.",
        author: "Shree & Mayee",
        //designation: "NRI, Singapore",
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
      calendlyLink: "https://calendly.com/kiran-nswealth", 
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
    PrincipalAdvisor: "Priyadarshini Mulye",
    reg: "SEBI RIA REG NO:  INA000011796",
    photo: "/advisors/Priya4.svg",
    location: "Pune, Maharashtra",
    tagline: "Fee Only Financial Planning services in Simple, Ethical and Unbiased Manner.",
    specializations: ["Retirement Planning", "Financial Planning", "Insurance"],
    audience: ["Retired", "Salaried"],
    about:
      "Comprehensive financial planning will provide stability and ability to face contingencies moreover making your money work for you. Saving money and earning from your saving are equally important things.",
    description:
      "ARTHA FinPlan provides personalized, professional and unbiased services in the area of Personal Financial Planning and Investment Advisory. Our aim is to help our clients to achieve their realistic goals with holistic approach, educate them about personal finance management and be a reliable partner in adding value to their journey in personal finance. Being SEBI RIA, we are not involved in any distribution activity for any financial products and Insurance and are bound by ethics and compliance laid by SEBI from time to time.We work on Fee only basis. This makes us unbiased in our approach which leads to transparency in our services. If you are looking for financial advisor online india then your search ends here!",
    services: [
      {
        name: "Personalized Goal-Based Financial Planning",
        description: "Transform your dreams into achievable realities with our personalized goal-based financial planning. We partner with you to define and strategize for your most important short-term and long-term aspirations, whether it's securing your dream home, funding children's higher education or marriage, or planning that world tour",
      },
      {
        name: "Strategic Investment Planning",
        description: "Build a robust financial future with a strategic investment plan meticulously crafted to align with your unique financial goals, risk profile, and desired investment tenure. We design diversified portfolios aimed at maximizing your returns while ensuring your comfort and long-term wealth growth.",
      },
      {
        name: "Planning for your Retirement",
        description: "Secure your post-work life with our comprehensive retirement planning services. We help you strategize to build a comfortable and financially independent future, covering aspects like income generation, savings accumulation, and legacy planning to ensure peace of mind in your golden years.",
      },
      {
        name: "Personalized Risk Profiling",
        description: "Before any investment, it's crucial to understand your comfort level with market fluctuations. Our personalized risk profiling helps you accurately determine your risk tolerance and capacity to bear risk on investments, ensuring that your financial strategy is always aligned with your comfort level and investment temperament.",
      },
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
      calendlyLink: ".", // Temporarily disabled: "https://calendly.com/ajayvaidya"
    },
    sebiRegistrationNumber: "INA000011796",
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
    reg: "SEBI RIA REG NO: INA000018489",
    photo: "/advisors/RohanBorawake5.svg",
    location: "Pune, Maharashtra",
    tagline: "Sophisticated strategies for substantial wealth",
    specializations: ["Wealth Management", "Estate Planning", "Tax Planning"],
    audience: ["HNI", "Business Owners"],
    about:
      "As fiduciaries, we offer investment advice with full transparency and without any conflict of interest.",
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
      calendlyLink: ".", // Temporarily disabled: "https://calendly.com/nishaagarwal"
    },
    sebiRegistrationNumber: "INA000018489",
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
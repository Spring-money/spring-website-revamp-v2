import { Calendar, ChartBar } from "lucide-react";

export type Specialization =
  | "Retirement Planning"
  | "Tax Planning"
  | "NRI Services"
  | "Custom Smallcase"
  | "Estate Planning"
  | "Mutual Funds"
  | "Insurance"
  | "Stock Investments"
  | "Financial Planning"
  | "Wealth Management"
  | "Small Cap Investing"
  | "Mid Cap Investing"
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
    tagline:
      "Your partner on a journey Towards prosperity and Financial wellness",
    specializations: [
      "Financial Planning",
      "Retirement Planning",
      "Tax Planning",
    ],
    audience: ["Salaried", "HNI"],

    about:
      "At MyGuide2Wealth, we're not just financial advisors — we're your partners on a journey towards prosperity and financial wellness.",
    description: `MyGuide2Wealth is your dedicated partner on the path to financial planning and Investment advisory . We are accredited as SEBI Registered Investment Advisor and Certified Financial Planner CM  who are here to guide you towards your financial aspirations. . We are independent , unbiased and fee only financial planners based in Noida carving the best investment strategies, equity research & financial planning for our client all over the globe`,
    services: [
      {
        name: "Holistic Financial Planning",
        description:
          "Crafting personalized strategies to achieve your financial goals and secure your future.",
      },
      {
        name: "Personalized Retirement Planning",
        description:
          "Secure your golden years with custom retirement strategies designed to ensure a comfortable and worry-free future.",
      },
      {
        name: "Strategic Tax Optimization",
        description:
          "Reduce your taxable income and increase your net worth through proactive tax strategies and compliance expertise.",
      },
      {
        name: "Children Education Planning",
        description:
          "Invest in your child's future. We design smart investment portfolios to fund their higher education dreams.",
      },
    ],
    successStories: [
      "Helped a client retire 5 years early through strategic planning and investment management",
      "Created a tax‑efficient portfolio that saved clients an average of 3.5 % annually",
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
      "Small Cap Investing",
      "Mid Cap Investing",
    ],
    audience: ["Young Professionals", "Salaried"],
    about:
      "Candor Investing is a SEBI registered investment advisory firm founded by Amey Kulkarni. Amey is a full-time investor who brings significant corporate experience to the table, having worked for over 9 years in corporate roles at companies like L&T, Jindal Steel, and Siemens Ltd. before founding Candor Investing in 2017",
    description: `Candor Investing, founded by SEBI registered investment advisor Amey Kulkarni, operates on a core philosophy of "buying quality businesses at reasonable valuations and holding until the company executes." This approach is underpinned by strong values: Integrity, ensuring clients receive appropriate advice and that responsibilities are fulfilled; Focus, driven by the organization's mission to achieve strong CAGR returns; Excellence, aiming for extraordinary results beyond average market performance; and Simplicity, advocating for straightforward investment approaches over complex or exotic solutions. With 15 years of experience, Candor Investing serves a diverse client base including 15 NRI clients and a total of 200 clients, guided by Amey's extensive background in reputable corporations like L&T and Siemens. `,
    services: [
      {
        name: "Custom Equity Portfolio Advisory",
        description:
          "Invest in your future with a strategically designed equity portfolio tailored specifically to your financial goals and risk profile. We handpick high-quality stocks to optimize for strategic asset growth and deliver personalized returns.",
      },
      {
        name: "Curated Model Portfolios (via Smallcase)",
        description:
          "Gain access to our expertly curated model portfolios designed for diverse investment objectives, easily accessible and investable through the Smallcase platform. Benefit from our strategic allocation and regular rebalancing for optimal performance.",
      },
    ],
    successStories: [
      "Guided over 1,000 employees through ESOP diversification.",
      "Built an automated model portfolio that outperformed the Nifty by 4 % CAGR since 2019.",
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
    specializations: ["Retirement Planning", "Tax Planning", "Financial Planning"],
    audience: ["Business Owners"],
    about:
      "Our team of qualified financial planners, including CFP certificants, collaborates to craft holistic financial plans that deliver clarity and exceptional value to our clients.",
    description: `Founded by Nitin Sawant and a cadre of seasoned professionals, NS Wealth was born from a vision to establish an all-encompassing financial management system. We recognized the need for services that could be customized to grant individuals freedom from financial burdens, thereby offering a life free from monetary stress. By embracing our proprietary 'Dream > Decide > Do' approach, we empower you to Implement and execute your personalized plan with our guidance. Our commitment to you is unwavering: we provide measurable, executable strategies that propel you toward your goals. Our strength lies in delivering comprehensive financial plans, consolidated investment reports, and end-to-end solutions that bring unparalleled convenience to your financial journey.`,
    services: [
      {
        name: "1-on-1 Rapid Investment Consultation",
        description:
          "Need quick, expert insights on an urgent investment query or a specific portfolio decision? Our focused 1-on-1 session provides direct, actionable advice to help you navigate immediate investment opportunities or challenges with confidence. Get the answers you need, fast.",
      },
      {
        name: "Master Your Money with Budgeting 101",
        description:
          "Take control of your finances and build a solid foundation for your financial future. Our Budgeting 101 session guides you through practical steps to create an effective budget, track your spending, identify savings opportunities, and achieve your short-term and long-term financial goals. Start your journey to financial freedom today.",
      },
      {
        name: "Navigate Will & Probate Procedures",
        description:
          "Understanding the legal processes after a loved one's passing can be complex. Get expert answers on paperwork, legal requirements, and the steps involved in fulfilling a will's provisions to ensure a smooth estate settlement process.",
      },
      {
        name: "Comprehensive Financial Consultation for Your Future",
        description:
          "This in-depth consultation covers your goals, assets, liabilities, and current financial strategies. Receive personalized advice on wealth building, retirement planning, risk management, and long-term financial security to chart a clear path towards your aspirations.",
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
    tagline:
      "Fee Only Financial Planning services in Simple, Ethical and Unbiased Manner.",
    specializations: ["Retirement Planning", "Financial Planning", "Insurance"],
    audience: ["Retired", "Salaried"],
    about:
      "Comprehensive financial planning will provide stability and ability to face contingencies moreover making your money work for you. Saving money and earning from your saving are equally important things.",
    description:
      "ARTHA FinPlan provides personalized, professional and unbiased services in the area of Personal Financial Planning and Investment Advisory. Our aim is to help our clients to achieve their realistic goals with holistic approach, educate them about personal finance management and be a reliable partner in adding value to their journey in personal finance. Being SEBI RIA, we are not involved in any distribution activity for any financial products and Insurance and are bound by ethics and compliance laid by SEBI from time to time.We work on Fee only basis. This makes us unbiased in our approach which leads to transparency in our services. If you are looking for financial advisor online india then your search ends here!",
    services: [
      {
        name: "Comprehensive Financial Planning",
        description:
          "Risk Profiling & Assessment, Goal-based Planning (Dream Home, Child's Education/Marriage, Retirement, World Tour, etc.), Review of Existing Investments & Insurance (Second Opinion), Tax Planning & Optimization, Insurance Planning (Adequate Coverage Assessment), Investment Planning (Aligned with Goals & Risk Profile), Retirement Planning",
      },
      {
        name: "Online Financial Advisory",
        description:
          "Serving clients across India and globally, with a significant client base from other cities.",
      },
      {
        name: "Implementation & Review",
        description:
          "We guide you through the implementation of your financial plan and provide regular reviews to track progress and make necessary adjustments.",
      },
      {
        name: "Retirement Planning",
        description:
          "Specialized retirement planning services including pension optimization, income planning, and wealth preservation strategies for retirees.",
      },
    ],
    successStories: [
      "Built inflation‑beating retirement plans for 500+ families.",
      "Helped clients generate reliable pension income exceeding ₹2 crores annually.",
    ],
    testimonials: [
      // {
      //   text: "Thanks to Ajay's methodical approach, we've secured our retirement and can help our children financially as well.",
      //   author: "Suresh & Lalita Murthy",
      //   designation: "Retired Government Officials",
      // },
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
    specializations: [
      "Stock Investments",
      "Custom Smallcase",
      "Financial Planning",
    ],  
    audience: ["HNI", "Business Owners"],
    about:
      "As fiduciaries, we offer investment advice with full transparency and without any conflict of interest.",
    description: `FinSharpe is a SEBI Registered Investment Advisor dedicated to providing comprehensive, personalized, and ethical financial planning and investment advisory services.\n\nFounded by Shuchi Mundra, a CERTIFIED FINANCIAL PLANNER (CFP®) and MBA (Finance), our mission is to empower individuals and families to achieve their financial aspirations through strategic guidance and unbiased advice.\n\nWe believe in fostering long‑term relationships built on trust, transparency, and education. As a fiduciary, FinSharpe is committed to always acting in your best interest, ensuring our recommendations are solely focused on your financial well‑being, free from product sales commissions.`,
    services: [
      {
        name: "Comprehensive Financial Planning",
        description:
          "Professional Comprehensive Financial Planning services tailored to your needs.",
      },
      {
        name: "Investment Advisiory Services",
        description:
          "Expert investment advice tailored to your financial goals and risk profile.",
      },
      {
        name: "Financial Wellness Program",
        description:
          "Tailored solutions for individuals and families seeking financial clarity and growth.",
      },
      {
        name: "Online financial Advisor",
        description:
          "Serving clients across India and globally, providing convenient access to expert advice.",
      },
    ],
    successStories: [
      "Structured a multi‑generational trust saving ₹50 crores in estate taxes",
      "Guided 30+ founders through pre‑IPO wealth diversification",
    ],
    testimonials: [
      // {
      //   text: "Nisha's expertise in structuring our family wealth has been invaluable, especially for business succession across generations.",
      //   author: "Raj Malhotra",
      //   designation: "Business Owner",
      // },
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
  {
    id: "6",
    firmName: "Bachhat Money",
    advisorName: "Vishal Shah",
    PrincipalAdvisor: "Vishal Bharat Shah",
    reg: "SEBI RIA REG NO: INA000019220",
    photo: "/advisors/vishal-shah.svg",
    location: "Pune, Maharashtra",
    tagline: "Empowering your financial journey with unbiased, simplified, and transparent advice.",
    specializations: [ "Financial Planning", "Retirement Planning"],
    audience: ["NRIs", "HNI", "Young Professionals"],
    about:
      "Bachhat is built on the pillars of transparency, unbiased advice and making personal finance easy. We ensure our solutions are uncomplicated and provide personalized strategies for your financial well-being.",
    description:
      "Founded by CA Vishal Bharat Shah, Bachhat Money aims to empower clients in effectively managing their personal finances. Vishal is a SEBI Registered Investment Adviser with over two decades of post-qualification experience across diverse fields including Finance, Treasury, Mergers & Acquisitions, and Strategy. His passion for personal finance led him to start writing about the subject in 2010, forming the bedrock of Bachhat Money's research-backed and conflict-free advisory approach.",
    services: [
      {
        name: "Holistic Financial Planning",
        description: "This comprehensive plan includes net-worth assessment, retirement planning, risk profiling, insurance adequacy, and goal-based investing for your complete financial well-being.",
      },
      {
        name: "On-going Financial Health Check-up",
        description: "Following holistic financial planning, Bachhat Money provides ongoing reviews to ascertain investment performance against goals and offers suggestions for portfolio re-balancing.",
      },
      {
        name: "Financial Planning Sessions / Training / Seminars",
        description: "Bachhat Money conducts customized training and seminars on personal finance for Corporates, Educational Institutions, and Social Groups.",
      },
      {
        name: "Ad hoc consultation for key financial decisions",
        description: "This service provides targeted advice for specific financial queries or critical financial decisions.",
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
      calendlyLink: "https://calendly.com/enquiry-bachhat", // Temporarily disabled: "https://calendly.com/vikramkhanna"
    },
    sebiRegistrationNumber: "INA000019220",
    verifiedBySpring: true,
    grievanceOfficer: {
      name: "Neha Kapoor",
      email: "grievance@globalindianadvisors.com",
    },
  },
  // {
  //   id: "7",
  //   firmName: "Hum Fauji",
  //   advisorName: "Name",
  //   PrincipalAdvisor: "Name",
  //   reg: "SEBI RIA REG NO: INA000009551",
  //   photo: "/advisors/NitinSawant3.svg",
  //   location: "City, State",
  //   tagline: "Specializing in NRI financial planning and investments",
  //   specializations: ["NRI Services", "Tax Planning", "Estate Planning"],
  //   audience: ["NRIs", "HNI"],
  //   about:
  //     "Global Indian Advisors focuses on the unique financial challenges faced by Non‑Resident Indians, including cross‑border taxation and asset repatriation.",
  //   description:
  //     `At NS Wealth, we are committed to providing personalized and ethical financial guidance. We help you build robust strategies, understand your investments, and achieve your financial milestones with clarity and confidence. Our focus is on your long‑term prosperity.`,
  //   services: [
  //     {
  //       name: "Financial Planning",
  //       description: "Holistic plans covering income, spending, goals, and risk tailored to NRI realities.",
  //     },
  //     {
  //       name: "Retirement Strategy",
  //       description: "Blueprints to accumulate and repatriate retirement wealth across geographies, tax‑efficiently.",
  //     },
  //     {
  //       name: "Tax Optimization",
  //       description: "Minimizing double‑tax through DTAA awareness and strategic use of foreign income exclusions.",
  //     },
  //     {
  //       name: "Tax Advisory",
  //       description: "On‑call expertise for specific queries like property sale, remittances, or inheritance taxation.",
  //     },
  //   ],
  //   successStories: [
  //     "Helped 200+ NRI families navigate complex cross‑border tax implications",
  //     "Managed repatriation of assets worth over ₹500 crores for clients returning to India",
  //   ],
  //   testimonials: [
  //     {
  //       text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
  //       author: "Rohan Mehra",
  //       designation: "NRI, Singapore",
  //     },
  //   ],
  //   socialMedia: [
  //     { type: "linkedin", url: "https://linkedin.com/in/vikramkhanna" },
  //     { type: "website", url: "https://globalindianadvisors.com" },
  //   ],
  //   contactDetails: {
  //     phone: "+91 9867452310",
  //     email: "vikram@globalindianadvisors.com",
  //     website: "https://globalindianadvisors.com",
  //     calendlyLink: ".", // Temporarily disabled: "https://calendly.com/vikramkhanna"
  //   },
  //   sebiRegistrationNumber: "INH000003456",
  //   verifiedBySpring: true,
  //   grievanceOfficer: {
  //     name: "Neha Kapoor",
  //     email: "grievance@globalindianadvisors.com",
  //   },
  // },
  // {
  //   id: "8",
  //   firmName: "Prosperentia Investment Advisors LLP",
  //   advisorName: "Name",
  //   PrincipalAdvisor: "Name",
  //   reg: "SEBI RIA REG NO: INA000018957",
  //   photo: "/advisors/NitinSawant3.svg",
  //   location: "City, State",
  //   tagline: "Specializing in NRI financial planning and investments",
  //   specializations: ["NRI Services", "Tax Planning", "Estate Planning"],
  //   audience: ["NRIs", "HNI"],
  //   about:
  //     "Global Indian Advisors focuses on the unique financial challenges faced by Non‑Resident Indians, including cross‑border taxation and asset repatriation.",
  //   description:
  //     `At NS Wealth, we are committed to providing personalized and ethical financial guidance. We help you build robust strategies, understand your investments, and achieve your financial milestones with clarity and confidence. Our focus is on your long‑term prosperity.`,
  //   services: [
  //     {
  //       name: "Financial Planning",
  //       description: "Holistic plans covering income, spending, goals, and risk tailored to NRI realities.",
  //     },
  //     {
  //       name: "Retirement Strategy",
  //       description: "Blueprints to accumulate and repatriate retirement wealth across geographies, tax‑efficiently.",
  //     },
  //     {
  //       name: "Tax Optimization",
  //       description: "Minimizing double‑tax through DTAA awareness and strategic use of foreign income exclusions.",
  //     },
  //     {
  //       name: "Tax Advisory",
  //       description: "On‑call expertise for specific queries like property sale, remittances, or inheritance taxation.",
  //     },
  //   ],
  //   successStories: [
  //     "Helped 200+ NRI families navigate complex cross‑border tax implications",
  //     "Managed repatriation of assets worth over ₹500 crores for clients returning to India",
  //   ],
  //   testimonials: [
  //     {
  //       text: "Vikram's expertise in NRI taxation saved us from several costly mistakes while investing in India from abroad.",
  //       author: "Rohan Mehra",
  //       designation: "NRI, Singapore",
  //     },
  //   ],
  //   socialMedia: [
  //     { type: "linkedin", url: "https://linkedin.com/in/vikramkhanna" },
  //     { type: "website", url: "https://globalindianadvisors.com" },
  //   ],
  //   contactDetails: {
  //     phone: "+91 9867452310",
  //     email: "vikram@globalindianadvisors.com",
  //     website: "https://globalindianadvisors.com",
  //     calendlyLink: ".", // Temporarily disabled: "https://calendly.com/vikramkhanna"
  //   },
  //   sebiRegistrationNumber: "INH000003456",
  //   verifiedBySpring: true,
  //   grievanceOfficer: {
  //     name: "Neha Kapoor",
  //     email: "grievance@globalindianadvisors.com",
  //   },
  // },

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
      href: "https://wa.me/+919811031535",
      variant: "primary",
      icon: <Calendar size={16} className="mr-2" />,
    },
  ],
  "2": [
    {
      text: "View Smallcase",
      href: "https://candorinvesting.smallcase.com/",
      variant: "primary",
      icon: <ChartBar size={16} className="mr-2" />,
    },
    // {
    //   text: "View Smallcase",
    //   href: "tel:+919000001122",
    //   variant: 'secondary',
    //   icon: <ChartBar size={16} className="mr-2" />
    // },
  ],
  "3": [
    {
      text: "Schedule Meeting",
      href: "https://calendly.com/kiran-nswealth",
      variant: "primary",
      icon: <Calendar size={16} className="mr-2" />,
    },
  ],
  "4": [
    {
      text: "Schedule Meeting",
      href: "https://wa.me/+919769935011",
      variant: "primary",
      icon: <Calendar size={16} className="mr-2" />,
    },
  ],
  "5": [
    {
      text: "View Smallcase",
      href: "https://www.smallcase.com/manager/finsharpe/smallcases",
      variant: "primary",
      icon: <ChartBar size={16} className="mr-2" />,
    },
  ],
  "6": [
    {
      text: "Schedule Meeting",
      href: "https://calendly.com/enquiry-bachhat",
      variant: "primary",
      icon: <ChartBar size={16} className="mr-2" />,
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
    { service: "Financial Planning", amount: "₹15,000 – ₹25,000" },
    { service: "Investment Management", amount: "0.75% – 1.25% of AUM" },
  ],
  "2": [
    { service: "Investment Advisory", amount: "₹20,000 – ₹40,000" },
    { service: "Financial Goal Planning", amount: "₹25,000 – ₹45,000" },
  ],
  "3": [
    { service: "Financial Checkup", amount: "Free" },
    { service: "Financial Consultation", amount: "₹15,000 – ₹25,000" },
  ],
  "4": [{ service: "Comprehensive Planning", amount: "₹25,000 – ₹45,000" }],
  "5": [
    { service: "Wealth Management", amount: "1.5% – 2% of AUM" },
    { service: "Estate Planning", amount: "₹40,000 – ₹60,000" },
    { service: "Tax Planning", amount: "₹30,000 – ₹50,000" },
    { service: "Financial Wellness Program", amount: "₹35,000 – ₹55,000" }
  ],
  "6": [
    { service: "Financial Health Check-up", amount: "₹10,000 – ₹12,000" },
    { service: "Holistic Financial Planning", amount: "₹18,000 – ₹22,000" },
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
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
  ],
  "2": [
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
    // { question: "Question?", answer: "Answer" },
  ],
  "3": [
    { question: "What is comprehensive financial planning, and why do I need it?", answer: "Comprehensive financial planning is a holistic approach to managing your finances. It covers everything from budgeting, saving, and investments to retirement planning, tax strategies, and estate planning. At NS Wealth, we tailor financial plans to your specific needs, helping you achieve your short-term and long-term financial goals. Whether you're a busy professional or nearing retirement, a well-structured plan provides clarity and peace of mind." },
    { question: "How is NS Wealth different from other financial advisors?", answer: "NS Wealth is a SEBI-registered investment advisor (RIA), which means we are legally obligated to act in your best interest. Unlike many advisors who earn commissions by selling financial products, we operate on a fee-based model. This ensures that our advice is unbiased and focused solely on helping you achieve your financial goals without any hidden agendas." },
    { question: "Who can benefit from NS Wealth's services?", answer: "Our services are tailored for busy professionals like doctors, IT professionals, business owners, and individuals who want expert help in managing their finances. Whether you're looking for investment advice, retirement planning, or managing your taxes efficiently, NS Wealth provides personalized solutions to fit your unique needs." },
    { question: "What does it mean to be a SEBI-registered investment advisor (RIA)?", answer: "Being SEBI-registered means that NS Wealth adheres to strict regulatory standards set by the Securities and Exchange Board of India (SEBI). As an RIA, we are required to act in a fiduciary capacity—putting your interests above our own. This ensures transparency, ethical practices, and unbiased advice tailored to your financial well-being." },
    { question: "How often will my financial plan be reviewed?", answer: "We conduct regular reviews of your financial plan—typically once every quarter or as needed based on changes in your life circumstances or market conditions. These reviews ensure that your plan remains aligned with your goals and allows us to make any necessary adjustments for optimal performance." },
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
  "1": "We specialize in guiding salaried professionals towards smart financial growth and HNIs with advanced wealth management and strategic investments.",
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
  variant: "primary" | "secondary";
  icon?: React.ReactNode;
}

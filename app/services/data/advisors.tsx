/* ------------------------------------------------------------------
   Spring Money – Unified Advisor Model
   Last updated: 2025-07-01
   -------------------------------------------------------------- */

   import { Calendar, ChartBar } from "lucide-react";
   import type { ReactNode } from "react";
   
   /* ------------------------------------------------------------------
      Enums & Basic Types
   ------------------------------------------------------------------ */
   
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
   
   export interface CustomCTA {
     text: string;
     href: string;
     variant: "primary" | "secondary";
     icon?: ReactNode;
   }
   
   export interface Service {
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
   
   /* ------------------------------------------------------------------
      Main Advisor Interface
   ------------------------------------------------------------------ */
   export interface Advisor {
     id: string;
     firmName: string;
     advisorName: string;
     principalAdvisor: string;
     reg: string;
     photo: string;
     location: Location;
     tagline: string;
   
     specializations: Specialization[];
     audience: AudienceType[];
   
     about: string;
     description: string;
   
     services: Service[];
     feeStructure: FeeItem[];
     successStories?: string[];
   
     testimonials?: Testimonial[];
     videoUrl?: string;
   
    
     sebiRegistrationNumber: string;
     verifiedBySpring: boolean;
     grievanceOfficer?: {
       name: string;
       email: string;
     };
   
     cta: CustomCTA[];
     faqs?: QA[];
     clientTypePills?: string[];
     idealClientDescription?: string;
   }
   
   /* ------------------------------------------------------------------
      Advisors Data
   ------------------------------------------------------------------ */
   export const advisors: Advisor[] = [
     /* ----------------------- Advisor 1 ----------------------- */
     {
       id: "1",
       firmName: "MyGuide2Wealth",
       advisorName: "Robins Joseph",
       principalAdvisor: "Robins Joseph",
       reg: "SEBI RIA REG NO: INA100013700",
       photo: "/advisors/RobinsJoseph1.svg",
       location: "Noida, Uttar Pardesh",
       tagline: "Your partner on a journey Towards prosperity and Financial wellness",
   
       specializations: ["Financial Planning", "Retirement Planning", "Tax Planning"],
       audience: ["Salaried", "HNI"],
   
       about:
         "At MyGuide2Wealth, we're your partners on a journey towards prosperity and financial wellness.",
       description: `MyGuide2Wealth is accredited as a SEBI Registered Investment Advisor and Certified Financial Planner CM. We are independent, unbiased and fee-only financial planners based in Noida carving the best investment strategies, equity research & financial planning for our clients all over the globe.`,
   
       services: [
         {
           name: "Holistic Financial Planning",
           description:
             "Crafting personalized strategies to achieve your financial goals and secure your future.",
         },
         {
           name: "Personalized Retirement Planning",
           description:
             "Secure your golden years with custom retirement strategies designed for a worry-free future.",
         },
         {
           name: "Strategic Tax Optimization",
           description:
             "Reduce your taxable income and increase your net worth through proactive strategies.",
         },
         {
           name: "Children Education Planning",
           description:
             "Smart investment portfolios to fund your child's higher-education dreams.",
         },
       ],
   
       feeStructure: [
         { service: "Financial Planning", amount: "₹15,000 – ₹25,000" },
         { service: "Investment Management", amount: "0.75% – 1.25% of AUM" },
       ],
   
      
   
       testimonials: [
         {
           text: "MyGuide2Wealth's balanced approach in equity & debt is helping me reach my retirement and children's education goals.",
           author: "Col S Singh",
           designation: "Armed Forces, India",
         },
         {
           text: "Robins's patience and expertise in mutual funds solved my future goals and matched my risk profile perfectly.",
           author: "Ankur Pundir",
           designation: "Software Professional, USA",
         },
         {
           text: "They stay in touch every month to guide us in buying value stocks and mutual funds.",
           author: "N Kumar",
           designation: "Young Professional, Gurgaon",
         },
       ],
   
       videoUrl: "https://www.youtube.com/embed/JWcG7FCQu1w",
   
     
   
       sebiRegistrationNumber: "INA100013700",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Suman Joshi", email: "grievance@wealthwisdom.in" },
   
       cta: [
         {
           text: "Schedule Meeting",
           href: "https://wa.me/+919811031535",
           variant: "primary",
           icon: <Calendar size={16} className="mr-2" />,
         },
       ],
   
       clientTypePills: [
         "Salaried Professionals",
         "Young Families",
         "Tax Planning",
         "Investment Planning",
       ],
       idealClientDescription:
         "Guiding salaried professionals and HNIs towards strategic financial growth.",
     },
   
     /* ----------------------- Advisor 2 ----------------------- */
     {
       id: "2",
       firmName: "Candor Investing",
       advisorName: "Amey Kulkarni",
       principalAdvisor: "Amey Kulkarni",
       reg: "SEBI RIA REG NO: INA000019479",
       photo: "/advisors/AmeyKulkarni2.svg",
       location: "Pune, Maharashtra",
       tagline: "Building your wealth with the right investments",
   
       specializations: ["Stock Investments", "Small Cap Investing", "Mid Cap Investing"],
       audience: ["Young Professionals", "Salaried"],
   
       about:
         "Candor Investing is a SEBI-registered advisory founded by ex-corporate professional Amey Kulkarni.",
       description: `Operating on the philosophy of buying quality businesses at reasonable valuations and holding until execution, Candor Investing has served 200+ clients (including 15 NRIs) over 15 years.`,
   
       services: [
         {
           name: "Custom Equity Portfolio Advisory",
           description:
             "Strategically designed equity portfolios aligned with your risk profile.",
         },
         {
           name: "Curated Model Portfolios (Smallcase)",
           description:
             "Expert-built model portfolios accessible via the Smallcase platform.",
         },
       ],
   
       feeStructure: [
         { service: "Investment Advisory", amount: "₹20,000 – ₹40,000" },
         { service: "Financial Goal Planning", amount: "₹25,000 – ₹45,000" },
       ],
   
    
       testimonials: [
         {
           text: "Amey's market-research depth is outstanding; I'm thoroughly satisfied.",
           author: "Kevin D'Souza",
           designation: "Branch Vertical Head, BCCL",
         },
         {
           text: "Four+ years with Amey – his calm, fundamentals-first approach stands out.",
           author: "Pradeep Kumar Arora",
           designation: "Ex-Defence",
         },
         {
           text: "His focus on long-term thinking has paid off for me.",
           author: "Varun Rajkumar",
           designation: "Cognizant USA",
         },
       ],
   
       videoUrl: "https://www.youtube.com/embed/mUIogYox-8k",
   
    
   
       sebiRegistrationNumber: "INH000002345",
       verifiedBySpring: true,
       grievanceOfficer: {
         name: "Support Team",
         email: "support@futureforwardfinancial.in",
       },
   
       cta: [
         {
           text: "View Smallcase",
           href: "https://candorinvesting.smallcase.com/",
           variant: "primary",
           icon: <ChartBar size={16} className="mr-2" />,
         },
       ],
   
       clientTypePills: ["Business Owners", "Entrepreneurs"],
       idealClientDescription:
         "First-generation rich looking for a trusted advisor to manage their wealth and investments.",
     },
   
     /* ----------------------- Advisor 3 ----------------------- */
     {
       id: "3",
       firmName: "NS Wealth",
       advisorName: "Nitin Sawant",
       principalAdvisor: "Nitin Sawant",
       reg: "SEBI RIA REG NO: INA000009551",
       photo: "/advisors/NitinSawant3.svg",
       location: "Pune, Maharashtra",
       tagline: "Your search for Financial Independence ends here!",
   
       specializations: ["Retirement Planning", "Tax Planning", "Financial Planning"],
       audience: ["Business Owners"],
   
       about:
         "Our team of qualified financial planners collaborates to craft holistic financial plans that deliver clarity and exceptional value to our clients.",
       description: `Founded by Nitin Sawant and a cadre of seasoned professionals, NS Wealth was born from a vision to establish an all-encompassing financial management system. By embracing our proprietary 'Dream > Decide > Do' approach, we empower you to implement and execute your personalized plan with our guidance.`,
   
       services: [
         {
           name: "1-on-1 Rapid Investment Consultation",
           description:
             "Need quick, expert insights on an urgent investment query? Get direct, actionable advice in a focused session.",
         },
         {
           name: "Master Your Money with Budgeting 101",
           description:
             "Build a solid budgeting foundation, track spending, identify savings, and achieve your goals.",
         },
         {
           name: "Navigate Will & Probate Procedures",
           description:
             "Expert answers on paperwork, legal requirements, and steps to ensure a smooth estate-settlement process.",
         },
         {
           name: "Comprehensive Financial Consultation for Your Future",
           description:
             "Receive personalized advice on wealth building, retirement planning, and risk management to chart a clear path forward.",
         },
       ],
   
       feeStructure: [
         { service: "Financial Check-up", amount: "Free" },
         { service: "Financial Consultation", amount: "₹15,000 – ₹25,000" },
       ],
   
     
   
       testimonials: [
         {
           text: "One-stop place for all your financial goals. Transparent reviews every quarter.",
           author: "Pratibha Jadhav",
         },
         {
           text: "Since I met Nitin, I work twice as efficiently and stress-free.",
           author: "Dr. Abhijeet",
         },
         {
           text: "Within a short time we saved a lot of money and got nice benefits from his guidance.",
           author: "Shree & Mayee",
         },
       ],
   
       videoUrl: "https://www.youtube.com/embed/3HcIGQdyvjo",
   
    
   
       sebiRegistrationNumber: "INH000003456",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Neha Kapoor", email: "grievance@globalindianadvisors.com" },
   
       cta: [
         {
           text: "Schedule Meeting",
           href: "https://calendly.com/kiran-nswealth",
           variant: "primary",
           icon: <Calendar size={16} className="mr-2" />,
         },
       ],
   
       faqs: [
         {
           question: "What is comprehensive financial planning, and why do I need it?",
           answer:
             "It’s a holistic approach covering budgeting, saving, investments, retirement, tax, and estate planning—tailored to your goals.",
         },
         {
           question: "How is NS Wealth different from other advisors?",
           answer:
             "We are fee-only and legally bound to act in your best interest as a SEBI-registered RIA.",
         },
         {
           question: "Who can benefit from NS Wealth’s services?",
           answer: "Busy professionals like doctors, IT professionals, and business owners.",
         },
         {
           question: "What does being a SEBI-registered RIA mean?",
           answer:
             "We follow SEBI regulations and act as fiduciaries, ensuring transparency and unbiased advice.",
         },
         {
           question: "How often will my financial plan be reviewed?",
           answer: "Typically every quarter or whenever your circumstances change.",
         },
       ],
   
       clientTypePills: [
         "NRIs",
         "Global Investors",
         "Cross-border Planning",
         "International Tax",
       ],
       idealClientDescription:
         "I specialize in serving NRIs and global investors, providing expert guidance on cross-border investments, tax planning, and wealth management.",
     },
   
     /* ----------------------- Advisor 4 ----------------------- */
     {
       id: "4",
       firmName: "Artha Fin Plan",
       advisorName: "Priyadarshini Mulye",
       principalAdvisor: "Priyadarshini Mulye",
       reg: "SEBI RIA REG NO: INA000011796",
       photo: "/advisors/Priya4.svg",
       location: "Pune, Maharashtra",
       tagline: "Fee-Only Financial Planning in a Simple, Ethical & Unbiased Manner.",
   
       specializations: ["Retirement Planning", "Financial Planning", "Insurance"],
       audience: ["Retired", "Salaried"],
   
       about:
         "Comprehensive financial planning provides stability and the ability to face contingencies while making your money work for you.",
       description: `ARTHA FinPlan offers personalized, professional, and unbiased services in personal financial planning and investment advisory. As a fee-only SEBI RIA, we focus solely on your best interests, ensuring transparency and conflict-free advice.`,
   
       services: [
         {
           name: "Comprehensive Financial Planning",
           description:
             "Risk profiling, goal-based planning, tax optimization, insurance adequacy, investment & retirement planning.",
         },
         {
           name: "Online Financial Advisory",
           description:
             "Serving clients across India and globally through virtual consultations.",
         },
         {
           name: "Implementation & Review",
           description:
             "Guidance through implementation and regular reviews to track progress and adjust as needed.",
         },
         {
           name: "Retirement Planning",
           description:
             "Specialized strategies including pension optimization, income planning, and wealth preservation.",
         },
       ],
   
       feeStructure: [
         { service: "Comprehensive Planning", amount: "₹25,000 – ₹45,000" },
       ],
   

   
       testimonials: [],
   
       videoUrl: "https://www.youtube.com/embed/18F9gdXnKnw",
   
   
       sebiRegistrationNumber: "INA000011796",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Customer Care", email: "grievance@retireright.in" },
   
       cta: [
         {
           text: "Schedule Meeting",
           href: "https://wa.me/+919769935011",
           variant: "primary",
           icon: <Calendar size={16} className="mr-2" />,
         },
       ],
   
       clientTypePills: [
         "Retirees",
         "Pre-retirees",
         "Estate Planning",
         "Income Planning",
       ],
       idealClientDescription:
         "Helping retirees and pre-retirees create sustainable income streams and preserve wealth through estate planning.",
     },
   
     /* ----------------------- Advisor 5 ----------------------- */
     {
       id: "5",
       firmName: "Finsharpe",
       advisorName: "Rohan Borawake",
       principalAdvisor: "Rohan Borawake",
       reg: "SEBI RIA REG NO: INA000018489",
       photo: "/advisors/RohanBorawake5.svg",
       location: "Pune, Maharashtra",
       tagline: "Sophisticated strategies for substantial wealth",
   
       specializations: ["Stock Investments", "Custom Smallcase", "Financial Planning"],
       audience: ["HNI", "Business Owners"],
   
       about:
         "As fiduciaries, we offer investment advice with full transparency and without any conflict of interest.",
       description: "FinSharpe came into existence to enable investors to reduce psychological biases from investment decisions by providing data driven insights. As fiduciaries, we offer investment advice with full transparency and without any conflict of interest.",
   
       services: [
         {
           name: "Wealth Management",
           description: "Managed portfolios for HNIs and families seeking sophisticated strategies and comprehensive wealth-management solutions.",
         },
         {
           name: "Investment Advisory Services",
           description: "Expert investment advice aligned with your goals.",
         },
       ],
   
       feeStructure: [
         { service: "Financial Planning", amount: "₹15,000 – ₹25,000" },
         { service: "Investment Management", amount: "0.75% – 1.25% of AUM" },
       ],
   
       successStories: [
         "Structured a multi-generational trust saving ₹50 crores in estate taxes",
         "Guided 30+ founders through pre-IPO wealth diversification",
       ],
   
       testimonials: [],
   
       videoUrl: "https://www.youtube.com/embed/3UJcfUdvF4U",
   
      
   
       sebiRegistrationNumber: "INA000018489",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Rahul Mehta", email: "grievance@elitewealthmanagers.com" },
   
       cta: [
         {
           text: "View Smallcase",
           href: "https://www.smallcase.com/manager/finsharpe/smallcases",
           variant: "primary",
           icon: <ChartBar size={16} className="mr-2" />,
         },
       ],
       faqs: [
        {
          question: "Do I have to open a broking account with Finsharpe?",
          answer:
            "No. You can execute our advice on any broking account of your choice. However, we recommend you assign a fresh broking account for easier segregation and tracking.",
        },
        {
          question: "Do I have to transfer funds to your account to start?",
          answer:
            "No. The investments will be held in your broking account. We would be guiding you on the exact transactions to be done and the subsequent changes.",
        },
        {
          question: "I have some on-going SIPs in Mutual Funds. Could you advise on what to do?",
          answer: "Yes. We will provide a one-time review of your portfolio. If you would like to continue with Mutual Funds you can invest in our Mutual Fund baskets. Else you could select any of our Direct Stocks strategies as per your risk profile.",
        },
      ],
   
       clientTypePills: ["High Net Worth", "Family Offices"],
       idealClientDescription:
         "We work with HNIs and families seeking sophisticated strategies and comprehensive wealth-management solutions.",
     },
   
     /* ----------------------- Advisor 6 ----------------------- */
     {
       id: "6",
       firmName: "Bachhat Money",
       advisorName: "Vishal Shah",
       principalAdvisor: "Vishal Bharat Shah",
       reg: "SEBI RIA REG NO: INA000019220",
       photo: "/advisors/vishal-shah.svg",
       location: "Pune, Maharashtra",
       tagline:
         "Empowering your financial journey with unbiased, simplified, and transparent advice.",
   
       specializations: ["Estate Planning", "Retirement Planning"],
       audience: ["NRIs", "HNI", "Young Professionals"],
   
       about:
         "Bachhat is built on the pillars of transparency and unbiased advice, providing personalized strategies for financial well-being.",
       description: `Founded by CA Vishal Bharat Shah, Bachhat Money empowers clients through research-backed and conflict-free advisory. Vishal brings over two decades of experience across Finance, Treasury, M&A, and Strategy.`,
   
       services: [
         {
           name: "Holistic Financial Planning",
           description:
             "Net-worth assessment, retirement planning, risk profiling, insurance adequacy, and goal-based investing.",
         },
         {
           name: "On-going Financial Health Check-up",
           description:
             "Regular reviews post-planning to ascertain performance and suggest rebalancing.",
         },
         {
           name: "Financial Planning Sessions / Training / Seminars",
           description:
             "Customized sessions on personal finance for corporates, institutions, and social groups.",
         },
         {
           name: "Ad-hoc Consultation for Key Decisions",
           description:
             "Targeted advice for specific financial queries or critical decisions.",
         },
       ],
   
       feeStructure: [
         { service: "Financial Health Check-up", amount: "₹10,000 – ₹12,000" },
         { service: "Holistic Financial Planning", amount: "₹18,000 – ₹22,000" },
       ],
   
     
       
   
       testimonials: [],
   
       videoUrl: "https://www.youtube.com/embed/l5wtlLvda9Q",
   

   
       sebiRegistrationNumber: "INA000019220",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Neha Kapoor", email: "grievance@globalindianadvisors.com" },
   
       cta: [
         {
           text: "Schedule Meeting",
           href: "https://calendly.com/enquiry-bachhat",
           variant: "primary",
           icon: <Calendar size={16} className="mr-2" />,
         },
       ],
   
       clientTypePills: ["NRIs", "Estate Planning Clients"],
       idealClientDescription:
         "Bachhat Money serves NRIs and individuals 45+ with established portfolios seeking expert guidance for comprehensive wealth and estate management.",
     },
     {
      id: "7",
      firmName: "Apana Dhan",
      advisorName: "Preeti Zende",
      principalAdvisor: "Preeti Zende",
      reg: "SEBI RIA REG NO: INA100013700",
      photo: "/advisors/",
      location: "Pune, Maharashtra    ",
      tagline: "Your partner on a journey Towards prosperity and Financial wellness",
  
      specializations: ["Financial Planning", "Retirement Planning", "Tax Planning"],
      audience: ["Salaried", "HNI"],
  
      about:
        "At MyGuide2Wealth, we're your partners on a journey towards prosperity and financial wellness.",
      description: `MyGuide2Wealth is accredited as a SEBI Registered Investment Advisor and Certified Financial Planner CM. We are independent, unbiased and fee-only financial planners based in Noida carving the best investment strategies, equity research & financial planning for our clients all over the globe.`,
  
      services: [
        {
          name: "Holistic Financial Planning",
          description:
            "Crafting personalized strategies to achieve your financial goals and secure your future.",
        },
        {
          name: "Personalized Retirement Planning",
          description:
            "Secure your golden years with custom retirement strategies designed for a worry-free future.",
        },
        {
          name: "Strategic Tax Optimization",
          description:
            "Reduce your taxable income and increase your net worth through proactive strategies.",
        },
        {
          name: "Children Education Planning",
          description:
            "Smart investment portfolios to fund your child's higher-education dreams.",
        },
      ],
  
      feeStructure: [
        { service: "Financial Planning", amount: "₹15,000 – ₹25,000" },
        { service: "Investment Management", amount: "0.75% – 1.25% of AUM" },
      ],
  
     
  
      testimonials: [
        {
          text: "MyGuide2Wealth's balanced approach in equity & debt is helping me reach my retirement and children's education goals.",
          author: "Col S Singh",
          designation: "Armed Forces, India",
        },
        {
          text: "Robins's patience and expertise in mutual funds solved my future goals and matched my risk profile perfectly.",
          author: "Ankur Pundir",
          designation: "Software Professional, USA",
        },
        {
          text: "They stay in touch every month to guide us in buying value stocks and mutual funds.",
          author: "N Kumar",
          designation: "Young Professional, Gurgaon",
        },
      ],
  
      videoUrl: "https://www.youtube.com/embed/JWcG7FCQu1w",
  
    
  
      sebiRegistrationNumber: "INA100013700",
      verifiedBySpring: true,
      grievanceOfficer: { name: "Suman Joshi", email: "grievance@wealthwisdom.in" },
  
      cta: [
        {
          text: "Schedule Meeting",
          href: "https://wa.me/+919811031535",
          variant: "primary",
          icon: <Calendar size={16} className="mr-2" />,
        },
      ],
  
      clientTypePills: [
        "Salaried Professionals",
        "Young Families",
        "Tax Planning",
        "Investment Planning",
      ],
      idealClientDescription:
        "Guiding salaried professionals and HNIs towards strategic financial growth.",
    },
   ];
   
   /* ------------------------------------------------------------------
      Convenience Lists (for filters / dropdowns)
   ------------------------------------------------------------------ */
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
   
   /* ------------------------------------------------------------------
      Helper – find advisor by firm name (case-insensitive, trimmed)
   ------------------------------------------------------------------ */
   export const getAdvisorByFirmName = (
     firmName: string,
   ): Advisor | undefined =>
     advisors.find(
       (a) => a.firmName.toLowerCase() === firmName.trim().toLowerCase(),
     );
   
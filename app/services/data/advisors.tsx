/* ------------------------------------------------------------------
   Spring Money – Unified Advisor Model
   Last updated: 2025-07-01
   -------------------------------------------------------------- */

   import { Calendar, ChartBar } from "lucide-react";
   import type { ReactNode } from "react";
   import { bulkAdvisorData } from "./bulk-advisors";
   import { createAdvisorProfile } from "./advisor-template";
   
   /* ------------------------------------------------------------------
      Enums & Basic Types
   ------------------------------------------------------------------ */
   
   export type Specialization =
     | "Financial Life Planning"
     | "Personal Wealth Management"
     | "Evidence Based Investing"
     | "Retirement Planning"
     | "Goal-based Planning"
     | "NRI Financial Planning"
     | "Investment Portfolio Review"
     | "Financial Well-being for Corporates"
     | "Fee-Only Financial Planning"
     | "Comprehensive Financial Planning"
     | "Tax Planning"
     | "NRI Services"
     | "Custom Smallcase"
     | "Estate Planning"
     | "Mutual Funds"
     | "Insurance"
     | "Stock Investments"
     | "Financial Planning"
     | "Fee-Only Advisory"
     | "Wealth Management"
     | "Small Cap Investing"
     | "Mid Cap Investing"
     | "Debt Management"
     | "NRI Financial Services"
     | "Direct Equity or PMS"
     | "Mutual Fund Advisory"
     | "Insurance Advisory"
     | "Portfolio Advisory Services";
   
   export type AudienceType =
     | "Salaried"
     | "Corporate Executives"
     | "Professionals"  
     | "Families"
     | "Business Owners"
     | "Retired"
     | "HNI"
     | "NRIs"
     | "Young Professionals"
     | "Salaried Professionals"
     | "IT Professionals"
     | "Fee-Only Planning";
   
   export type Location =
     | "Mumbai, Maharashtra"
     | "Delhi"
     | "Bengaluru, Karnataka"
     | "Hyderabad, Telangana"
     | "Chennai, Tamil Nadu"
     | "Pune, Maharashtra"
     | "Kolkata, West Bengal"
     | "Remote/Virtual"
     | "Noida, Uttar Pardesh"
     | "Gurugram, Haryana"
     | "Navi Mumbai, Maharashtra";
   
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
     verifiedBySpring?: boolean;
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
   
       videoUrl: "https://www.youtube.com/embed/VIDEO_ID_HERE",
   
     
   
       sebiRegistrationNumber: "INA100013700",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Suman Joshi", email: "grievance@wealthwisdom.in" },
   
       cta: [
         {
           text: "Schedule Meeting",
           href: "https://wa.me/+919811031535",
           variant: "primary"
         }
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
           variant: "primary"
         }
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
           variant: "primary"
         }
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
           variant: "primary"
         }
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
           variant: "primary"
         }
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
       firmName: "Bachhat",
       advisorName: "Vishal Shah",
       principalAdvisor: "Vishal Bharat Shah",
       reg: "SEBI RIA REG NO: INA000019220",
       photo: "/advisors/vishal-shah.svg",
       location: "Pune, Maharashtra",
       tagline:
         "Empowering your financial journey with unbiased, simplified, and transparent advice.",
   
       specializations: ["Goal-based Planning", "Retirement Planning", "Estate Planning"],
       audience: ["NRIs", "HNI", "Young Professionals"],
   
       about:
         "Bachhat is built on the pillars of transparency and unbiased advice, providing personalized strategies for financial well-being.",
       description: `Founded by CA Vishal Bharat Shah, Bachhat empowers clients through research-backed and conflict-free advisory. Vishal brings over two decades of experience across Finance, Treasury, M&A, and Strategy.`,
   
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
         { service: "Financial Health Check-up", amount: "₹18,000 – ₹22,000" },
         { service: "Holistic Financial Planning", amount: "₹10,000 – ₹12,000" },
       ],
       testimonials: [],
   
       videoUrl: "https://www.youtube.com/embed/l5wtlLvda9Q",
       sebiRegistrationNumber: "INA000019220",
       verifiedBySpring: true,
       grievanceOfficer: { name: "Neha Kapoor", email: "grievance@globalindianadvisors.com" },
   
       cta: [
         {
           text: "Schedule Meeting",
           href: "https://cutt.ly/NrDAgfXM",
           variant: "primary"
         }
       ],
   
       clientTypePills: ["NRIs", "Couples in 30+ Years","Estate Planning Clients"],
       idealClientDescription:
         "Bachhat serves NRIs, Couples in 30+ Years, and 45+ Individuals with established portfolios seeking expert guidance for comprehensive wealth and estate management.",
     },
     /* ----------------------- Advisor 7 ----------------------- */
     {
      "id": "7",
      "firmName": "Apana Dhan",
      "advisorName": "Preeti Zende",
      "principalAdvisor": "Preeti Zende",
      "reg": "SEBI RIA REG NO: INA000012777",
      "photo": "/advisors/preeti-zende.svg",
      "location": "Navi Mumbai, Maharashtra",
      "tagline": "Your Dhan, Your Way! Partnering with you for a secure and stress-free financial future.",
      "specializations": ["Comprehensive Financial Planning", "Retirement Planning", "Fee-Only Advisory"],
      "audience": ["Salaried Professionals", "IT Professionals", "NRIs"],
      "about": "Preeti Zende is a SEBI Registered Investment Adviser and the founder & CEO of Apana Dhan. She brings a uniquely analytical and process-driven perspective to personal finance. She is passionate about financial literacy and believes everyone deserves a life free from financial anxiety.",
      "description": "ApnaDhan is a SEBI Registered Investment Adviser and a dedicated fee-only financial planning firm. We do not sell any financial products or earn commissions, ensuring our advice is always 100% unbiased and in your best interest. Our sole focus is to provide clear, actionable financial roadmaps that empower our clients to achieve their goals.",
      "services": [
        {
          "name": "Comprehensive Financial Planning",
          "description": "A holistic roadmap covering your life goals, risk management, investments, retirement, and tax optimization."
        },
        {
          "name": "Express Plan (Quick Plan)",
          "description": "A focused plan for young professionals or those with specific goals who need a clear and actionable starting point."
        },
        {
          "name": "Senior Citizen Financial Planning",
          "description": "Specialized advice for retirees focusing on capital preservation, sustainable income streams, and wealth transfer."
        },
        {
          "name": "Corporate Financial Wellness",
          "description": "Customized financial literacy and wellness workshops designed for corporate employees to enhance their financial health."
        }
      ],
      "feeStructure": [
        { "service": "Comprehensive Plan", "amount": "₹20,000" },
        { "service": "Express Plan", "amount": "₹15,000" },
        { "service": "Special Senior Citizen plan (in some cases)", "amount": "₹15,000" }
      ],
      "testimonials": [
        {
          "text": "When I received such a detailed financial plan I was very much surprised. I did not expect that. My compliments to Preeti for preparing a detailed and a financial comprehensive plan, keeping into consideration my financial needs for the future. I am fortunate and thank the Almighty that out of the four options available, I opted for your services. I am sanguine that with your guidance, not only will I be financially sound but wiser too. The simplicity with which you have dealt with a complex issue needs to be complemented. It hardly leaves any doubt, even to a novice like me. To that extent my compliments to you once again.  Well done. ",
          "author": "Mohit Lama",
          "designation": "Retired Colonel, Indian Army"
        },
        {
          "text": "I have decided to avail service of Apanadhan. After series of conversations , Preeti prepared detailed Financial Plan for me based on my goals & mapped my current investments to my goals. This is how my goal based investing started finally with help of Preeti. She is also guiding me in financial queries as and when required. Overall my experience to associate with Preeti is very much pleasent . I am very much thankful to PREETI for the help she has extended to me towards gaining Financial Literacy.",
          "author": "Amar Joshi",
          "designation": "Supervisor in Qatar Steel, QPSC"
        },
        {
          "text": "The financial plan handed out by Preeti after the in-depth analysis is comprehensive and easily understandable for a new investor. It focuses in detail on every aspect of an individual. The action plan at the end of the report is crisp and concise and has recommendations that need no further analysis or consultation. Overall the process of consultation, Preeti had been co-operative and patient to every single detail. I have had numerous telephonic interactions with her regarding any doubt that I had in mind, her ability to educate her clients on the pros and cons is remarkable. I am quite satisfied with the quality and promptness of the service provided by Preeti and am willing to continue the contract term for the foreseeable future. ",
          "author": "Ankit Srivastava",
          "designation": "Software Quality Engineer 2 at Dell EMC"
        }
      ],
      "sebiRegistrationNumber": "INA000012777",
      "verifiedBySpring": true,
      "grievanceOfficer": {
        "name": "Preeti Zende",
        "email": "preeti.zende@apanadhan.com"
      },
      cta: [
        {
          text: "Book a Call",
          href: "https://wa.me/9833310722",
          variant: "primary"
        }
      ],
      "clientTypePills": [
        "IT Professionals",
        "Fee-Only Planning",
        "Retirement Planning"
      ],
      "idealClientDescription": "For salaried professionals and families, especially in the IT sector, seeking unbiased fee-only advice for long-term wealth creation and financial peace of mind."
    },
     /* ----------------------- Advisor 8 ----------------------- */
     {
      id: "8",
      firmName: "Advent Financial",
      advisorName: "Rahul Agarwal",
      principalAdvisor: "Rahul Agarwal",
      reg: "SEBI RIA REG NO: INA300003616",
      photo: "/advisors/rahul-agarwal.svg",
      location: "Mumbai, Maharashtra",
      tagline: "He strongly believes that money should support the life you truly want to live, and not the other way around.",
  
      specializations: ["Financial Life Planning", "Personal Wealth Management", "Evidence Based Investing"],
      audience: ["Corporate Executives", "Professionals", "Business Owners", "NRIs"],
  
      about:
        "Rahul believes that financial plans should be 'life-shaped'. He specializes in helping couples make better money decisions through authentic and empathetic conversations. His approach goes beyond mere spreadsheets, focusing on creating plans that align finances with shared dreams and support both partners. This ensures their financial future is not only looks good on paper but feels right in real life.",
      description: "Meet Rahul, the founder of Advent Financial. He believes financial planning should truly reflect your life. Because, too often, the advice focuses only on numbers, not people. It’s usually technical, impersonal, and overlooks that real life involves two people navigating shared dreams and different perspectives on money. Rahul has seen the impact of couples struggling with money talks, or plans that look good on paper but don't fit real life. That's why he created Advent Financial: to offer empathetic advice, rooted in real conversations, and designed to support both partners. Rahul is a Certified Financial Planner® (CFP®) and a Registered Life Planner (RLP®). More importantly, he prioritizes understanding you before offering any advice. Because your plan shouldn't just look good on paper; it should feel right in real life.",
  
      services: [
        {
          name: "Financial Life Planning",
          description:
            "For individuals and couples seeking financial clarity, strategic direction, and confidence to make informed decisions. Together, we’ll explore life scenarios and build a practical plan that supports your unique vision of a rich and fulfilling life. We'll help you make truly conscious choices for your future.",
        },
        {
          name: "Personal Wealth Management",
          description:
            "For those who want ongoing support, guidance and management of all their financial affairs. We cover savings and investments, budgeting and cashflow management, insurance, tax and estate planning. We even help you organize your financial records and information so that you can stay focused on living your life.",
        },
        {
          name: "One-off Advice / Second Opinion",
          description:
            "Need help with one important decision? Whether buying a home, planning a child’s education, or reviewing insurance, I offer focused, one-time guidance to help you move forward confidently. It is a great way to kickstart your journey, but cannot replace holistic planning. Consider an ongoing service if needs evolve.",
        },
        {
          name: "Financial Wellness for Teams",
          description:
            "I conduct tailored workshops designed to empower employees with practical tools and knowledge. The goal is to cultivate healthier money habits, significantly reduce financial stress, and foster informed decision-making for a more secure financial future. This investment in your team builds confidence and well-being.",
        },
      ],
  
      feeStructure: [
        { service: "Decided mutually based on complexity and scope of engagement.", amount: "" },
        { service: "As per SEBI prescribed limits.", amount: "" },
      ],
      testimonials: [
        {
          text: "Rahul is an outstanding financial planner who tailors strategies to individual goals and risk appetite. He takes the time to understand financial aspirations, creating a plan that balances security and growth. What truly sets him apart is his flexibility. As my priorities evolved with career changes and market shifts, Rahul proactively adjusted my portfolio to align with my long-term objectives. His expertise and client-first approach make financial planning seamless and stress-free.If you need a planner who adapts to your needs, he is an excellent choice.",
          author: "Pallavi Palkar",
          designation: "National Business Head at Big Basket"
        },
        {
          text: "For over six years, Rahul's guidance has been invaluable in shaping my financial journey. He has a deep understanding of financial markets and strategies, providing well-researched advice aligned with my long-term goals. What truly sets him apart is his integrity and client-centric approach; he simplifies complex topics, understands my evolving needs, and offers a proactive, long-term perspective that has given me financial stability and peace of mind. I highly recommend him as a knowledgeable, trustworthy, and dedicated financial advisor.",
          author: "Anirban De",
          designation: "Strategic Partnerships at Swift"
        },
        {
          text: "In a short time, Rahul became our go-to person for everything related to money management. What sets him apart is his balanced approach to long-term wealth management, backed by a clearly defined process. At every point, he focuses on enabling you to make the right decision rather than prescribing something. Rahul and his team are always on top of all the paperwork and tracking, making it easy to have all information in one place. He is also very accommodative of scheduling constraints, going the extra mile to support us.",
          author: "Kartik Pal",
          designation: "Manager at Kearney"
        },
      ],
  
      videoUrl: "https://www.youtube.com/embed/_tIpbBTBSGo",
      sebiRegistrationNumber: "INA300003616",
      verifiedBySpring: true,
      grievanceOfficer: { name: "Neha Kapoor", email: "grievance@globalindianadvisors.com" },
  
      cta: [
        {
          text: "Schedule Meeting",
          href: "https://meetings-na2.hubspot.com/rahul21?uuid=3844dd37-2537-41f8-81be-3001a9a6c51a",
          variant: "primary"
        },
        {
          text: "Visit Website",
          href: "https://www.adventfa.com/",
          variant: "secondary"
        }
      ],
  
      faqs: [
        {
          question: "What makes your financial planning different from others?",
          answer:
            "My financial planning is different because I focus on your whole life, not just your portfolio. I believe that true financial success isn't just about the numbers; it's about achieving peace of mind and making meaningful progress toward your ideal future. My structured process helps you clarify what truly matters most to you and your family. From there, I build a comprehensive, personalized plan that aligns every financial decision with your unique life goals, ensuring your money is a tool supporting your happiness.",
        },
        {
          question: "What should I expect in our first conversation?",
          answer:
            "You can expect a relaxed and completely confidential conversation with absolutely no pitches and no pressure. The entire focus of our first meeting is simply to get to know each other. It's a thoughtful conversation where we listen to understand where you are in life, what you want, and what your concerns are. This initial dialogue is crucial for us to determine if our expertise and approach are the right fit to help you get there, ensuring we can build a successful and trusted partnership.",
        },
        {
          question: "What does the ongoing process look like after the initial financial plan is created?",
          answer: "Creating the financial plan is just the beginning of our journey together. The ongoing process starts with implementation, where we work together to put your plan into action, one step at a time. This may involve adjusting your investments, setting up protection strategies, or coordinating with other professionals. After that, our partnership continues with regular meetings where we review your progress, revisit your goals, and make necessary changes as your life evolves, ensuring your plan always remains relevant.",
        },
        {
          question: "What is your investment philosophy?",
          answer:
            "My investment philosophy is that your financial plan must be uniquely designed for your specific goals, resources, and risk appetite. I believe robust asset allocation, the principle of compounding, focusing on real returns and keeping costs low has a more significant impact on your investment experience than picking individual securities, chasing returns or market timing. Therefore, I focus on a disciplined, long-term approach using simple products and systematic investing. I do not provide stock tips, recommend day trading, or use complicated structured products.",
        },
        {
          question: "HWhy should I pay fees when there are many free tools available online?",
          answer: "The choice is a simple economic one: the value of professional advice should always exceed its cost. While free tools provide information, our role is to serve as your “living insurance policy” against the costly mistakes any investor can be tempted to make in volatile times. Avoiding just one such error can save you multiples of our fee. This human guidance is our core value. As a fee-only advisor, our structure also creates a perfect alignment of interests, ensuring our advice is always a direct investment in your long-term financial security.",
        },
      ],
  
      clientTypePills: [
        "Corporate Executives", "Professionals", "Business Owners", "NRIs"
      ],
      idealClientDescription:
        "Couples who want a financial plan built around their life, one that reflects their shared life goals and values.",
    },
  
    //  /* ----------------------- Advisor 9 ----------------------- */
    //  {
    //   "id": "9",
    //   "firmName": "Right Returns",
    //   "advisorName": "Devang Shah",
    //   "principalAdvisor": "Devang Shah",
    //   "reg": "SEBI RIA REG NO: INA000004930",
    //   "photo": "/advisors/devang-shah.svg",
    //   "location": "Mumbai, Maharashtra",
    //   "tagline": "Holistic and unbiased financial advice for a worry-free life.",
    //   "specializations": ["NRI Financial Planning", "Investment Portfolio Review", "Fee-Only Advisory"],
    //   "audience": ["Families", "Salaried Professionals", "NRIs"],
    //   "about": "Devang Shah is a SEBI Registered Investment Adviser with over 20 years of rich experience in the financial services industry, including senior roles at HDFC Bank (Private Banking) and ICICI Bank (Wealth Management). He is passionate about providing high-quality, ethical advice to help families achieve their financial dreams.",
    //   "description": "Right Returns is a SEBI Registered Investment Advisory and a dedicated fee-only financial planning firm. We do not sell any financial products or receive commissions, ensuring our advice is always 100% unbiased and aligned with your best interests. Our mission is to provide financial clarity and confidence to our clients through a structured and transparent advisory process.",
    //   "services": [
    //       {
    //         "name": "Investment & Wealth Advisory",
    //         "description": "Navigate market uncertainty with clarity. We provide unbiased investment advice and strategic wealth advisory, helping you build a resilient portfolio designed to achieve favourable outcomes while protecting against unfavourable ones."
    //       },
    //       {
    //         "name": "Retirement & Estate Planning",
    //         "description": "Plan for a secure future and a lasting legacy with confidence. We create robust retirement income strategies and thoughtful estate plans, ensuring you and your loved ones are financially protected through all of life's stages."
    //       },
    //       {
    //         "name": "Children’s Education Funding",
    //         "description": "Secure your child's future education, whether in India or overseas. We design specialized funding strategies that account for inflation and currency risk, ensuring you are fully prepared to meet this critical financial goal without compromise."
    //       },
    //       {
    //         "name": "Insurance Needs Analysis",
    //         "description": "Gain clarity on your true risk exposure. We conduct a comprehensive, unbiased evaluation of your life and health insurance needs to ensure your family is adequately protected, giving you peace of mind without unnecessary costs."
    //       }
    //   ],
    //   "feeStructure": [
    //     { "service": "Comprehensive Plan (Resident)", "amount": "₹25,000" },
    //     { "service": "Comprehensive Plan (NRI)", "amount": "US$ 500 / AED 1800" },
    //     { "service": "Investment Portfolio Review", "amount": "₹15,000" },
    //     { "service": "Financial Second Opinion", "amount": "₹7,500" }
    //   ],
    //   "testimonials": [
    //     {
    //       "text": "[Placeholder] Devang's experience in private banking is evident in his professional approach. He simplified complex financial concepts and gave our family a clear path forward.",
    //       "author": "A. Mehta",
    //       "designation": "Business Owner, Mumbai"
    //     },
    //     {
    //       "text": "[Placeholder] As an NRI, I needed an advisor I could trust. The fee-only model and transparent communication at Right Returns were exactly what I was looking for.",
    //       "author": "S. Patel",
    //       "designation": "Tech Professional, Canada"
    //     },
    //     {
    //       "text": "[Placeholder] The portfolio review was incredibly insightful. Devang identified redundancies and helped me re-align my investments for better long-term growth.",
    //       "author": "Priya R.",
    //       "designation": "Marketing Head, Bangalore"
    //     }
    //   ],
    //   "sebiRegistrationNumber": "INA000015555",
    //   "verifiedBySpring": false,
    //   "grievanceOfficer": {
    //     "name": "Devang Shah",
    //     "email": "devang@rightreturns.com"
    //   },
    //   "cta": [
    //     {
    //       "text": "Email us",
    //       "href": "mailto:assist@rightreturns.com",
    //       "variant": "primary"
    //     }
    //   ],
    //   "clientTypePills": [
    //     "Families",
    //     "NRIs",
    //     "Retirement Planning",
    //     "Fee-Only Advisory"
    //   ],
    //   "idealClientDescription": "For individuals, families, and NRIs seeking unbiased, expert financial advice from a seasoned professional with a deep background in banking and wealth management."
    // },
      /* ----------------------- Advisor 10 ----------------------- */
      {
        id: "10",
        firmName: "Ketan Kiran Gogte",
        advisorName: "Ketan Kiran Gogte",
        principalAdvisor: "Ketan Kiran Gogte",
        reg: "SEBI RIA REG NO: INA000009649",
        photo: "/advisors/ketan-gogte.svg",
        location: "Pune, Maharashtra",
        tagline: "Advising working professionals and business owners on Financial planning, Long term investing and Portfolio advisory.",
        videoUrl: "https://www.youtube.com/embed/R96BWUXPeOE",
    
        specializations: ["Comprehensive Financial Planning", "Goal-based Planning", "Retirement Planning", "Mutual Funds", "Stock Investments", "Investment Portfolio Review", "NRI Financial Services", "Portfolio Advisory Services"],
        audience: ["Professionals", "Business Owners", "Families", "NRIs"],
    
        about:
          "Ketan offers research driven independent Investment Advisory services. The offerings include comprehensive financial planning based on Goals, Time horizon and Risk profile, advisory on Asset allocation and building a portfolio through long term investing for wealth creation.",
        description: `Ketan offers research driven independent Investment Advisory services. The offerings include comprehensive financial planning based on Goals, Time horizon and Risk profile, advisory on Asset allocation and building a portfolio through long term investing for wealth creation. He advises on SEBI regulated products like the listed Stocks, Mutual funds (MFs) and Exchange Traded Funds (ETFs). Services are non-discretionary in nature and are customized as per client’s goals and risk profile. Ketan acts in a fiduciary capacity towards his clients.`,
    
        services: [
          {
            name: "Comprehensive Financial Planning",
            description:
              "Holistic planning based on goals, time horizon, and risk profile.",
          },
          {
            name: "Goal-Based Long Term Investing",
            description:
              "Portfolio building through long-term investing for wealth creation.",
          },
          {
            name: "Retirement Planning",
            description:
              "Dedicated strategies for a secure post-retirement life.",
          },
          {
            name: "Mutual Fund, Stocks & ETF Advisory",
            description:
              "Research-driven advice on SEBI-regulated investment products.",
          },
        ],
    
        feeStructure: [
          { service: "Advisory Fee", amount: "Based on scope, within SEBI RIA limits." },
        ],
    
        sebiRegistrationNumber: "INA000009649",
        verifiedBySpring: true,
        grievanceOfficer: { name: "Ketan Kiran Gogte", email: "ketangogte@gmail.com" },
    
        cta: [
          {
            text: "Schedule Meeting",
            href: "https://wa.me/919158911324",
            variant: "primary"
          }
        ],
    
        faqs: [
          { question: "How does Ketan view the role of a Financial plan?", answer: "Financial plan has to be a Life plan. It should be a dynamic document rather than a static one. It should help an individual or a family take decisions and simulate the scenarios in order to anticipate the impact of certain events (for e.g. taking on a Home loan or Going on a foreign vacation in a particular year) on the finances so that they are better prepared to take a decision. It should highlight the gap between what an individual or a family is currently doing and what needs to be done in order to achieve their Goals." },
          { question: "Are the Advisory Services Customized as per an Individual’s needs?", answer: "Yes the Advisory services are customized based on one’s Goals, time horizon and risk profile. It’s a very close knit engagement between Ketan (The Advisor) and the client with regular interactions and timely reviews." },
          { question: "Is the rationale for investment explained to the Client?", answer: "Yes, the rationale for making any investment decision is explained in detail to the client. Ketan wants to empower the client and wants him / her to take control of his / her finances and thus provides all necessary information required from time to time for the client to do so." },
          { question: "Are portfolio reviews included in the scope of the engagement?", answer: "Yes, Ketan believes that whatever gets tracked and reviewed, get executed. Thus it is important to have reviews with clients on their portfolios at regular time intervals through the course of the engagement. It brings discipline and consistency." },
          { question: "Is the already existing investments portfolio of a client included in the scope of Advisory?", answer: "Yes, analysis of the existing client investment portfolio comprising of SEBI regulated products such as the listed Stocks, Mutual funds (MFs) and Exchange Traded Funds (ETFs) is included as part of the engagement." },
          { question: "What is not included as part of the Advisory scope? ", answer: "Any sort of short term trading in listed stocks, Futures & Options or Derivatives, Commodities trading, Forex, Crypto currencies, Real Estate and Overseas direct equities and unlisted stocks are excluded from the scope of the Advisory engagement." }

        ],
    
        clientTypePills: ["Professionals", "Business Owners", "NRIs"],
        idealClientDescription: "Ketan primarily works with Individuals and families. He has been advising both working professionals and business owners. Clientele includes NRIs as well.",
      },
    
      /* ----------------------- Advisor 11 ----------------------- */
      {
        id: "11",
        firmName: "Shwealth",
        advisorName: "Jay Sheth",
        principalAdvisor: "Jay Sheth",
        reg: "SEBI RIA REG NO: INA000019062",
        photo: "/advisors/jay-sheth.svg",
        location: "Mumbai, Maharashtra",
        tagline: "Assisting Individuals build and preserve their Wealth through smart, research driven financial strategies and products.",
    
        specializations: ["Comprehensive Financial Planning", "Goal-based Planning", "Retirement Planning", "Mutual Fund Advisory", "Stock Investments", "Insurance Advisory", "Tax Planning", "NRI Services", "NRI Financial Services", "Estate Planning", "Direct Equity or PMS"],
        audience: ["Professionals", "Retired", "NRIs"],
    
        about:
          "At Shwealth, our primary belief lies in simplifying finance and investments whether you are a beginner or experienced investor. Each of our plans are unique and tailored to an individual’s personal situation.",
        description: `At Shwealth, our primary belief lies in simplifying finance and investments whether you are a beginner or experienced investor. Each of our plans are unique and tailored to an individual’s personal situation. We have built unique models for Mutual Fund research and preparing flexible personal finance plans. Client’s trust us for our research driven and conflict free approach.`,
    
        services: [
          {
            name: "Comprehensive Financial Planning",
            description:
              "Tailored personal finance plans simplifying investments for all levels of experience.",
          },
          {
            name: "Research-Driven Mutual Fund Advisory",
            description:
              "Unique models for Mutual Fund research ensuring a conflict-free approach.",
          },
          {
            name: "Goal-Based Investing",
            description:
              "Aligning your investments with specific financial milestones.",
          },
        ],
    
        feeStructure: [
          { service: "Flat Fee Plans", amount: "Standard flat fee for engagement; custom plans available." },
        ],
    
        testimonials: [
          { text: "The mutual fund portfolio review done by Jay was an eye opener for me. He clearly showed me the cost of going through an agent. He also showed me how to tie in my investments with specific goals. The attention and time he gave was refreshing.", author: "High Court Lawyer - Mumbai" },
          { text: "Jay assisted me in transitioning my investments from MF agent to direct schemes. Apart from the saving in commissions, I am more confident about where my investments are being made and how I will reach a corpus to be financially independent.", author: "Primary Teacher - Mumbai" },
          { text: "I wanted to take a moment to express my sincere appreciation for your help in developing my financial plan. Your comprehensive approach, which included a thorough review of my assets, goals, and insurance needs, provided me with a clear roadmap for her financial future.", author: "IT Consultant - UAE" }
        ],
    
        videoUrl: "https://www.youtube.com/embed/v-m-Thcwv94",
    
        sebiRegistrationNumber: "INA000019062",
        verifiedBySpring: true,
        grievanceOfficer: { name: "Jay Sheth", email: "jay@shwealth.in" },
    
        cta: [
          {
            text: "Book a Call",
            href: "https://www.shwealth.in",
            variant: "primary"
          }
        ],
    
        faqs: [
          { question: "Do you cater to clients outside of Mumbai?", answer: "Yes, we cater to clients across India and NRIs as well" },
          { question: "How do you charge fees? Is it a % of AUA?", answer: "We only charge a flat fee. We have two plans in which the offering and pricing varies. For customized plans we provide a separate quotation" },
          { question: "What do we get in a typical engagement?", answer: "A standard engagement would consist of 2-4 Microsoft Teams calls over which the financial plan is prepared and discussed. Post this, we provide:\n\n1. A written report\n2. A financial plan in excel which clients can use to run iterations on variables\n3. Access to our in-house Mutual Fund model" }
        ],
    
        clientTypePills: ["Professionals", "NRIs", "Retirees"],
        idealClientDescription: "We work with professionals across all career stages from beginner to retirees. Though we are Mumbai based we cater to NRIs and Clients across India.",
      },
    // Add bulk advisors using the template system
    ...bulkAdvisorData.map(data => createAdvisorProfile(data))
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
     "Mumbai, Maharashtra",
     "Delhi",
     "Bengaluru, Karnataka",
     "Hyderabad, Telangana",
     "Chennai, Tamil Nadu",
     "Pune, Maharashtra",
     "Kolkata, West Bengal",
     "Remote/Virtual",
     "Noida, Uttar Pardesh",
     "Gurugram, Haryana"
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
   
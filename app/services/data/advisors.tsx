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
     | "Retirement Planning"
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
     | "Debt Management";
   
   export type AudienceType =
     | "Salaried"
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
       firmName: "Bachhat",
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
      "about": "Preeti Zende is a SEBI Registered Investment Adviser and the founder of Apana Dhan. With a successful prior career in the IT industry, she brings a uniquely analytical and process-driven perspective to personal finance. She is passionate about financial literacy and believes everyone deserves a life free from financial anxiety.",
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
        { "service": "Comprehensive Plan", "amount": "₹25,000" },
        { "service": "Express / Senior Citizen Plan", "amount": "₹15,000" }
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
      "cta": [
        {
          "text": "Schedule a Consultation",
          "href": "https://wa.me/919923202026",
          "variant": "primary"
        }
      ],
      "clientTypePills": [
        "IT Professionals",
        "Fee-Only Planning",
        "Retirement Planning",
        "NRI Services"
      ],
      "idealClientDescription": "For salaried professionals and families, especially in the IT sector, seeking unbiased fee-only advice for long-term wealth creation and financial peace of mind."
    },
     /* ----------------------- Advisor 8 ----------------------- */
     {
      "id": "8",
      "firmName": "Advent Financial",
      "advisorName": "Rahul Agarwal",
      "principalAdvisor": "Rahul Agarwal",
      "reg": "SEBI RIA REG NO: INA300003616",
      "photo": "/advisors/rahul-agarwal.svg",
      "location": "Mumbai, Maharashtra",
      "tagline": "Build a life you love with a financial plan that puts you first.",
      "specializations": ["Retirement Planning", "NRI Financial Planning", "Investment Portfolio Review"],
      "audience": ["Salaried Professionals", "Business Owners", "NRIs"],
      "about": "Rahul Agarwal is a Certified financial Planner (CFP), and a Registered Life Planner with over 15 years of experience in the financial services industry. Prior to founding Advent Financial, he held key positions at HDFC Bank & ICICI Bank. He is dedicated to helping families and individuals achieve their financial goals through structured, unbiased, and process-driven advice.",
      "description": "Advent Financial is a SEBI Registered Investment Adviser dedicated to providing unbiased, fee-only financial planning. We believe that true financial advice should be free from conflicts of interest. That is why we do not sell any financial products or earn any commissions. Our sole focus is on crafting personalized, process-driven financial roadmaps that empower our clients to achieve their most important life goals. With a commitment to transparency and integrity, we act as your trusted partner, ensuring your financial plan is built exclusively around your needs and your future.",
      "services":[
        {
          "name": "Bespoke Financial Planning",
          "description": "A personalized roadmap for individuals and couples who want clarity and confidence in their financial life. We work with you to organize your finances, explore life decisions through scenario modeling, and create an actionable plan for your most important goals—from retirement to tax-aware investing."
        },
        {
          "name": "Ongoing Wealth Advisory",
          "description": "For those who want a long-term thinking partner to manage their wealth with intention. This service includes ongoing investment management, values-based portfolio strategies, and coordination with your tax and estate professionals, so you can focus on living your life, knowing your finances are cared for."
        },
        {
          "name": "Goal-Specific Planning",
          "description": "Focused advisory when you need to solve for a single, important objective. Whether it's planning for a home purchase, your child's education, or reviewing your insurance, we provide targeted analysis and clear recommendations to help you make the best choice."
        },
        {
          "name": "Corporate Financial Wellness",
          "description": "Empower your team with financial clarity. We design and deliver customized workshops and financial wellness sessions that enhance literacy, reduce money-related stress, and help your employees build a more secure future."
        }
      ],
      "feeStructure": [
        { "service": "Comprehensive Plan (Resident)", "amount": "₹25,000" },
        { "service": "Comprehensive Plan (NRI)", "amount": "₹30,000" },
        { "service": "Modular Planning (e.g., Retirement)", "amount": "₹10,000" },
        { "service": "Investment Portfolio Review", "amount": "₹15,000" }
      ],
      "testimonials": [
        {
          "text": "[Placeholder] Rahul's deep understanding of financial markets and his structured approach gave us the clarity we needed for our retirement planning. His experience truly shows.",
          "author": "R. Verma",
          "designation": "Business Owner, Delhi"
        },
        {
          "text": "[Placeholder] As an NRI, I was looking for a trustworthy advisor. Advent Financial's fee-only model and transparent process made them the perfect choice.",
          "author": "Priya Menon",
          "designation": "IT Consultant, Dubai"
        },
        {
          "text": "[Placeholder] The portfolio review was an eye-opener. Rahul helped us rebalance our investments and optimize for taxes, significantly improving our potential returns.",
          "author": "A. & S. Gupta",
          "designation": "Salaried Professionals, Noida"
        }
      ],
      "sebiRegistrationNumber": "INA100004325",
      "verifiedBySpring": true,
      "grievanceOfficer": {
        "name": "Rahul Agarwal",
        "email": "rahul@adventfa.com"
      },
      "cta": [
        {
          "text": "Schedule a Consultation",
          "href": "https://meetings.hubspot.com/rahul21?uuid=11b7367a-0300-4b48-8369-a09349457cc5",
          "variant": "primary"
        }
      ],
      "clientTypePills": [
        "Business Owners",
        "NRI Clients",
        "Retirement Planning",
        "Fee-Only Advisory"
      ],
      "idealClientDescription": "For salaried professionals, business owners, and NRIs seeking a comprehensive, long-term financial plan from an experienced and unbiased fee-only advisor."
    },
     /* ----------------------- Advisor 9 ----------------------- */
     {
      "id": "9",
      "firmName": "Right Returns",
      "advisorName": "Devang Shah",
      "principalAdvisor": "Devang Shah",
      "reg": "SEBI RIA REG NO: INA000004930",
      "photo": "/advisors/devang-shah.svg",
      "location": "Mumbai, Maharashtra",
      "tagline": "Holistic and unbiased financial advice for a worry-free life.",
      "specializations": ["NRI Financial Planning", "Investment Portfolio Review", "Fee-Only Advisory"],
      "audience": ["Families", "Salaried Professionals", "NRIs"],
      "about": "Devang Shah is a SEBI Registered Investment Adviser with over 20 years of rich experience in the financial services industry, including senior roles at HDFC Bank (Private Banking) and ICICI Bank (Wealth Management). He is passionate about providing high-quality, ethical advice to help families achieve their financial dreams.",
      "description": "Right Returns is a SEBI Registered Investment Advisory and a dedicated fee-only financial planning firm. We do not sell any financial products or receive commissions, ensuring our advice is always 100% unbiased and aligned with your best interests. Our mission is to provide financial clarity and confidence to our clients through a structured and transparent advisory process.",
      "services": [
          {
            "name": "Investment & Wealth Advisory",
            "description": "Navigate market uncertainty with clarity. We provide unbiased investment advice and strategic wealth advisory, helping you build a resilient portfolio designed to achieve favourable outcomes while protecting against unfavourable ones."
          },
          {
            "name": "Retirement & Estate Planning",
            "description": "Plan for a secure future and a lasting legacy with confidence. We create robust retirement income strategies and thoughtful estate plans, ensuring you and your loved ones are financially protected through all of life's stages."
          },
          {
            "name": "Children’s Education Funding",
            "description": "Secure your child's future education, whether in India or overseas. We design specialized funding strategies that account for inflation and currency risk, ensuring you are fully prepared to meet this critical financial goal without compromise."
          },
          {
            "name": "Insurance Needs Analysis",
            "description": "Gain clarity on your true risk exposure. We conduct a comprehensive, unbiased evaluation of your life and health insurance needs to ensure your family is adequately protected, giving you peace of mind without unnecessary costs."
          }
      ],
      "feeStructure": [
        { "service": "Comprehensive Plan (Resident)", "amount": "₹25,000" },
        { "service": "Comprehensive Plan (NRI)", "amount": "US$ 500 / AED 1800" },
        { "service": "Investment Portfolio Review", "amount": "₹15,000" },
        { "service": "Financial Second Opinion", "amount": "₹7,500" }
      ],
      "testimonials": [
        {
          "text": "[Placeholder] Devang's experience in private banking is evident in his professional approach. He simplified complex financial concepts and gave our family a clear path forward.",
          "author": "A. Mehta",
          "designation": "Business Owner, Mumbai"
        },
        {
          "text": "[Placeholder] As an NRI, I needed an advisor I could trust. The fee-only model and transparent communication at Right Returns were exactly what I was looking for.",
          "author": "S. Patel",
          "designation": "Tech Professional, Canada"
        },
        {
          "text": "[Placeholder] The portfolio review was incredibly insightful. Devang identified redundancies and helped me re-align my investments for better long-term growth.",
          "author": "Priya R.",
          "designation": "Marketing Head, Bangalore"
        }
      ],
      "sebiRegistrationNumber": "INA000015555",
      "verifiedBySpring": false,
      "grievanceOfficer": {
        "name": "Devang Shah",
        "email": "devang@rightreturns.com"
      },
      "cta": [
        {
          "text": "Email us",
          "href": "mailto:assist@rightreturns.com",
          "variant": "primary"
        }
      ],
      "clientTypePills": [
        "Families",
        "NRIs",
        "Retirement Planning",
        "Fee-Only Advisory"
      ],
      "idealClientDescription": "For individuals, families, and NRIs seeking unbiased, expert financial advice from a seasoned professional with a deep background in banking and wealth management."
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
   
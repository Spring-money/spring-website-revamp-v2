// app/tools/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import sideArrow from "../../public/Arrow 1.svg";

/* ──────────────────────────
   Helper: case-insensitive “like” match
────────────────────────── */
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const includesLike = (haystack: string, needle: string) =>
  normalize(haystack).includes(normalize(needle));

/* ──────────────────────────
   Category definitions
────────────────────────── */
const CATEGORIES = [
  "All",
  "Income & Budgeting",
  "Savings & Investments",
  "Loans & Debt Management",
  "Retirement Planning",
  "Taxation & Deductions",
  "Real Estate & Home Buying",
  "Education & Kids Planning",
  "Insurance & Risk Management",
  "Lifestyle & Goals-Based Planning",
  "Miscellaneous Financial Tools",
] as const;
type Category = (typeof CATEGORIES)[number];

/* ──────────────────────────
   Types
────────────────────────── */
type Calculator = {
  id: number;
  title: string;
  description: string;
  slug: string;
  category: Category;
};

/* ──────────────────────────
   Base calculators (IDs 1-15)
────────────────────────── */
const baseCalculators: Calculator[] = [
  {
    id: 1,
    title: "Should I Buy or Rent a Home?",
    description:
      "Analyze whether it's more cost-effective to buy a house or continue renting.",
    slug: "buyVsRent",
    category: "Real Estate & Home Buying",
  },
  {
    id: 2,
    title: "Buy a Car vs. Commute Calculator",
    description:
      "Compare the costs of owning a car versus using alternative commuting options.",
    slug: "carVsCommute",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    id: 3,
    title: "EMI Calculator",
    description: "Estimate monthly loan payments for car, home, or other loans.",
    slug: "emiCalculator",
    category: "Loans & Debt Management",
  },
  {
    id: 4,
    title: "Endowment Calculator",
    description:
      "Determine whether to continue your endowment policy or surrender it.",
    slug: "endowmentVsTerm",
    category: "Miscellaneous Financial Tools",
  },
  {
    id: 5,
    title: "FD vs RD Calculator",
    description:
      "Project maturity values and growth for Fixed and Recurring Deposits.",
    slug: "fdRdCalculator",
    category: "Savings & Investments",
  },
  {
    id: 6,
    title: "FD-Based Retirement Calculator",
    description: "Plan your retirement corpus using FD-based projections.",
    slug: "fdRetirementCalculator",
    category: "Retirement Planning",
  },
  {
    id: 7,
    title: "FIRE Calculator",
    description:
      "Evaluate if 25× your annual expenses is enough for early retirement.",
    slug: "fireCalculator",
    category: "Retirement Planning",
  },
  {
    id: 8,
    title: "When Will I Make My First Crore?",
    description:
      "Find out how long it takes to accumulate ₹1 crore based on your investments.",
    slug: "firstCrore",
    category: "Savings & Investments",
  },
  {
    id: 9,
    title: "Fuel vs. Electric Vehicle Calculator",
    description:
      "Compare long-term costs of fuel-based versus electric vehicles.",
    slug: "fuelVsEv",
    category: "Miscellaneous Financial Tools",
  },
  {
    id: 10,
    title: "Hourly Wage Calculator",
    description: "Convert your annual or monthly salary into an hourly wage.",
    slug: "hourlyWage",
    category: "Income & Budgeting",
  },
  {
    id: 11,
    title: "MBA ROI Calculator",
    description:
      "Assess lost earnings during an MBA versus potential salary growth post-MBA.",
    slug: "mbaRoi",
    category: "Savings & Investments",
  },
  {
    id: 12,
    title: "Mutual Fund vs. NPS Tier I Calculator",
    description:
      "Compare market-driven Mutual Funds with government-backed NPS Tier I investments.",
    slug: "npsVsMf",
    category: "Savings & Investments",
  },
  {
    id: 13,
    title: "CTC vs. In-Hand Salary Calculator",
    description:
      "Break down your Cost-to-Company into net monthly take-home pay.",
    slug: "salaryCalculator",
    category: "Income & Budgeting",
  },
  {
    id: 14,
    title: "SIP Calculator",
    description:
      "Explore potential returns of Systematic Investment Plans over time.",
    slug: "sipCalculator",
    category: "Savings & Investments",
  },
  {
    id: 15,
    title: "Sukanya Samriddhi Yojana Calculator",
    description:
      "Compute maturity amounts and benefits of the SSY savings scheme.",
    slug: "sukanyaSamruddhi",
    category: "Savings & Investments",
  },
];

/* ──────────────────────────
   Extended calculators (IDs 16+)
────────────────────────── */
const extendedCalculators: Omit<Calculator, "id">[] = [
  /* Income & Budgeting */
  {
    title: "Monthly Budget Planner",
    description:
      "Plan your monthly income and expenditures to stay on track with your budget.",
    slug: "monthly-budget-planner",
    category: "Income & Budgeting",
  },
  {
    title: "Savings Goal Calculator",
    description: "Set and calculate your target savings goal.",
    slug: "savings-goal-calculator",
    category: "Income & Budgeting",
  },
  {
    title: "Emergency Fund Calculator",
    description: "Determine how much you need to save for an emergency fund.",
    slug: "emergency-fund-calculator",
    category: "Income & Budgeting",
  },
  {
    title: "Net Worth Calculator",
    description:
      "Calculate your net worth by adding assets and subtracting liabilities.",
    slug: "net-worth-calculator",
    category: "Income & Budgeting",
  },
  {
    title: "Side Income Estimator",
    description:
      "Estimate additional income from side hustles or freelance work.",
    slug: "side-income-estimator",
    category: "Income & Budgeting",
  },
  {
    title: "Subscription Cost Analyzer",
    description:
      "Analyze monthly or annual subscriptions to optimize expenses.",
    slug: "subscription-cost-analyzer",
    category: "Income & Budgeting",
  },

  /* Savings & Investments */
  {
    title: "Lump-Sum Investment Calculator",
    description: "Determine the potential growth of a one-time investment.",
    slug: "lump-sum-investment-calculator",
    category: "Savings & Investments",
  },
  {
    title: "Stock Return Calculator",
    description: "Assess the potential returns on stock investments.",
    slug: "stock-return-calculator",
    category: "Savings & Investments",
  },
  {
    title: "Gold Investment Return Calculator",
    description: "Evaluate returns on gold investments over time.",
    slug: "gold-investment-return-calculator",
    category: "Savings & Investments",
  },
  {
    title: "Post Office Savings Calculator",
    description: "Determine returns on post-office savings schemes.",
    slug: "post-office-savings-calculator",
    category: "Savings & Investments",
  },
  {
    title: "Bonds Yield Calculator",
    description: "Analyze yield on bonds and fixed-income instruments.",
    slug: "bonds-yield-calculator",
    category: "Savings & Investments",
  },

  /* Loans & Debt Management */
  {
    title: "Loan Affordability Calculator",
    description: "Determine how much loan you can afford based on income.",
    slug: "loan-affordability-calculator",
    category: "Loans & Debt Management",
  },
  {
    title: "Debt-to-Income Ratio Calculator",
    description:
      "Assess your debt-to-income ratio for better financial planning.",
    slug: "debt-to-income-ratio-calculator",
    category: "Loans & Debt Management",
  },
  {
    title: "Balance Transfer Savings Calculator",
    description: "Evaluate savings from balance-transfer offers.",
    slug: "balance-transfer-savings-calculator",
    category: "Loans & Debt Management",
  },
  {
    title: "Credit-Card Payoff Calculator",
    description: "Plan the payoff of your credit-card debt.",
    slug: "credit-card-payoff-calculator",
    category: "Loans & Debt Management",
  },
  {
    title: "Mortgage Refinancing Calculator",
    description: "Analyze potential savings from mortgage refinancing.",
    slug: "mortgage-refinancing-calculator",
    category: "Loans & Debt Management",
  },

  /* Insurance & Risk Management */
  {
    title: "Term-Insurance Needs Calculator",
    description: "Estimate your term-insurance coverage requirement.",
    slug: "term-insurance-needs-calculator",
    category: "Insurance & Risk Management",
  },
  {
    title: "Health-Insurance Premium Estimator",
    description: "Estimate your health-insurance premium.",
    slug: "health-insurance-premium-estimator",
    category: "Insurance & Risk Management",
  },
  {
    title: "Life-Insurance Coverage Calculator",
    description: "Find out how much life-insurance cover you need.",
    slug: "life-insurance-coverage-calculator",
    category: "Insurance & Risk Management",
  },

  /* Retirement Planning */
  {
    title: "Retirement Savings Calculator",
    description: "Estimate savings needed for retirement.",
    slug: "retirement-savings-calculator",
    category: "Retirement Planning",
  },
  {
    title: "Retirement Goal Calculator",
    description:
      "Figure out the corpus required to meet your retirement goals.",
    slug: "retirement-goal-calculator",
    category: "Retirement Planning",
  },
  {
    title: "Pension Fund Calculator",
    description: "Assess your pension-fund contributions and growth.",
    slug: "pension-fund-calculator",
    category: "Retirement Planning",
  },
  {
    title: "Annuity Calculator",
    description: "Estimate annuity payouts for retirement planning.",
    slug: "annuity-calculator",
    category: "Retirement Planning",
  },
  {
    title: "Required Minimum Distribution Calculator",
    description:
      "Compute required minimum distributions for your retirement accounts.",
    slug: "required-minimum-distribution-calculator",
    category: "Retirement Planning",
  },
  {
    title: "Early Retirement Feasibility Calculator",
    description: "Evaluate the feasibility of early retirement.",
    slug: "early-retirement-feasibility-calculator",
    category: "Retirement Planning",
  },

  /* Taxation & Deductions */
  {
    title: "Income-Tax Calculator",
    description: "Estimate your income-tax liability.",
    slug: "income-tax-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "Advance-Tax Calculator",
    description:
      "Estimate your advance-tax liability for the year based on income and deductions.",
    slug: "advance-tax-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "Capital-Gains Tax Calculator",
    description: "Calculate tax on capital gains.",
    slug: "capital-gains-tax-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "HRA Exemption Calculator",
    description: "Determine your House Rent Allowance exemption.",
    slug: "hra-exemption-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "Section 80C Tax-Savings Calculator",
    description: "Plan investments to maximise Section 80C tax benefits.",
    slug: "section-80c-tax-savings-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "GST Calculator",
    description: "Calculate GST on various transactions.",
    slug: "gst-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "Gratuity Calculator",
    description: "Estimate gratuity payouts based on tenure and salary.",
    slug: "gratuity-calculator",
    category: "Taxation & Deductions",
  },
  {
    title: "Provident-Fund Withdrawal Calculator",
    description: "Calculate expected PF-withdrawal amounts.",
    slug: "provident-fund-withdrawal-calculator",
    category: "Taxation & Deductions",
  },

  /* Real Estate & Home Buying */
  {
    title: "Property Appreciation Calculator",
    description: "Estimate future property appreciation.",
    slug: "property-appreciation-calculator",
    category: "Real Estate & Home Buying",
  },
  {
    title: "Rental Yield Calculator",
    description: "Calculate the yield on your rental property.",
    slug: "rental-yield-calculator",
    category: "Real Estate & Home Buying",
  },
  {
    title: "Land Investment Returns Calculator",
    description: "Evaluate returns on land investments.",
    slug: "land-investment-returns-calculator",
    category: "Real Estate & Home Buying",
  },
  {
    title: "Mortgage Interest Savings Calculator",
    description: "Determine how much you can save on mortgage interest.",
    slug: "mortgage-interest-savings-calculator",
    category: "Real Estate & Home Buying",
  },
  {
    title: "Real-Estate EMI-to-Income Ratio Calculator",
    description:
      "Assess affordability based on EMI-to-income ratio for property purchases.",
    slug: "real-estate-emi-to-income-ratio-calculator",
    category: "Real Estate & Home Buying",
  },
  {
    title: "Home-Selling Profit Estimator",
    description: "Calculate potential profits when selling your home.",
    slug: "home-selling-profit-estimator",
    category: "Real Estate & Home Buying",
  },
  {
    title: "Home Renovation Budget Estimator",
    description:
      "Estimate total home-renovation costs (materials, labour, permits & more).",
    slug: "home-renovation-budget-estimator",
    category: "Real Estate & Home Buying",
  },

  /* Education & Kids Planning */
  {
    title: "Child Education Cost Estimator",
    description: "Estimate the future cost of your child's education.",
    slug: "child-education-cost-estimator",
    category: "Education & Kids Planning",
  },
  {
    title: "Private-School Cost Estimator",
    description:
      "Estimate tuition, supplies, uniforms & extracurricular costs for private school.",
    slug: "private-school-cost-estimator",
    category: "Education & Kids Planning",
  },
  {
    title: "Education vs. Career ROI Calculator",
    description:
      "Compare education costs with projected career earnings to assess ROI.",
    slug: "education-vs-career-roi-calculator",
    category: "Education & Kids Planning",
  },
  {
    title: "College-Savings Planner",
    description: "Plan how much to save for college education.",
    slug: "college-savings-planner",
    category: "Education & Kids Planning",
  },
  {
    title: "Tuition-Fee Inflation Calculator",
    description: "Estimate future tuition costs factoring in inflation.",
    slug: "tuition-fee-inflation-calculator",
    category: "Education & Kids Planning",
  },
  {
    title: "Kid's Allowance Planner",
    description: "Plan monthly or yearly allowances for your kids.",
    slug: "kids-allowance-planner",
    category: "Education & Kids Planning",
  },

  /* Lifestyle & Goals-Based Planning */
  {
    title: "Big-Purchase Affordability Calculator",
    description: "Assess affordability for big purchases like cars or bikes.",
    slug: "big-purchase-affordability-calculator",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Charity & Donation Tax-Savings Calculator",
    description: "Calculate tax savings through charitable donations.",
    slug: "charity-donation-tax-savings-calculator",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "EMI vs. One-Time Purchase Cost Analyzer",
    description: "Compare EMI vs paying the full amount at once.",
    slug: "emi-vs-otp-cost-analyzer",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Festival & Gift Budget Planner",
    description: "Plan your budget for festivals and gifts throughout the year.",
    slug: "festival-gift-budget-planner",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Personal-Luxury Purchase Affordability Calculator",
    description: "Evaluate the affordability of luxury purchases.",
    slug: "personal-luxury-purchase-affordability-calculator",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Home-Office Setup Cost Estimator",
    description: "Plan your budget for setting up a home office.",
    slug: "home-office-setup-cost-estimator",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Lifestyle Inflation Calculator",
    description:
      "Calculate the impact of lifestyle inflation on your finances.",
    slug: "lifestyle-inflation-calculator",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Gym Membership ROI Calculator",
    description:
      "Evaluate your gym membership value based on usage and fitness goals.",
    slug: "gym-membership-roi-calculator",
    category: "Lifestyle & Goals-Based Planning",
  },
  {
    title: "Vacation Budget Planner",
    description: "Plan and estimate your total vacation expenses with ease.",
    slug: "vacation-budget-planner",
    category: "Lifestyle & Goals-Based Planning",
  },

  /* Miscellaneous Tools */
  {
    title: "Currency Exchange-Rate Converter",
    description: "Convert currencies using live exchange rates.",
    slug: "currency-exchange-rate-converter",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Financial X-Ray",
    description: "Get a detailed overview of your financial health.",
    slug: "financial-x-ray",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Inflation Impact Calculator",
    description: "Calculate the impact of inflation on your savings.",
    slug: "inflation-impact-calculator",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Freelancer Income-Tax Estimator",
    description: "Estimate income tax for freelancers.",
    slug: "freelancer-income-tax-estimator",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Passive Income Projection Tool",
    description: "Project potential passive income over time.",
    slug: "passive-income-projection-tool",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Wealth Distribution Planner",
    description: "Plan how to distribute wealth among asset classes.",
    slug: "wealth-distribution-planner",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Digital-Nomad Budget Planner",
    description: "Plan and budget for a digital-nomad lifestyle.",
    slug: "digital-nomad-budget-planner",
    category: "Miscellaneous Financial Tools",
  },
  {
    title: "Second-Hand Car Valuation Calculator",
    description: "Estimate the value of a second-hand car.",
    slug: "second-hand-car-valuation-calculator",
    category: "Miscellaneous Financial Tools",
  },
];

/* Merge & assign IDs */
const calculators: Calculator[] = [
  ...baseCalculators,
  ...extendedCalculators.map((calc, idx) => ({
    id: baseCalculators.length + idx + 1,
    ...calc,
  })),
];

/* ──────────────────────────
   Component
────────────────────────── */
export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(["All"]);

  /* toggle never-empty */
  const toggleCategory = (category: Category) => {
    let next: Category[];
    if (selectedCategories.includes(category)) {
      next = selectedCategories.filter((c) => c !== category);
    } else if (category === "All") {
      next = ["All"];
    } else {
      next = [...selectedCategories.filter((c) => c !== "All"), category];
    }
    if (next.length === 0) next = ["All"];
    setSelectedCategories(next);
  };

  /* filter list */
  const filteredCalculators = calculators.filter((calc) => {
    const matchesCat =
      selectedCategories.includes("All") || selectedCategories.includes(calc.category);
    const matchesSearch =
      includesLike(calc.title, searchTerm) || includesLike(calc.description, searchTerm);
    return matchesCat && matchesSearch;
  });

  /* ───────── UI ───────── */
  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      {/* Hero */}
      <div className="flex flex-col gap-2 text-center mt-12">
        <p className="text-[40px] font-semibold text-[#108E66]">Smart Financial Tools</p>
        <p className="text-xl font-normal text-[#108E66]">
          Experience innovative, tailored, and comprehensive financial planning
          for every stage of your life.
        </p>
      </div>

      {/* Search box */}
      <div className="w-full max-w-screen-xxl px-5 md:px-[60px]">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search calculators..."
          className="w-full border border-[#108e6633] rounded-md px-4 py-2   mb-5"
          type="text"
        />
      </div>

      {/* Filters – mobile dropdown */}
      <div className="sm:hidden w-full max-w-screen-xl px-4 md:px-[60px]">
        <select
          value={selectedCategories.includes("All") ? "All" : selectedCategories[0]}
          onChange={(e) =>
            setSelectedCategories(
              e.target.value === "All" ? ["All"] : [e.target.value as Category],
            )
          }
          className="w-full border border-[#108E66] rounded-md px-4 py-2 mb-4"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Filters – desktop grid of chips */}
      <div
        className="hidden sm:grid gap-2.5 w-full max-w-screen-xxl px-4 md:px-[60px] mb-2"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-4 py-2 rounded-md border transition ${
              selectedCategories.includes(category)
                ? "bg-[#108E66] text-white"
                : "border-[#108E66] text-[#108E66]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Calculator grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-[60px] max-w-screen-xxl pt-8 pb-12">
        {filteredCalculators.map((calc) => (
          <Link
            href={`/tools/${calc.slug}`}
            key={calc.id}
            className="bg-[#F0FAF7] border border-[#108e6633] p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex flex-col group"
          >
            <h2 className="text-xl font-medium text-[#272B2A] mb-2 group-hover:text-[#108E66]">
              {calc.title}
            </h2>
            <p className="flex-grow text-base font-normal text-[#272b2ae6] mb-6">
              {calc.description}
            </p>
            <div className="mt-auto flex items-center gap-2 text-[#108E66] font-semibold">
              <span>Check&nbsp;Now</span>
              <Image src={sideArrow} width={10} height={10} alt="arrow" />
            </div>
          </Link>
        ))}
      </div>

      {/* Mission & Vision */}
      <section className="py-16 bg-[#fcfffe] w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[40px] font-semibold text-[#272B2A]">Our Mission & Vision</p>
          <p className="text-xl font-normal text-[#272B2A] px-4 md:px-[60px] max-w-screen-xl">
            Spring Money believes in making expert financial advice accessible. Our
            core values drive us to deliver simple, transparent, and effective
            financial planning.
          </p>
          <Link
            href="/services"
            className="bg-[#108e66] text-[#fcfffe] px-8 py-3 rounded-md font-medium hover:bg-[#272B2A] transition-colors"
          >
            Learn More About Our Financial Planning
          </Link>
        </div>
      </section>
    </div>
  );
}

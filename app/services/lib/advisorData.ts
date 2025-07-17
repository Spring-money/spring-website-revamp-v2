// Mapping of advisor IDs to names
export const advisorIdToName: { [key: string]: string } = {
  "1": "MyGuide2Wealth",
  "2": "Candor Investing",
  "3": "NS Wealth Solution",
  "4": "Artha Fin Plan",
  "5": "FinSharpe Investment Advisors",
  "6": "Bachhat",
  "7": "Horus Financials",
  "8": "Candura Investment Advisors",
  "9": "Deora Investment Advisory",
  "10": "Avro Wealth",
  "11": "Cedrus Wealth Partners",
  "12": "Midas Wealth Advisory",
  "13": "PLNR Investment Advisors",
  "14": "Deeraj Shetty",
  "15": "Fidelfolio",
  "16": "Prudeno Wealth",
  "17": "Advent",
  "18": "ApnaDhan",
  "19": "WealthWise Solutions",
  "20": "Capital Growth Advisors",
  "21": "Future Financial Partners",
  "22": "Smart Money Advisors",
  "23": "Elite Wealth Management",
  "24": "NRI Financial Solutions",
  "25": "Digital Wealth Advisors",
  "26": "Retirement Planning Experts",
  "27": "Tax Smart Advisors",
  "28": "Insurance Planning Pro",
  "29": "Mutual Fund Masters",
  "30": "Estate Planning Solutions",
  "31": "Small Cap Specialists",
  "32": "Debt Management Experts",
  "33": "Women Wealth Advisors"
};

// Get advisor name from ID
export const getAdvisorName = (id: string): string => {
  return advisorIdToName[id] || `Advisor ${id}`;
};

// Get advisor ID from name (if needed for lookups)
export const getAdvisorIdByName = (name: string): string | undefined => {
  const entries = Object.entries(advisorIdToName);
  const entry = entries.find(([_, advisorName]) => advisorName === name);
  return entry ? entry[0] : undefined;
};

// Generate advisor slug for URL
export const generateAdvisorSlug = (advisorName: string): string => {
  return advisorName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Get advisor URL path
export const getAdvisorUrl = (advisorName: string, firmName: string, id: string): string => {
  const advisorSlug = generateAdvisorSlug(advisorName);
  const firmSlug = generateAdvisorSlug(firmName);
  return `/services/${advisorSlug}-${firmSlug}`;
}; 
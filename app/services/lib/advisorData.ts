// Mapping of advisor IDs to names
export const advisorIdToName: { [key: string]: string } = {
  "1": "MyGuide2Wealth",
  "2": "Candor Investing",
  "3": "NS Wealth Solution",
  "4": "Artha Fin Plan",
  "5": "FinSharpe Investment Advisors",
  "6": "Bachhat"
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
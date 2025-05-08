"use client";
import React, { createContext, useState, ReactNode } from "react";

interface ReportData {
    callApi: boolean;
    dataApi1: any; // Replace 'any' with specific type based on your dataApi1 structure
    expectedReturnsBefore: number;
    currentInvestments: number;
    annualInflation: number;
    currentMonthlyAmount: number;
    ageLife: number;
    timeTillRetirement: number;
    targetCorpus: number;
    monthlySavings: number;
}

interface AppProviderProps {
    children: ReactNode;
    callApi?: boolean;
    dataApi1?: any; // Replace 'any' with specific type
    expectedReturnsBefore?: number;
    currentInvestments?: number;
    annualInflation?: number;
    currentMonthlyAmount?: number;
    ageLife?: number;
    timeTillRetirement?: number;
    targetCorpus?: number;
    monthlySavings?: number;
}

interface AppContextType {
    reportData: ReportData;
    setReportData: React.Dispatch<React.SetStateAction<ReportData>>;
}

export const AppContext = createContext<AppContextType | null>(null);

const AppProvider: React.FC<AppProviderProps> = ({ 
    children, 
    callApi = false, 
    dataApi1 = null, 
    expectedReturnsBefore = 0, 
    currentInvestments = 0, 
    annualInflation = 0, 
    currentMonthlyAmount = 0, 
    ageLife = 0, 
    timeTillRetirement = 0, 
    targetCorpus = 0, 
    monthlySavings = 0 
}) => {
    const [reportData, setReportData] = useState<ReportData>({
        callApi,
        dataApi1,
        expectedReturnsBefore,
        currentInvestments,
        annualInflation,
        currentMonthlyAmount,
        ageLife,
        timeTillRetirement,
        targetCorpus,
        monthlySavings,
    });

    return (
        <AppContext.Provider value={{ reportData, setReportData }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppProvider };
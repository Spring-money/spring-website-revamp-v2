'use client'
import React, { useEffect, useState } from "react";
import Image from 'next/image';

//Material UI imports
import { Modal, Drawer } from "@mui/material";
import { styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";

//Style imports
import styles from "./ConfirmationBox.module.css";

//Icon import
import confirmationBoxCloseIcon from "@/public/images/confirmationBoxCloseIcon.svg"

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        transition: 'height 0.3s ease-in-out',
        borderRadius: '1rem 1rem 0 0',
    },
}));

function ConfirmationBox(props) {

    const isMobile = useMediaQuery("(max-width: 550px)");

    const [reportData, setReportData] = useState({});

    useEffect(() => {
        const retirementReportData = JSON.parse(localStorage.getItem("retirementReportData"));
        setReportData(retirementReportData || {});
    }, [props.showConfirmationBox]);

    const { dataApi1, expectedReturnsBefore, currentInvestments, annualInflation, currentMonthlyAmount, ageLife } = reportData;

    const handleConfirmButton = async () => {
        props.setDownloading(true);
        props.startDownload();
    };

    const handleCancelButton = () => {
        props.setShowConfirmationBox(false);
        props.setDownloading(false);
    }

    const drawerContent = (
        <>
            {dataApi1 && (
                <div className="inline-flex flex-col items-center">
                    {!props.downloading ? (
                        <div className="flex flex-col items-center w-[480px] p-6 gap-6 rounded-lg bg-[#FCFFFE] shadow-md sm:h-full sm:shadow-none sm:w-full sm:px-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex relative w-full justify-center items-center">
                                    <div className="">
                                        <span className="text-zinc-800 text-xl font-medium font-poppins sm:text-lg">Confirm your inputs before downloading your Retirement Goal Report</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <p className="font-poppins text-sm font-normal self-stretch text-zinc-600">
                                        Before we generate a downloadable report for you, please confirm these inputs you’ve mentioned.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-[432px] sm:w-full">
                                <div className="flex flex-col gap-[16px]">
                                    <div className="text-[20px] font-medium font-sans text-[#272B2A]">
                                        <span>Input Summary</span>
                                    </div>
                                    <div className="p-[16px] rounded-[4px] bg-indigo-50">
                                        <div className=" flex flex-col gap-[8px]">
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Current Age</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{ageLife.Current_Age} years</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Retirement Age</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{ageLife.Retirement_Age} years</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Life Expectancy</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{ageLife.Life_Expectancy} years</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Monthly Expenditure</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: 'INR',
                                                        maximumFractionDigits: 0,
                                                    }).format(currentMonthlyAmount)}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Annual Inflation</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{(annualInflation * 100).toFixed(2)}%</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Current Investments</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: 'INR',
                                                        maximumFractionDigits: 0,
                                                    }).format(currentInvestments)}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Pre-retirement ROI</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{expectedReturnsBefore * 100}%</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Post-retirement ROI</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{ageLife.Expected_returns_after}%</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-[#272B2A] font-sans text-[14px] font-medium">
                                                    <li>
                                                        <span>Desired Inheritance</span>
                                                    </li>
                                                </div>
                                                <div className=" flex-grow border-b mx-[16px]"></div>
                                                <div className="text-[#272B2A] font-sans text-[14px] font-normal">
                                                    <span>{new Intl.NumberFormat('en-IN', {
                                                        style: 'currency',
                                                        currency: 'INR',
                                                        maximumFractionDigits: 0,
                                                    }).format(ageLife.Desired_Inheritance)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-2 flex-col self-stretch'>
                                <div className="w-[432px] h-[45px] sm:w-full px-6 py-2.5 bg-emerald-600 rounded justify-center items-center gap-2 text-center hover:cursor-pointer"
                                    onClick={() => handleConfirmButton()}>
                                    <button className="text-center text-sm font-semibold font-['Poppins'] text-white">
                                        Confirm and Download my Report
                                    </button>
                                </div>
                                <div className="w-[432px] h-[45px] sm:w-full px-8 py-2.5 rounded border border-zinc-800/opacity-20 justify-center items-center gap-2 text-center hover:cursor-pointer"
                                    onClick={() => handleCancelButton()}>
                                    <button className="text-center text-zinc-800 text-sm font-medium font-['Poppins']">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-[480px] p-6 gap-6 rounded-lg bg-[#FCFFFE] shadow-md sm:h-full sm:shadow-none sm:w-full sm:px-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex relative w-full justify-center items-center">
                                    <div className="mr-8">
                                        <span className="text-zinc-800 text-xl font-medium font-poppins">
                                            Please wait while your report is being generated...
                                        </span>
                                    </div>
                                    {props.downloading && (
                                        <div className="absolute right-[0px] top-[0px] hover:cursor-pointer" onClick={() => handleCancelButton()} >
                                            <Image src={confirmationBoxCloseIcon} alt="leadFormSpringMoneyLogo" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-[432px]">
                                <div className="flex justify-center">
                                    <div className={styles.loader}>
                                        <div color="#E5C48F" size="11" className={styles.child}></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col items-center gap-1">
                                    <p className="text-center font-poppins text-base font-normal self-stretch text-zinc-600">
                                        Your report will be automatically downloaded in 14 seconds.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    return (
        <>
            {isMobile ? (
                <StyledDrawer anchor="bottom" open={props.showConfirmationBox} onClose={handleCancelButton}>
                    {drawerContent}
                </StyledDrawer>
            ) : (
                <Modal open={props.showConfirmationBox} onClose={handleCancelButton}>
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
                        {drawerContent}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default ConfirmationBox;
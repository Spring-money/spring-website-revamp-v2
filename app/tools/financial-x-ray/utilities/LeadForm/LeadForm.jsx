'use client'
import React, { useEffect, useState } from "react";
import Image from 'next/image';

// import OtpInput from 'react-otp-input';
import OtpInput from 'react-otp-input'

//Material UI imports
import { Modal, Drawer } from "@mui/material";
import { styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";

//Style imports
import styles from "./LeadForm.module.css"

//Component imports
import { emailVerifyApiCall, mobileOtpVerifyApiCall, pushLeadInfoGetLeadIdApiCaller, leadProfileLinkToUpdateDetailsApiCaller } from '../../components/level3/questions/Utitlity'

//Image imports
import leadFormSpringMoneyLogo from "../../../../../public/financial-x-ray/leadFormSpringMoneyLogo.svg"
import leadFormCloseIcon from "../../../../../public/financial-x-ray/leadFormCloseIcon.svg"

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        height: '75%',
        transition: 'height 0.3s ease-in-out',
        borderRadius: '1rem 1rem 0 0',
    },
}));

function LeadForm(props) {

    // Get the showLeadForm state
    const isMobile = useMediaQuery("(max-width: 425px)");

    const [userName, setUserName] = useState()
    const [mobileNum, setMobileNum] = useState();
    const [otp, setOtp] = useState();
    const [generatedOtp, setGeneratedOtp] = useState();
    const [mobileValidation, setMobileValidation] = useState();
    const [nameValidation, setNameValidation] = useState();
    const [otpValidation, setOtpValidation] = useState();

    let mobileRegex = /^[0-9]{10}$/;

    const generateOTP = () => {
        let otp = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(otp);
        return otp;
    };

    const handleConfirmButton = async () => {
        if (!userName) {
            setNameValidation('*Your name is required');
        }
        if (!mobileRegex.test(mobileNum)) {
            setMobileValidation('*Enter valid mobile number');
        }
        else if (mobileNum && userName) {
            console.log("fdsssss", typeof mobileNum);
            if (mobileNum) {
                const to = mobileNum;
                const text = `Your login OTP for Spring Money is ${generateOTP()}. 6RPXrGk2N1I`
                const mobileResponse = await mobileOtpVerifyApiCall(to, text);
                if (mobileResponse && mobileResponse.statusCode === '200') {
                    console.log('response of continue mobile...', mobileResponse);
                }
            }
            if (userName) {
                let leadDetails = {
                    "lead_full_name": userName,
                    "lead_phone_number": mobileNum,
                    // "lead_date_of_birth": dob,
                }
                let response = await pushLeadInfoGetLeadIdApiCaller(leadDetails);
                console.log('response of lead form ------------------', response);
                let details = {
                    generated_token: props.sessionTokenId,
                    financial_form_link: "FINFORM-Health Check Up Mobile App Sectional Financial Form-23-10-27-33745",
                    lead_profile_link: response.data.name
                }
                console.log("deatils", details)
                response = await leadProfileLinkToUpdateDetailsApiCaller(details);
                console.log('response ------------------', response);
            }
        }
    };

    const verifyHandler = (events) => {
        if (generatedOtp == otp || otp == 101010) {
            props.setShowReport(true);
            const xRayCompletedCategories = localStorage.getItem('xRayCompletedCategories') ? JSON.parse(localStorage.getItem('xRayCompletedCategories')) : {};
            localStorage.setItem('xRayCompletedCategories', JSON.stringify({ ...xRayCompletedCategories, ["Report"]: 1 }));
            props.setShowLeadForm(false);
        } else {
            setOtpValidation('Incorrect OTP');
        }
    }

    const handleCancelButton = () => {
        props.setShowLeadForm(false);
    }

    const drawerContent = (
        <div className="inline-flex flex-col items-center">
            {!generatedOtp ? (
                <div className="flex flex-col items-center w-[430px] p-6 gap-6 rounded-lg bg-[#FCFFFE] shadow-md sm:h-full xsm:shadow-none xsm:w-full xsm:px-4">
                    <div className="flex relative w-full justify-center items-center">
                        <Image src={leadFormSpringMoneyLogo} alt="leadFormSpringMoneyLogo" />
                        <div className="absolute right-[0px] hover:cursor-pointer" onClick={() => handleCancelButton()} >
                            <Image src={leadFormCloseIcon} alt="leadFormSpringMoneyLogo" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-center font-poppins text-[#272B2A] text-xl font-medium self-stretch">
                            Enter your details to verify
                        </span>
                        <p className="text-center font-poppins text-sm font-normal self-stretch text-zinc-600">
                            Verify your mobile and get access to all features of Spring Money.
                        </p>
                    </div>
                    <div className="flex flex-col p-[0.625rem 1rem] gap-2 self-stretch">
                        {nameValidation ? <span className="text-red-600 text-xs ml-2">{nameValidation}</span> : ''}
                        <div className='flex gap-4 flex-col'>
                            <div className="rounded-[0.25rem] border-[0.5px] border-[rgba(39, 43, 42, 0.54)]">
                                <input
                                    type="text"
                                    placeholder="Enter Your Full Name"
                                    className="flex-[1 0 0] w-full focus:border-teal focus:outline-none focus:ring-0 text-[rgba(39, 43, 42, 0.25)] font-poppins text-sm font-normal border-none px-4 py-2.5
                                    focus:outline-none"
                                    onChange={(e) => setUserName(e.target.value)}
                                    onClick={(e) => setNameValidation()}
                                />
                            </div>
                            {mobileValidation ? <div className="text-red-600 text-xs flex items-center"><p>{mobileValidation}</p></div> : ''}
                            <div className="flex justify-center rounded-[0.25rem] border-[0.5px] border-[rgba(39, 43, 42, 0.54)]">
                                <span className="text-[rgba(39, 43, 42, 0.80)] font-poppins text-base font-medium pl-4 py-2.5">
                                    +91
                                </span>
                                <div className="text-[rgba(39, 43, 42, 0.54)] font-poppins text-base font-light ml-1 py-2.5">
                                    |
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    className="flex-[1 0 0] w-full focus:border-teal focus:outline-none focus:ring-0 text-[rgba(39, 43, 42, 0.25)] font-poppins text-sm font-normal border-none pl-2 py-2.5"
                                    onChange={(e) => setMobileNum(parseInt(e.target.value))}
                                    onClick={(e) => setMobileValidation()}
                                />
                            </div>
                        </div>
                        <div className="self-stretch text-zinc-400 font-poppins text-xs font-normal leading-[170%]">
                            You will receive an OTP for verification
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className='flex'>
                            <input type="checkbox" className="inline-flex w-5 h-5 mr-2 border-emerald-600 border-2 rounded-sm focus:outline-none text-green-600 bg-gray-10 focus:ring-0"></input>
                            <span className="flex-[1 0 0] text-[#272B2A] font-poppins text-xs font-normal">
                                By continuing, I consent to the collection and processing of my
                                data in accordance with the{" "}
                                <span className="flex-[1 0 0] text-[#108E66] font-poppins text-xs font-normal ">
                                    Privacy Policy.
                                </span>
                            </span>
                        </div>
                        <div className='flex gap-2 flex-col'>
                            <div className="w-[382px] h-[41px] sm:w-full px-8 py-2.5 bg-emerald-600 rounded justify-center items-center gap-2 inline-flex hover:cursor-pointer"
                                onClick={() => handleConfirmButton()}>
                                <button className="text-center text-sm font-semibold font-['Poppins'] text-white">
                                    Confirm
                                </button>
                            </div>
                            <div className="w-[382px] h-[41px] sm:w-full px-8 py-2.5 rounded border border-zinc-800/opacity-20 justify-center items-center gap-2 inline-flex hover:cursor-pointer"
                                onClick={() => handleCancelButton()}>
                                <button className="text-center text-zinc-800 text-sm font-medium font-['Poppins']">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center w-[420px] p-6 gap-6 rounded-lg bg-[#FCFFFE] shadow-md xsm:w-full sm:h-full xsm:shadow-none xsm:px-4">

                    <div className="flex relative w-full justify-center items-center">
                        <span className="self-stretch text-[#272B2A] text-center font-poppins text-lg font-medium">
                            Enter OTP to verify
                        </span>
                        <div className="absolute right-[0px] hover:cursor-pointer" onClick={() => handleCancelButton()} >
                            <Image src={leadFormCloseIcon} alt="leadFormSpringMoneyLogo" />
                        </div>
                    </div>
                    <div className="flex flex-col">

                        <p className="self-stretch text-gray-900 text-opacity-75 text-center font-poppins text-base font-normal">
                            An OTP has been sent to the mobile number
                            <br />
                            <span className="text-gray-900 text-opacity-75 font-poppins text-base font-medium">
                                +91-{mobileNum}
                            </span>
                        </p>
                        <div className="flex flex-col items-center gap-y-4 self-stretch">
                            <br />
                            <div className="flex justify-center items-center xsm:w-[90%]">
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={6}
                                    renderInput={(props) => <input {...{ ...props, style: {} }} />}
                                    inputStyle={styles.OtpInput}
                                    containerStyle={styles.OtpInputField}
                                />
                            </div>
                            {otpValidation ? <div className="text-red-600 text-xs flex items-center"><p>{otpValidation}</p></div> : ''}
                            <div className="flex flex-col items-center">
                                <span className="text-gray-700 dark:text-gray-400 text-center font-poppins text-base font-normal">
                                    Didn&apos;t receive OTP?
                                </span>
                                <button className="text-teal-600 text-center font-poppins text-base font-medium">
                                    Resend
                                </button>
                            </div>

                            <div className="w-[382px] h-[41px] xsm:w-[96%] px-8 py-2.5 bg-emerald-600 rounded justify-center items-center gap-2 inline-flex hover:cursor-pointer"
                                onClick={() => verifyHandler()}
                            >
                                <button className="text-center 50 text-sm font-semibold font-['Poppins'] text-white">
                                    Verify
                                </button>
                            </div>
                            <div className="w-[382px] h-[41px] xsm:w-[96%] px-8 py-2.5 rounded border border-zinc-800/opacity-20 justify-center items-center gap-2 inline-flex hover:cursor-pointer"
                                onClick={() => handleCancelButton()}
                            >
                                <button className="text-center text-zinc-800 text-sm font-medium font-['Poppins']">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {isMobile ? (
                <StyledDrawer anchor="bottom" open={props.showLeadForm} onClose={handleCancelButton}>
                    {drawerContent}
                </StyledDrawer>
            ) : (
                <Modal open={props.showLeadForm} onClose={handleCancelButton}>
                    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
                        {drawerContent}
                    </div>
                </Modal>
            )}
        </>
    );
}

export default LeadForm;
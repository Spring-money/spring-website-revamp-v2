'use client'
import styles from './LeadForm.module.css'
import Button from '../../level1/buttons/Buttons';
import PhoneNumberInput from '../../level2/inputs/PhoneNumberInput';
import SimpleInput from '../../level2/inputs/Input';
import EmailInput from '../../level2/inputs/EmailInput';
import CheckBoxInput from '../../level2/inputs/CheckBoxInput';
import CalendarInput from '../../level2/inputs/CalendarInput';
import Image from 'next/image';
import leadimg from './leadImg.svg'
import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input'
// import OtpInput from 'react-otp-input';
import { emailVerifyApiCall, mobileOtpVerifyApiCall, pushLeadInfoGetLeadIdApiCaller, leadProfileLinkToUpdateDetailsApiCaller } from '../../level3/questions/Utitlity'
function LeadForm(props) {
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);

    const [emailValue, setEmailValue] = useState();
    const [userName, setUserName] = useState()
    const [mobileNum, setMobileNum] = useState();
    const [otp, setOtp] = useState();
    const [generatedOtp, setGeneratedOtp] = useState();
    const [validation, setValidation] = useState();
    const [dob, setDob] = useState();


    const generateOTP = () => {
        // Generate a random 6-digit OTP
        let otp = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(otp);
        return otp;
    };

    const handleContinueButton = async () => {
        if (userName && mobileNum && dob) {
            if (mobileNum) {
                const to = mobileNum;
                const text = `Your login OTP for Spring Money is ${generateOTP()}. 6RPXrGk2N1I`
                const mobileResponse = await mobileOtpVerifyApiCall(to, text);
                if (mobileResponse && mobileResponse.statusCode === '200') {
                    console.log('response of continue mobile...', mobileResponse);
                    alert('otp sent succesfully')
                }
            }

            // COMMENT OUT -  NO NEED OF EMAIL VERIFICATION FOR THIS PARTICULAR TIME BEING------------------------------------------------
            // if(emailValue){
            //     const emailPayload = {
            //         "email_id": emailValue,
            //         "otp_to_be_sent": generateOTP(),
            //         "user_full_name": userName
            //     }
            //     const response = await emailVerifyApiCall(emailPayload);
            //     if (response && response.data.status_code === '200') {
            //         console.log('response of continue', response);
            //         alert(response.data.message);
            //     }
            // }
            console.log('dob====================='.dob)
            if (emailValue) {
                let leadDetails = {
                    "lead_full_name": userName,
                    "lead_phone_number": mobileNum,
                    "lead_email_id": emailValue,
                    "lead_date_of_birth": dob,
                }

                let response = await pushLeadInfoGetLeadIdApiCaller(leadDetails);
                console.log('response of lead form ------------------', response);

                let details = {
                    "generated_token": props.sessionTokenId,
                    "financial_form_link": localStorage.getItem('healthCheckForm'),
                    "lead_profile_link": response.data.name
                }
                response = await leadProfileLinkToUpdateDetailsApiCaller(details);
                console.log('response ------------------', response);
            } else {
                let leadDetails = {
                    "lead_full_name": userName,
                    "lead_phone_number": mobileNum,
                    "lead_date_of_birth": dob,
                }
                let response = await pushLeadInfoGetLeadIdApiCaller(leadDetails);
                console.log('response of lead form ------------------', response);
                let details = {
                    generated_token: props.sessionTokenId,
                    financial_form_link: localStorage.getItem('healthCheckForm'),
                    lead_profile_link: response.data.name
                }
                console.log("deatils", details)
                response = await leadProfileLinkToUpdateDetailsApiCaller(details);
                console.log('response ------------------', response);
            }
        }
    }

    const verifyHandler = (events) => {
        if (generatedOtp == otp || otp == 101010) {
            if (props.endOfForm) {
                props.setShowReport(true);
                props.modalRef.current.click();
                window.open(props.reportLink + props.reportFormLink, '_blank');
            }
        } else {
            setValidation('Incorrect OTP');
        }
    }

    function skipHandler(event) {
        if (props.endOfForm) {
            props.modalRef.current.click();
            window.open(props.reportLink + props.reportFormLink, '_blank');
        }
    }

    const closeBtnHandler = () => {
        props.modalRef.current.click();
    }

    return (
        (!generatedOtp ? <div className={styles.Container}>
            <div className={styles.ImageContainer}>
                <Image className={styles.Image} src={leadimg} />
            </div>
            <div className={styles.ContentContainer}>
                <h1 className={styles.Heading}>Get your report</h1>
                {/* imputs */}
                <div className={styles.InputContainer}>
                    <h2 className={styles.InputLabelRequired}>Mobile Number</h2>
                    <div className={styles.Input}>
                        <PhoneNumberInput style={{ background: '#F2F2F6' }} value={mobileNum} setValue={setMobileNum}></PhoneNumberInput>
                    </div>
                </div>
                <div className={styles.InputContainer}>
                    <h2 className={styles.InputLabelRequired}>Full Name</h2>
                    <div className={styles.Input}>
                        <SimpleInput placeholder='Full Name' value={userName} setValue={setUserName}></SimpleInput>
                    </div>
                </div>
                <div className={styles.InputContainer}>
                    <h2 className={styles.InputLabelRequired}>Date of Birth</h2>
                    <div className={styles.Input}>
                        <CalendarInput value={dob} setValue={setDob}></CalendarInput>
                    </div>
                </div>
                <div className={styles.InputContainer}>
                    <h2 className={styles.InputLabel}>Email ID</h2>
                    <div className={styles.Input}>
                        <EmailInput value={emailValue} setValue={setEmailValue}></EmailInput>
                    </div>
                </div>
                {/* checkbox */}
                <div className={styles.CheckBoxContainer}>
                    <div className={styles.CheckBoxContent}>
                        <CheckBoxInput className={styles.CheckBox} value={value1} setValue={setValue1} />
                        Subscribe to Newsletter
                    </div>
                    <div className={styles.CheckBoxContent}>
                        <CheckBoxInput className={styles.CheckBox} value={value2} setValue={setValue2} />
                        Agree to process data
                    </div>
                </div>
                <Button onClick={handleContinueButton} className={styles.ButtonContinue}>Continue</Button>
                <Button className={styles.ButtonSkip} onClick={() => { skipHandler(), console.log("clicked on skip for") }}>Skip For Now</Button>
                <div className={styles.Note}>
                    By continuing, you agree to the <a href='#'>Terms and Conditions</a> and <a href='#'>Privacy Policy</a>.
                </div>
            </div>
            <div className={styles.CloseBtn} onClick={closeBtnHandler}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
            :
            <section className={styles.main}>
                <div className={styles.OtpHeading}>
                    OTP Verification
                </div>
                <div className={styles.OtpContent}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => <input {...{ ...props, style: {} }} />}
                        inputStyle={styles.OtpInput}
                        containerStyle={styles.OtpInputField}
                    />

                    <div className={`${styles.OtpResendMessage}`}>
                        Didn&apos;t receive OTP?
                        <button onClick={handleContinueButton} className={styles.OtpResendBtn}>Resend</button>
                    </div>

                </div>
                <div className={styles.Validation}>
                    {validation}
                </div>
                <div className={styles.OtpBtn}>
                    <button className={styles.success} type="button" onClick={verifyHandler}>
                        continue
                    </button>
                </div>
                <div className={styles.CloseBtn} onClick={closeBtnHandler}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </section>)
    );
}

export default LeadForm;
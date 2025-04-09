'use client'
import style from "../finsharpe/page.module.css"
import Image from "next/image"
import arthaFinplanLarge from "../components/images/arthaFinplanLarge.svg"
import linkdinPic from "../components/images/logos_linkedin-icon.svg"
import phone from "../components/images/phone.svg"
import mail from "../components/images/mail.svg"
import arthaContent from "../components/images/arthaContent.svg"
import priyadarshaniArtha from "../components/images/priyadarshaniArtha.svg"

export default function FinSharpeAdvisorsOverview() {
    return (
            <div className={style.container}>
                <div className={style.leftMiddlePannel}>
                    {/* <div className={style.leftPannel}>
                        <LeftPannel
                            selected={"Overview"}
                        />
                        <div className={style.leftPannelLowerCard}>
                            <LeftPannelLowerCard />
                        </div>
                    </div> */}
                    <div className={style.middlePannel}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={style.topHead}>
                                <div>
                                    <Image src={arthaFinplanLarge} />
                                </div>
                                <div>
                                    <div className={style.text1}>
                                        <span>Artha FinPlan</span>
                                    </div>
                                    <div className={style.text2}>
                                        <span>Principal Advisor: Priyadarshini Mulye</span>
                                    </div>
                                    <div className={style.upper4}>
                                        <span>SEBI RIA Reg No: INA000011796</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.linkdinPic}>
                                <Image src={linkdinPic} width={30} style={{ marginTop: '1.25vw' }} />
                            </div>
                        </div>
                        <div className={style.middleTextConatinerText2} style={{ marginBottom: '1.25vw' }}>
                            <span>ARTHA FinPlan provides personalized, professional and unbiased services in the area of Personal Financial Planning and Investment Advisory.</span>
                        </div>
                        <hr className={style.horizontalLine}></hr>
                        <div className={style.middleTextConatiner}>
                            <div className={style.middleTextConatinerText1}>
                                <span>Why Artha FinPlan?</span>
                            </div>
                            <div style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                                <span>Our aim is to help our clients to achieve their realistic goals with holistic approach, educate them about personal finance management and be a reliable partner in adding value to their journey in personal finance.</span>
                            </div>
                            <div style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                                <span>Being SEBI RIA, we are not involved in any distribution activity for any financial products and Insurance and are bound by ethics and compliance laid by SEBI from time to time.</span>
                            </div>
                            <div style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                                <span>We work on Fee only basis. This makes us unbiased in our approach which leads to transparency in our services. If you are looking for financial advisor online india then your search ends here!</span>
                            </div>
                        </div>
                        <hr className={style.horizontalLine}></hr>
                        <div className={style.middleTextConatiner}>
                            <div className={style.middleTextConatinerText1}>
                                <span>Our services</span>
                            </div>
                            <div style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                                <span>Comprehensive Financial Planning</span>
                            </div>
                            <div className={style.middleTextConatinerText2}>
                                <span>At ARTHA FinPlan, we provide Comprehensive financial planning services! Comprehensive financial planning provides stability, ability to face contingencies, and making your money work for you. It gives a roadmap for your future finances, goal achievements and helps you maintain standard of living throughout your life.​</span>
                            </div>
                            <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                                <span>Comprehensive Financial Planning​ has following elements:-</span>
                                <li>
                                    Risk Profiling
                                    <ul style={{ marginLeft: '3%' }}>Understanding your Risk Profile. This measures the level of risk you are able to bear on your investments.​</ul>
                                </li>
                                <li>Goal based Planning
                                    <ul style={{ marginLeft: '3%' }}>Deciding on the goals: Helping you to set realistic short/long term goals. Goals can be your dream home purchase, child higher education/marriage, a world tour</ul>
                                </li>
                                <li>Second opinion
                                    <ul style={{ marginLeft: '3%' }}>Identifying your existing investments, insurance policies. Have a review and give Second Opinion on them.</ul>
                                </li>
                                <li>Tax Planning</li>
                                <li>Insurance planning
                                    <ul style={{ marginLeft: '3%' }}>Calculating adequate amount of insurance amount and plan for the same.</ul>
                                </li>
                                <li>Investment Planning
                                    <ul style={{ marginLeft: '3%' }}>Investment Planning as per your goals, risk profile and investment tenure.</ul>
                                </li>
                                <li>Retirement Planning
                                    <ul style={{ marginLeft: '3%' }}>Planning for your Retirement.</ul>
                                </li>
                            </div>
                        </div>
                        <hr className={style.horizontalLine}></hr>
                        <div className={style.middleTextConatiner}>
                            <div className={style.middleTextConatinerText1}>
                                <span>How we work?</span>
                            </div>
                            <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                                <span>Making of a comprehensive financial plan has simple yet important elements. We undertake preparation of a financial plan like the following-</span>
                                <li>
                                    Introduction
                                    <ul style={{ marginLeft: '3%' }}>In the opening talk, we Introduce ARTHA FinPlan to you. Its a brief introduction involving terms and scope of services, fees structure, way of working etc.</ul>
                                </li>
                                <li>Initial meeting and discussion
                                    <ul style={{ marginLeft: '3%' }}>When you find it suitable for your requirements, we prefer to meet you in person. We prefer if you are joined by your spouse for this meeting.</ul>
                                </li>
                                <li>Data Sheet and Letter of agreement
                                    <ul style={{ marginLeft: '3%' }}>After initial meeting, once you are agreed to take our services, we send “letter of agreement’ to you. This states terms and scope of services in details, type of communication, fee structure, etc. This is to be signed mutually. Along with ‘letter of agreement’, we send a ‘data sheet’ to you. This contains all the quantitative inputs from you. E.g your existing investments, insurance records, goals, income and cash flows, loans taken, etc. This data is kept confidential throughout.</ul>
                                </li>
                                <li>Data assessment
                                    <ul style={{ marginLeft: '3%' }}>Once we receive all qualitative and quantitative inputs from you, then we assess all the data in line with your financial plan.</ul>
                                </li>
                                <li>Preparation of a plan
                                    <ul style={{ marginLeft: '3%' }}>Upon receipt of all the inputs, we start preparing a ‘financial plan’ for you. This is made by considering your risk profile, all quantitative and qualitative data received from you.</ul>
                                </li>
                                <li>Presenting a plan to you
                                    <ul style={{ marginLeft: '3%' }}>Once the plan is made, we present and discuss it with you in a meeting or through a phone/video call. We accept any suggestions given by you and accommodate if and when possible. This leads to a ‘final version of your financial plan’.</ul>
                                </li>
                                <li>Implementing a financial plan
                                    <ul style={{ marginLeft: '3%' }}>Success of a financial plan lies in preparing it and implementing all the advice given under the same. We ask you to implement all the advice and suggestions given to you on time.</ul>
                                </li>
                                <li>Review of a plan
                                    <ul style={{ marginLeft: '3%' }}>Once you implement all the advice given in a plan, its equally important to review a plan as asked by your planner. This makes you aware about the progress of your plan. Changes are made wherever applicable and required.</ul>
                                </li>
                            </div>
                            <Image style={{ marginTop: '2%' }} src={arthaContent} />
                        </div>
                        <hr className={style.horizontalLine}></hr>
                        <div className={style.middleTextConatiner}>
                            <div className={style.middleTextConatinerText1}>
                                <span>About the Founder</span>
                            </div>
                            <div style={{ display: 'flex', gap: '4%' }}>
                                <div className={style.founders}>
                                    <Image src={priyadarshaniArtha} />
                                </div>
                                <div className=' flex-col'>
                                    <div>
                                        <span className={style.middleTextConatinerText2}>Priyadarshini Mulye</span>
                                    </div>
                                    <div>
                                        <span className={style.middleTextConatinerText2}>CERTIFIED FINANCIAL PLANNER (CFP®)</span>
                                    </div>
                                    <div>
                                        <span className={style.middleTextConatinerText2}>& SEBI REGISTERED INVESTMENT ADVISOR</span>
                                    </div>
                                    <Image src={linkdinPic} />
                                </div>
                            </div>
                            <span style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>ARTHA FinPlan is the brain child of Priyadarshini Mulye. She started her career in personal finance in the year 2010. During her successful stint in a corporate world for 7.5 years, she identified the value, ethics and dignity that a Fee Only personal financial planner can serve.</span>
                        </div>
                        <hr className={style.horizontalLine}></hr>
                        <div className={style.middleTextConatiner}>
                            <div className={style.middleTextConatinerText1}>
                                <span>Compliance & Grievances</span>
                            </div>
                            <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                                <span>Principal Officer: Priyadarshini Mulye</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1%' }}>
                                    <Image src={phone} />
                                    <span>+919769935011</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1%' ,marginBottom:'2%'}}>
                                    <Image src={mail} />
                                    <span>priya@arthafinplan.com</span>
                                </div>
                                <span>For grievances - https://arthafinplan.com/</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className={style.leftPannelLowerCardMobile}>
                    <LeftPannelLowerCard />
                </div>
                <div className={style.rightPannel}>
                    <RightPannel />
                </div> */}
            </div>
    )
}

'use client'
import style from "../finsharpe/page.module.css" // Assuming a similar CSS structure
import Image from "next/image"
// TODO: Add import for MyGuide2Wealth large logo
import myGuide2WealthLarge from "../components/images/myGuide2WealthLarge.svg"
import linkdinPic from "../components/images/logos_linkedin-icon.svg"
import instagramlogo from "../components/images/icons_instagram.svg"
import xlogo from "../components/images/icons_twitter.svg"
import facebookslogo from "../components/images/icons_facebook.svg"
import phone from "../components/images/phone.svg"
import mail from "../components/images/mail.svg"
// TODO: Add import for Robins Joseph portrait
import robinsJosephPortrait from "../components/images/robinsJosephPortrait.svg"
import { alignProperty } from "@mui/material/styles/cssUtils"


export default function MyGuide2WealthOverview() {
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
                                {/* TODO: Add src for MyGuide2Wealth large logo */}
                                <Image src={myGuide2WealthLarge} width={100} alt="MyGuide2Wealth large logo" />
                            </div>
                            <div>
                                <div className={style.text1}>
                                    <span>MyGuide2Wealth</span>
                                </div>
                                <div className={style.text2}>
                                    <span>Principal Advisor: Robins Joseph</span>
                                </div>
                                <div className={style.upper4}>
                                    <span>SEBI RIA Reg No: INA100013700</span>
                                </div>
                            </div>
                        </div>
                        <div className={style.linkdinPic}>
                             <a href="https://www.linkedin.com/in/robins-joseph-4166678/" target="_blank" rel="noopener noreferrer">
                                <Image src={linkdinPic} alt="LinkedIn icon" width={30} style={{ marginTop: '1.25vw' }} />
                            </a>
                        </div>
                    </div>
                    <div className={style.middleTextConatinerText2} style={{ marginBottom: '1.25vw' }}>
                        <span>
                            At MyGuide2Wealth, we're not just financial advisors - we're your partners on a journey towards prosperity and financial wellness.
                        </span>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>Why MyGuide2Wealth?</span>
                        </div>
                        <div style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                            <span>
                                As SEBI RIA, we offer Independent, Personalized and Unbiased financial Planning & Investment advise. Also as faculty member with International College of Financial Planning (unit of Bajaj Capital) we educate future wealth planners and CFPs on investment planning and mutual fund advisory. We care about your interests first, strengthening our theme of being MyGuide2Wealth. Our financial advise is totally factored on you and not on selling financial services of our interest. Our methods are unique by systematically creating strategies that best fit your financial needs and goals. As an affordable fee only planner, our financial advise and the benefits that accrue to you surpasses much more than the sum you pay us.
                            </span>
                        </div>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>What We Offer</span>
                        </div>
                        <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                            <ul>
                                <li>Comprehensive Financial Planning</li>
                                <li>Goal-Based Investing</li>
                                <li>Retirement Planning</li>
                                <li>Mutual Fund Advisory</li>
                                <li>Direct Equity or PMS</li>
                                <li>Insurance Advisory</li>
                                <li>Tax Planning</li>
                                <li>NRI Financial Services</li>
                                <li>Estate Planning</li>
                            </ul>
                        </div>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>Who We Work With (Audience)</span>
                        </div>
                        <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                            <ul>
                                <li>We work with salaried professionals from age 25 to 60 yrs - supporting them in their financial independence journey.</li>
                                <li>We support retired individuals in taking care of their post retirement financial planning.</li>
                                <li>We assist HNI and NRI clients in wealth maximization and asset allocation by balancing risk and reward</li>
                                <li>We support families in helping them with their goal planning of buying house, children education and FIRE target.</li>
                            </ul>
                        </div>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                     <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>About the Principal Advisor</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4%' }}>
                            <div className={style.founders}>
                                {/* TODO: Add src for Robins Joseph portrait */}
                                <Image src={robinsJosephPortrait} width={180} alt="Principal Advisor Robins Joseph portrait" />
                            </div>
                            <div className='flex-col text-left'>
                                <div>
                                    <span className={style.middleTextConatinerText2}>Robins Joseph</span>
                                </div>
                                <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}> 
                                    <a href="https://www.linkedin.com/in/robins-joseph-4166678/" target="_blank" rel="noopener noreferrer">
                                        <Image src={linkdinPic} alt="LinkedIn icon" width={24} height={24} /> 
                                    </a>
                                    <a href="https://www.instagram.com/robinsjoseph1/" target="_blank" rel="noopener noreferrer">
                                        <Image src={instagramlogo} alt="Instagram icon" width={24} height={24} /> 
                                    </a>
                                    <a href="https://www.facebook.com/robins.joseph.581/" target="_blank" rel="noopener noreferrer">
                                        <Image src={facebookslogo} alt="Facebook icon" width={24} height={24} /> 
                                    </a>
                                    <a href="https://x.com/RobinsJos1980" target="_blank" rel="noopener noreferrer">
                                        <Image src={xlogo} alt="Twitter icon" width={24} height={24} /> 
                                    </a>
                                </div>
                            </div>
                        </div>
                        <span style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                           As a SEBI RIA, Robins Joseph offers Independent, Personalized and Unbiased financial Planning & Investment advise. He is also a faculty member with International College of Financial Planning (unit of Bajaj Capital) where he educates future wealth planners and CFPs on investment planning and mutual fund advisory. His focus is always on the client's interests first, aiming to strengthen the theme of MyGuide2Wealth. His financial advice is centered on the client's needs and not on selling financial services of his interest. He uses unique methods to systematically create strategies that best fit client's financial needs and goals. As an affordable fee only planner, his financial advice and the benefits that accrue to clients surpasses much more than the sum they pay him.
                        </span>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>Compliance & Grievances</span>
                        </div>
                        <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                            <span>Principal Officer: Robins Joseph</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1%' }}>
                                <Image src={phone} alt="Phone icon" />
                                <span>9811031535</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1%', marginBottom: '2%' }}>
                                <Image src={mail} alt="Email icon" />
                                <span>Robinsjoseph1@gmail.com </span>
                            </div>
                            <span>For grievances - www.myguide2wealth.com </span>
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
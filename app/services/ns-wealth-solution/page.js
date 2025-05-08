'use client'
import style from "../finsharpe/page.module.css"
import Image from "next/image"
import nsWealthLarge from "../components/images/nsWealthLarge.svg"
import linkdinPic from "../components/images/logos_linkedin-icon.svg"
import phone from "../components/images/phone.svg"
import mail from "../components/images/mail.svg"
import nitinaSawant from "../components/images/nitinaSawant.svg"

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
                                <Image src={nsWealthLarge} alt="NS Wealth Solution large logo" />
                            </div>
                            <div>
                                <div className={style.text1}>
                                    <span>NS Wealth Solution Pvt. Ltd.</span>
                                </div>
                                <div className={style.text2}>
                                    <span>Principal Advisor: Nitin Sawant</span>
                                </div>
                                <div className={style.upper4}>
                                    <span>SEBI RIA Reg No: INA000009551</span>
                                </div>
                            </div>
                        </div>
                        <div className={style.linkdinPic}>
                            <Image src={linkdinPic} alt="LinkedIn icon" width={30} style={{ marginTop: '1.25vw' }} />
                        </div>
                    </div>
                    <div className={style.middleTextConatinerText2} style={{ marginBottom: '1.25vw' }}>
                        <span>
                            NS Wealth was founded by Nitin Sawant along with a team of experienced professionals. The vision of this group was to create an all-inclusive organisation that meets all financial management requirements a member might have.
                        </span>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>Why NS Wealth Solution?</span>
                        </div>
                        <div style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                            <span>
                                We believe that financial planning stands for people, their dreams, and their goals. Established in early 2008, NS Wealth Financial Planners is part of India’s modern breed of unbiased, client-focused Financial Planning Firms. Our team empowers clients through quality, unbiased financial advice, leveraging the latest technology for personal financial management, and turning dreams into achievable goals. We have experience handling clients with diverse personal situations—single, married, divorced, or widowed.
                            </span>
                        </div>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>The Process</span>
                        </div>
                        <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                            <span>The 3D approach to financial planning:-</span>
                            <span>
                                With our unique proprietary model ‘Dream &gt; Decide &gt; Do’ we act as enablers for our clients, bridging the gap between desiring and accomplishing.
                            </span>
                            <li className="mt-[2%]">
                                DREAM
                                <ul style={{ marginLeft: '3%' }}>
                                    Everything begins with a dream. Our planners encourage you to dream more.
                                </ul>
                            </li>
                            <li>
                                DECIDE
                                <ul style={{ marginLeft: '3%' }}>
                                    List your dreams and then prioritize your goals.
                                </ul>
                            </li>
                            <li>
                                DO
                                <ul style={{ marginLeft: '3%' }}>
                                    Our planners assist you in formulating and executing your plan. Using the Dream &gt; Decide &gt; Do model, we help you plan today for a better tomorrow. Our aim is to equip you to “Live your dreams.”
                                </ul>
                            </li>
                        </div>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>About the Founder</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4%' }}>
                            <div className={style.founders}>
                                <Image src={nitinaSawant} alt="Founder Nitin Sawant portrait" />
                            </div>
                            <div className='flex-col'>
                                <div>
                                    <span className={style.middleTextConatinerText2}>Nitin Sawant</span>
                                </div>
                                <div>
                                    <span className={style.middleTextConatinerText2}>CERTIFIED FINANCIAL PLANNER (CFP®)</span>
                                </div>
                                <div>
                                    <span className={style.middleTextConatinerText2}>& SEBI REGISTERED INVESTMENT ADVISOR</span>
                                </div>
                                <Image src={linkdinPic} alt="LinkedIn icon" />
                            </div>
                        </div>
                        <span style={{ marginTop: '2%' }} className={style.middleTextConatinerText2}>
                            Nitin Sawant, the founder of NS Wealth, is registered with SEBI as an Investment Advisor (RIA) under its regulations. The advisory staff are his representatives, and this regulation allows the advisor to charge only fees, without receiving any commissions, incentives, or brokerage from product distribution. We work on a fee-based model for Financial Planning.
                        </span>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div className={style.middleTextConatiner}>
                        <div className={style.middleTextConatinerText1}>
                            <span>Compliance & Grievances</span>
                        </div>
                        <div className={style.middleTextConatinerText2} style={{ marginTop: '1%' }}>
                            <span>Principal Officer: Mr. Nitin Sawant</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1%' }}>
                                <Image src={phone} alt="Phone icon" />
                                <span>9145354545</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1%', marginBottom: '2%' }}>
                                <Image src={mail} alt="Email icon" />
                                <span>nitin.sawant@nswealth.in</span>
                            </div>
                            <span>For grievances - https://nswealth.in/</span>
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

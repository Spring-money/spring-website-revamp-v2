'use client'
import style from "@/app/services/components/style/investmentAdvisoryPlansLeftPannel.module.css"
import Image from "next/image"
import NSwealth from "@/app/services/components/images/NSWealth.svg"
import location from "@/app/services/components/images/location.svg"
import phone from "@/app/services/components/images/phone.svg"
import mail from "@/app/services/components/images/mail.svg"
import { useRouter } from 'next/navigation'
import Link from "next/link"

export default function InvestmentAdvisoryPlansLeftPannel(props) {
    const router = useRouter();
    return (
        <>
            <div className={style.UpperCard}>
                <div className={style.upper1}>
                    <span>Provided by</span>
                </div>
                <hr></hr>
                <div className={style.upper2}>
                    <div>
                        <Image src={props.image} />
                    </div>
                    <div className={style.upper2inside}>
                        <div className={style.text1}>
                            <span>{props.Name}</span>
                        </div>
                        <div className={style.text2}>
                            <span>{props.Advisor}</span>
                        </div>
                    </div>
                </div>
                <div className={style.upper4}>
                    <span>{props.sebiNo}</span>
                </div>
                <Link href={props.onClickView}>
                    <div className={style.upper5}>
                        <span>View Profile</span>
                    </div>
                </Link>
            </div>


        </>
    )
}

export function InvestmentAdvisoryPlansLeftPannelLowerBody(props) {
    const router = useRouter();
    return (
        <>
            <div className={style.MiddleCard}>
                <div className={style.Middle1}>
                    <div className={style.MiddleText1}>
                        <span>Other services</span>
                    </div>
                    <div onClick={() => router.push("/services/finsharpe")} className={style.MiddleText2}>
                        <span>See all</span>
                    </div>
                </div>
                <hr></hr>
                <div className={style.Middle2}>
                    <div className={style.MiddleText3}>
                        <span>{props.ServiceName1}</span>
                    </div>
                    <div className={style.MiddleText4}>
                        <span>{props.ServiceType}</span>
                    </div>
                    <div className={style.MiddleText2}>
                        <span>{props.View}</span>
                    </div>
                </div>
                {props.ServiceName2 && (
                    <>
                        <hr></hr>
                        <div className={style.Middle2}>
                            <div className={style.MiddleText3}>
                                <span>{props.ServiceName2}</span>
                            </div>
                            <div className={style.MiddleText4}>
                                <span>{props.ServiceType}</span>
                            </div>
                            <div className={style.MiddleText2}>
                                <span>{props.View}</span>
                            </div>
                        </div>
                    </>
                )}
                {props.ServiceName3 && (
                    <>
                        <hr></hr>
                        <div className={style.Middle2}>
                            <div className={style.MiddleText3}>
                                <span>{props.ServiceName3}</span>
                            </div>
                            <div className={style.MiddleText4}>
                                <span>{props.ServiceType}y</span>
                            </div>
                            <div className={style.MiddleText2}>
                                <span>{props.View}</span>
                            </div>
                        </div>
                    </>
                )}
                {props.ServiceName4 && (
                    <>
                        <hr></hr>
                        <div className={style.Middle2}>
                            <div className={style.MiddleText3}>
                                <span>{props.ServiceName4}</span>
                            </div>
                            <div className={style.MiddleText4}>
                                <span>{props.ServiceType}</span>
                            </div>
                            <div className={style.MiddleText2}>
                                <span>{props.View}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className={style.LowerCard}>
                <div className={style.Lower1}>
                    <span>Contact details</span>
                </div>
                <hr></hr>
                <div className={style.Lower2}>
                    <div className={style.Lower2inside}>
                        <div>
                            <Image src={mail} />
                        </div>
                        <div className={style.Lower2insideText}>
                            <span>{props.email}</span>
                        </div>
                    </div>
                    <br></br>
                    <div className={style.Lower2inside}>
                        <div>
                            <Image src={phone} />
                        </div>
                        <div className={style.Lower2insideText}>
                            <span>{props.phoneNo}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
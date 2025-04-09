'use client'
import style from "@/app/services/components/style/investmentAdvisoryCard.module.css"
import Image from "next/image"
import { useRouter } from 'next/navigation'

export default function InvestmentAdvisoryCard(props) {
    const router = useRouter();
    return (
        <>
            <div className={style.Card}>
                <div className={style.upperCard}>
                    <div className={style.upperCardLeft}>
                        <div className={style.upperCardLeftUpper}>
                            <Image onClick={() => router.push(props.buttonLink)} alt={props.altText} src={props.logo} style={{alignSelf:'flex-start',marginTop:'1%', cursor: 'pointer', width: '10%' }}></Image>
                            <div className={style.upperCardLeftUpperText}>
                                <div onClick={() => router.push(props.buttonLink)} className={style.upperCardLeftUpperText1}>
                                    <span>{props.upperCardLeftUpperText1}</span>
                                </div>
                                <div className={style.upperCardLeftUpperText2}>
                                    <span>{props.upperCardLeftUpperText2}</span>
                                </div>
                            </div>
                        </div>
                        <div className={style.upperCardLeftLower}>
                            <span>{props.upperCardLeftLower}</span>
                        </div>
                    </div>
                    <div className={style.upperCardRight}>
                        <div onClick={() => router.push(props.buttonLink)} className={style.upperCardRightUpper}>
                            <span className={style.viewPlan}>View Plan</span>
                        </div>
                        <div className={style.upperCardRightLower}>
                            <div className={style.upperCardRightLowerSpan1}>
                                <span>{props.upperCardRightLowerSpan1}</span>
                            </div>
                            <div className={style.upperCardRightLowerSpan2}>
                                <span>{props.upperCardRightLowerSpan2}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div className={style.lowerCard}>
                    <div style={{ marginTop: '1%' }} className={style.lowerCard1}>
                        {/* <ul> */}
                        <li>Recommendation on existing insurances</li>
                        <li>Data Collection & Goal Setting</li>
                        <li>Planning for Goals</li>
                        {/* </ul> */}
                    </div>
                    <div className={`${style.lowerCard1} ${style.lowerCard2}`}>
                        {/* <ul> */}
                        <li>Emergency Planning</li>
                        <li>Retirement Planning</li>
                        {props.lowerCard1Text && (
                            <>
                                <li>{props.lowerCard1Text}</li>
                            </>
                        )}
                        {/* </ul> */}
                    </div>
                    <div className={style.upperCardRightCopy}>
                        <div onClick={() => router.push(props.buttonLink)} className={style.upperCardRightUpper}>
                            <span className={style.viewPlan}>View Plan</span>
                        </div>
                        <div className={style.upperCardRightLower}>
                            <div className={style.upperCardRightLowerSpan1}>
                                <span>{props.upperCardRightLowerSpan1}</span>
                            </div>
                            <div className={style.upperCardRightLowerSpan2}>
                                <span>{props.upperCardRightLowerSpan2}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
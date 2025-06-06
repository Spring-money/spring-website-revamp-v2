'use client'
import style from "@/app/services/components/style/modalPortfolioCard.module.css"
import modal from "@/app/services/components/images/modal_portfolio1.svg"
import Image from "next/image"
import { useRouter } from 'next/navigation'

export default function ModalPortfolioCard(props) {
    const router = useRouter();
    let lowerCardText2Color = "";
    switch (props.volatility) {
        case "Low":
            lowerCardText2Color = style.lowerCardText2ColorGreen;
            break;
        case "Medium":
            lowerCardText2Color = style.lowerCardText2ColorYellow;
            break;
        case "High":
            lowerCardText2Color = style.lowerCardText2ColorRed;
            break;
        default:
            lowerCardText2Color = ""; // Default color
            break;
    }

    return (
        <>
            <div className={style.Card}>
                <div className={style.upperCard}>
                    <div className={style.upperCardLeft}>
                        <div className={style.upperCardLeftUpper}>
                                <Image onClick={() => router.push(props.buttonLink)} alt="A logo for FinSharp Mutual Funds featuring a balanced design with an archery symbol." src={props.logo} style={{alignSelf:'flex-start',marginTop:'1%',cursor:'pointer',width:'10%'}}></Image>
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
                            <span>{props.shortDesc}</span>
                        </div>
                    </div>
                    <div className={style.upperCardRight}>
                        <div onClick={() => router.push(props.buttonLink)} className={style.upperCardRightUpper}>
                            <span className={style.viewPlan}>View Portfolio</span>
                        </div>
                        <div className={style.upperCardRightLower}>
                            <div className={style.upperCardRightLowerSpan1}>
                                <span>{props.accessAmnt}</span>
                            </div>
                            <div className={style.upperCardRightLowerSpan2}>
                                <span>{props.upperCardRightLowerSpan2}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div className={style.lowerCard}>
                    <div className={style.lowerCard1}>
                        <div className={style.lowerCardText1}>
                            <span>Volatility</span>
                        </div>
                        <div className={style.lowerCardText2}>
                            <span className={lowerCardText2Color}>{props.volatility}</span>
                        </div>
                    </div>
                    <hr className={style.verticleLine}></hr>
                    <div className={style.lowerCard2}>
                        <div className={style.lowerCardText1}>
                            <span>Min. Investment</span>
                        </div>
                        <div className={style.lowerCardText3}>
                            <span>{props.lowerCardText3}</span>
                        </div>
                    </div>
                    <hr className={style.verticleLine}></hr>
                    <div className={style.lowerCard2}>
                        <div className={style.lowerCardText1}>
                            <span>Return Period</span>
                        </div>
                        <div className={style.lowerCardText3}>
                            <span>{props.returnPer}</span>
                        </div>
                    </div>
                    <hr className={style.verticleLine}></hr>
                    <div className={style.lowerCard2}>
                        <div className={style.lowerCardText1}>
                            <span>Return Percentage</span>
                        </div>
                        <div className={style.lowerCardText3}>
                            <span>{props.returnPercentage}</span>
                        </div>
                    </div>
                </div>
                <div className={style.upperCardRightCopy}>
                    <div onClick={() => router.push(props.buttonLink)} className={style.upperCardRightUpper}>
                        <span className={style.viewPlan}>View Portfolio</span>
                    </div>
                    <div className={style.upperCardRightLower}>
                        <div className={style.upperCardRightLowerSpan1}>
                            <span>{props.accessAmnt}</span>
                        </div>
                        <div className={style.upperCardRightLowerSpan2}>
                            <span>{props.upperCardRightLowerSpan2}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
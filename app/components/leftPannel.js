'use client';
import style from "@/app/services/components/style/leftPannel.module.css"
import leftPannel from "@/app/services/components/images/leftPannel.svg"
import Image from "next/image"
import vector from "@/app/services/components/images/Vector.svg"
import { useRouter } from 'next/navigation'

export default function LeftPannel(props) {
    const router = useRouter();
    return (
        <>
            <div className={style.LeftPannel}>
                <div className={style.LeftPannelTop}>
                    <div className={style.image}>
                        <Image src={leftPannel}></Image>
                    </div>
                    <div className={style.LeftPannelTopText}>
                        <div className={style.text1}>
                            <span>Spring Advisory</span>
                        </div>
                        <div className={style.text2}>
                            <span>Discover expert financial strategies personalised just for you, and make smarter financial decisions.</span>
                        </div>
                    </div>
                </div>
                <div className={style.LeftPannelBottom}>
                {/* <hr className={style.horizontalLine}></hr> */}
                    <div onClick={() => router.push('/services')} className={props.selected==="All Services" ? style.selected : style.selector}>
                        <div className={style.selectorText}>
                            <span>All services</span>
                        </div>
                        {/* <div>
                            <Image src={vector}></Image>
                        </div> */}
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div onClick={() => router.push('/services/investment-advisory')} className={props.selected==="Investment Advisory" ? style.selected : style.selector}>
                        <div className={style.selectorText}>
                            <span>Financial PLanning</span>
                        </div>
                    </div>
                    <hr className={style.horizontalLine}></hr>
                    <div onClick={() => router.push('/services/model-portfolios')} className={props.selected==="Model Portfolios" ? style.selected : style.selector}>
                        <div className={style.selectorText}>
                            <span>Model Portfolios</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
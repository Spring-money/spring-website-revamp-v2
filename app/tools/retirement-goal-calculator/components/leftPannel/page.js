'use client'
import style from "../leftPannel/page.module.css"
import Image from "next/image"
import leftArrow from "../../../../../public/retirement-calculator/arrow-left.svg"
import headImage from "../../../../../public/retirement-calculator/image 17.svg"
import Link from "next/link"

export default function LeftPannel(props) {

    const handleClick = (btn) => {
        props.setSelectLeftPannelCategory(btn);
    }

    return (
        <>
            <div className={style.conatiner}>
                <div className={style.arrowTools}>
                    <Link href={'/tools'}>
                        <Image src={leftArrow} />
                    </Link>
                    <div>
                        <span>Tools</span>
                    </div>
                </div>
                <div className={style.headImage}>
                    <Image src={headImage} />
                </div>
                <div className={style.heading}>
                    <span>Retirement Goal Calculator</span>
                </div>
                <div className={style.discription}>
                    <span>Find your target corpus and monthly savings to secure your retirement.</span>
                </div>
                <div onClick={() => handleClick('Your retirement analysis')} className={props.selectLeftPannelCategory === 'Your retirement analysis' ? style.selectedCategory : style.categories}>
                    <span>Your retirement analysis</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('Finding the right ROI for you')} className={props.selectLeftPannelCategory === 'Finding the right ROI for you' ? style.selectedCategory : style.categories}>
                    <span>Finding the right ROI for you</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('Difference between investing & saving')} className={props.selectLeftPannelCategory === 'Difference between investing & saving' ? style.selectedCategory : style.categories}>
                    <span>Difference between investing & saving</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('Adjusting your retirement age')} className={props.selectLeftPannelCategory === 'Adjusting your retirement age' ? style.selectedCategory : style.categories}>
                    <span>Adjusting your retirement age</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('When should you start?')} className={props.selectLeftPannelCategory === 'When should you start?' ? style.selectedCategory : style.categories}>
                    <span>When should you start?</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('Altering your expenses')} className={props.selectLeftPannelCategory === 'Altering your expenses' ? style.selectedCategory : style.categories}>
                    <span>Altering your expenses</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('Impact of inflation')} className={props.selectLeftPannelCategory === 'Impact of inflation' ? style.selectedCategory : style.categories}>
                    <span>Impact of inflation</span>
                </div>
                <hr className={style.horizontalLine}></hr>
                <div onClick={() => handleClick('Understanding retirement')} className={props.selectLeftPannelCategory === 'Understanding retirement' ? style.selectedCategory : style.categories}>
                    <span>Understanding retirement</span>
                </div>
            </div>
        </>
    )
}
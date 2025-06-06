'use client'
import style from "@/app/services/components/style/navigatorMiddlePannel.module.css"
import Image from "next/image"
import x from "@/app/services/components/images/x.svg"
import { useState } from "react"

export default function NavigatorMiddlePannel() {
    const [active, setActive] = useState({
        'All': false,
        'Featured': false,
        'NS Wealth Solution': false,
        'ARTHA FinPlan': false,
        'FinSharpe Investment Advisors': false,
    });
    const handleClick = (btn) => {
        if (btn === "All") {
            if(active["All"]){
                setActive(prevState => ({
                    ...prevState,
                    'All': false
                }));
            }else{
                setActive(prevState => ({
                    ...prevState,
                    'All': true
                }));
            }
        }
        if (btn === "Featured") {
            if(active["Featured"]){
                setActive(prevState => ({
                    ...prevState,
                    'Featured': false
                }));
            }else{
                setActive(prevState => ({
                    ...prevState,
                    'Featured': true
                }));
            }
        }
        if (btn === "NS Wealth Solution") {
            if(active["NS Wealth Solution"]){
                setActive(prevState => ({
                    ...prevState,
                    'NS Wealth Solution': false
                }));
            }else{
                setActive(prevState => ({
                    ...prevState,
                    'NS Wealth Solution': true
                }));
            }
        }
        if (btn === "ARTHA FinPlan") {
            if(active["ARTHA FinPlan"]){
                setActive(prevState => ({
                    ...prevState,
                    'ARTHA FinPlan': false
                }));
            }else{
                setActive(prevState => ({
                    ...prevState,
                    'ARTHA FinPlan': true
                }));
            }
        }
        if (btn === "FinSharpe Investment Advisors") {
            if(active["FinSharpe Investment Advisors"]){
                setActive(prevState => ({
                    ...prevState,
                    'FinSharpe Investment Advisors': false
                }));
            }else{
                setActive(prevState => ({
                    ...prevState,
                    'FinSharpe Investment Advisors': true
                }));
            }
        }
    }
    return (
        <>
            <div className={style.container}>
                <div onClick={() => handleClick("All")} className={style.button}>
                    <span className={active["All"] ? style.selected : ''}>All</span>
                    {active["All"] && (
                        <>
                            <Image src={x} style={{ marginLeft: '1%', marginTop: '1%' }} />
                        </>
                    )}
                </div>
                <div onClick={() => handleClick("Featured")} className={style.button}>
                    <span className={active["Featured"] ? style.selected : ''}>Featured</span>
                    {active["Featured"] && (
                        <>
                            <Image src={x} style={{ marginLeft: '1%', marginTop: '1%' }} />
                        </>
                    )}
                </div>
                <div onClick={() => handleClick("NS Wealth Solution")} className={style.button}>
                    <span className={active["NS Wealth Solution"] ? style.selected : ''}>NS Wealth Solution</span>
                    {active["NS Wealth Solution"] && (
                        <>
                            <Image src={x} style={{ marginLeft: '1%', marginTop: '1%' }} />
                        </>
                    )}
                </div>
                <div onClick={() => handleClick("ARTHA FinPlan")} className={style.button}>
                    <span className={active["ARTHA FinPlan"] ? style.selected : ''}>ARTHA FinPlan</span>
                    {active["ARTHA FinPlan"] && (
                        <>
                            <Image src={x} style={{ marginLeft: '1%', marginTop: '1%' }} />
                        </>
                    )}
                </div>
                <div onClick={() => handleClick("FinSharpe Investment Advisors")} className={style.button}>
                    <span className={active["FinSharpe Investment Advisors"] ? style.selected : ''}>FinSharpe Investment Advisors</span>
                    {active["FinSharpe Investment Advisors"] && (
                        <>
                            <Image src={x} style={{ marginLeft: '1%', marginTop: '1%' }} />
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
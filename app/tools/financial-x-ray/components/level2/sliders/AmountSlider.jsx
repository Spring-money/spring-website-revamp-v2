'use client'
import Rangeslider from "../../level1/sliders/Rangesliders";
import AmountInput from "../inputs/AmountInput";
import styles from './Input.module.css';
import { useState } from "react";
import { IntToAmount } from "../inputs/utility";

function AmountSlider(props) {
    const [value,setValue]=useState(0);

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setValue(value);
        if(props.setValue){
            props.setValue(value);
        }
    };

    console.log('amount slider',value)
    
    return ( 
        <div className={`${styles.Container} ${props.className}`}>
            <div>
                <AmountInput value={props.value!=undefined?props.value:value} setValue={props.setValue?(input)=>{props.setValue(input); setValue(input)}:setValue} min={props.min} max={props.max}></AmountInput>
            </div>
            <div>
                <Rangeslider value={props.value!=undefined?props.value:value} onChange={handleSliderChange} step={props.step} min={props.min} max={props.max}></Rangeslider>
                <div className={styles.percentSpan}>
                        <div>{IntToAmount(props.min) || "₹0"}</div>
                        <div>{IntToAmount(props.max) || "₹5,00,00,000"}</div>
                    </div>
            </div>
        </div>
     );
}

export default AmountSlider;
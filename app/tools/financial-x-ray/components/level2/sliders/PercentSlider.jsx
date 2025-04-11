'use client'
import { useState } from "react";
import PercentInput from "../inputs/PercentInput";
import styles from './Input.module.css';
import Rangeslider from "../../level1/sliders/Rangesliders";

function PercentSlider(props) {
    const [value,setValue]=useState(0)

    const handleSliderChange=(e)=>{
        let intValue=parseInt(e.target.value) || 0;
        setValue(intValue)
        if(props.setValue){
            props.setValue(intValue);
        }
    }
    return ( 
        <>
            <div>
                <div>
                    <PercentInput value={props.value!=undefined?props.value:value} min={props.min} max={props.max} setValue={props.setValue?(input)=>{props.setValue(input); setValue(input)}:setValue}></PercentInput>
                </div>
                <div>
                    <Rangeslider value={props.value!=undefined?props.value:value} onChange={handleSliderChange} min={0} step={props.step} max={props.max}></Rangeslider>
                    <div className={styles.percentSpan}>
                        <div>0%</div>
                        <div>100%</div>
                    </div>
                </div>
            </div>
        </>
     );
}

export default PercentSlider;
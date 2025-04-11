'use client'

import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import styles from './Input.module.css';
import Rangeslider from "../../level1/sliders/Rangesliders";

function YearSlider(props) {
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
            <div className={styles.Container}>
            <div>
                <Rangeslider value={props.value!=undefined?props.value:value} onChange={handleSliderChange} min={1} max={12}></Rangeslider>
            </div>
            <div>
                <Input value={props.value!=undefined?props.value:value} setValue={props.setValue?(input)=>{props.setValue(input);setValue(input)}:setValue} min={1} max={12}></Input>
            </div>
        </div>
        </>
     );
}

export default YearSlider;
'use client'

import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import styles from './Input.module.css';
import Rangeslider from "../../level1/sliders/Rangesliders";

function NumberSlider(props) {
    const [value,setValue]=useState(0)
    const [validation,setValidation]=useState()

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setValue(value);
        if(props.setValue){
            props.setValue(value);
        }
    };

    return ( 
        <>
           <div className={styles.Container}>
            <div>
                <Rangeslider value={props.value!=undefined?props.value:value} onChange={handleSliderChange} min={1} max={12}></Rangeslider>
            </div>
            <div>
                <Input value={props.value!=undefined?props.value:value} setValue={props.setValue?(input)=>{props.setValue(input); console.log('amountslider used in above level',props.value);setValue(input)}:setValue} min={1} max={12}></Input>
            </div>
        </div>
        </>
     );
}

export default NumberSlider;
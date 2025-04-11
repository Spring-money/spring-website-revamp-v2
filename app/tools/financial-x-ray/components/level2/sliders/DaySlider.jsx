'use client'
import Rangeslider from "../../level1/sliders/Rangesliders";
import Input from "../inputs/Input";
import styles from './Input.module.css';
import { useState } from "react";

function DaySlider(props) {
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
        <div className={styles.Container}>
            <div>
                <Rangeslider value={props.value!=undefined?props.value:value} onChange={handleSliderChange} min={1} max={props.max}></Rangeslider>
            </div>
            <div>
                <Input value={props.value!=undefined?props.value:value} setValue={props.setValue?(input)=>{props.setValue(input); setValue(input)}:setValue} min={props.min || 1} max={props.max}></Input>
            </div>
        </div>
     );
}

export default DaySlider;
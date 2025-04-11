'use client'

import Rangeslider from "../../level1/sliders/Rangesliders";
import SimpleInput from "../inputs/Input";;
import { useState } from "react";
import styles from './Input.module.css';

function MonthSlider(props) {
    const [value, setValue] = useState(0);

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        setValue(value);
        if (props.setValue) {
            props.setValue(value);
        }
    };

    return (
        <div className={styles.Container}>
            <div>
                <SimpleInput value={props.value != undefined ? props.value : value} setValue={props.setValue ? (input) => { props.setValue(input); setValue(input) } : setValue} min={1} max={12}></SimpleInput>
            </div>
            <div>
                <Rangeslider value={props.value != undefined ? props.value : value} onChange={handleSliderChange} min={1} step={props.step} max={12}></Rangeslider>
                <div className={styles.percentSpan}>
                    <div>1</div>
                    <div>12</div>
                </div>
            </div>
        </div>
    );
}

export default MonthSlider;
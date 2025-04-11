'use client'
import { CheckBox } from "../../level1/inputs/Inputs";
import { useState } from "react";
function CheckBoxInput(props) {
    const [value,setValue]=useState(props.value!==undefined?props.value:0)

    const clickHandler=(e)=>{
        if(value===1){
            setValue(0);
            if(props.setValue){
                props.setValue(0);
            }
        }else{
            setValue(1);
            if(props.setValue){
                props.setValue(1);
            }
        }
        
    }
    return ( 
        <>
            <CheckBox className={props.className} style={props.style} value={props.value!==undefined?props.value:value} onClick={(event)=>{clickHandler(event); props.onClick?props.onClick():''}}></CheckBox>
        </>
     );
}

export default CheckBoxInput;
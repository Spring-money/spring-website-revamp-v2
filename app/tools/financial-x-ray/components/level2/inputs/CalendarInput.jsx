'use client'
import { DateInput } from "../../level1/inputs/Inputs";
import { useState } from "react";
function CalendarInput(props) {
    const [value,setValue]=useState()

    const changeHandler=(e)=>{
        let Value=e.target.value;
        // new Date(new Date(Value).getTime()+330*60*1000)).toISOString().replace(/\.\d+/, "").replace('T', ' ').replace('Z', '')
        // Value=2024-02-01
        setValue(Value);
        if(props.setValue){
            props.setValue(Value);
        }
    }
    return ( 
        <>
            <DateInput className={props.inputClassName} style={props.inputStyle} value={props.value!==undefined?props.value:value} placeholder='Date' onChange={(event)=>{changeHandler(event); props.onChange?props.onChange():''}}></DateInput>
        </>
     );
}

export default CalendarInput;
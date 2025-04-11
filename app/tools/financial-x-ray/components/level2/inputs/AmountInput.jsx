'use client'

import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import { ErrorText } from "../../level1/texts/Texts";
import { NumberToWords } from "../../level1/texts/Texts";
import { IntToAmount } from "./utility";
function AmountInput(props) {
    const [value,setValue]=useState()
    const [validation,setValidation]=useState()

    const changeHandler=(e)=>{
        let intValue=parseInt(e.target.value.replace(/,|₹/g, '')) || 0;
        
            let Value=IntToAmount(intValue);
            if(intValue>props.max || intValue<props.min){
                setValue(Value)
                setValidation(`Amount should be between ${props.min} and ${props.max}`)
            }else{
                if(props.setValue){
                    props.setValue(intValue);
                }
                setValidation()
            }
    }
    return ( 
        <>
            <Input className={props.inputClassName} style={props.inputStyle} value={props.value!==undefined?IntToAmount(props.value):value} placeholder='₹' onChange={(event)=>{changeHandler(event); props.onChange?props.onChange():''}}></Input>
            {validation&&<ErrorText className={props.validationClassName} style={props.validationStyle}><p>{validation}</p></ErrorText>
            // :
            // <NumberToWords className={props.numberToWordsClassName} style={props.numberToWordsStyle} value={props.value?props.value:(value?parseInt(value.replace(/,|₹/g, '')):0)}></NumberToWords>
            }
        </>
     );
}

export default AmountInput;
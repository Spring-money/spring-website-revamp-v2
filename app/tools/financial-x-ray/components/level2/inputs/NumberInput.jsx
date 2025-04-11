'use client'
import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import { ErrorText } from "../../level1/texts/Texts";
function NumberInput(props) {
    const [value,setValue]=useState()
    const [validation,setValidation]=useState()

    const changeHandler=(e)=>{
            let Value=e.target.value;
            let re = 
                /^(0|[1-9]\d*)(\.\d+)?$/;
            setValue(Value)
            if (!re.test(Value)) {
                setValidation(`Enter valid number`)
            }else{
                if(props.setValue){
                    props.setValue(parseInt(Value));
                }
                setValidation()
            }
    }
    return ( 
        <>
            <Input className={props.inputClassName} placeholder='number' style={props.inputStyle} value={props.value!==undefined?props.value:value} onChange={changeHandler}></Input>
            {validation?<ErrorText className={props.validationClassName} style={props.validationStyle}><p>{validation}</p></ErrorText>:''}
        </>
     );
}

export default NumberInput;
'use client'
import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import { ErrorText } from "../../level1/texts/Texts";
function AadharCardInput(props) {
    const [value,setValue]=useState()
    const [validation,setValidation]=useState()

    const changeHandler=(e)=>{
            let Value=e.target.value;
            Value=Value.replace(/\D/g,"").split(/(?:([\d]{4}))/g).filter(s => s.length > 0).join(" ");
            let re = 
                /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/;
            setValue(Value)
            if (!re.test(Value)) {
                console.log(Value)
                setValidation(`Enter valid Pan card`)
            }else{
                if(props.setValue){
                    props.setValue(parseInt(Value.replace(/\s+/g,"")));
                }
                setValidation()
            }
    }
    return ( 
        <>
            <Input className={props.inputClassName} placeholder='Aadhar Card' style={props.inputStyle} value={value} onChange={changeHandler}></Input>
            {validation?<ErrorText className={props.validationClassName} style={props.validationStyle}><p>{validation}</p></ErrorText>:''}
        </>
     );
}

export default AadharCardInput;
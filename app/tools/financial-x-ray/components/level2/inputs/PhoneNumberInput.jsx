import {MobileInput} from "../../level1/inputs/Inputs";
import { useState } from "react";
import { ErrorText } from "../../level1/texts/Texts";
function PhoneNumberInput(props) {
    const [value,setValue]=useState()
    const [validation,setValidation]=useState()

    const changeHandler=(e)=>{
            let Value=e.target.value;
            let re = 
                /[0-9]{10}$/;
            setValue(parseInt(Value))
            if(!re.test(Value)){
                setValidation(`Enter Valid Mobile Number`)
            }else{
                if(props.setValue){
                    props.setValue(parseInt(Value));
                }
                setValidation()
            }
    }
    return ( 
        <>
            <MobileInput className={props.inputClassName} style={props.inputStyle} value={props.value!==undefined?props.value:value} onChange={changeHandler}></MobileInput>
            {validation?<ErrorText className={props.validationClassName} style={props.validationStyle}><p>{validation}</p></ErrorText>:''}
        </>
     );
}

export default PhoneNumberInput;
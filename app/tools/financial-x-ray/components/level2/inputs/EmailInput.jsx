import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import { ErrorText } from "../../level1/texts/Texts";
function EmailInput(props) {
    const [value,setValue]=useState()
    const [validation,setValidation]=useState()

    const changeHandler=(e)=>{
            let Value=e.target.value;
            let re = 
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            setValue(Value)
            if(!re.test(Value)){
                setValidation(`Enter Valid email`)
            }else{
                if(props.setValue){
                    props.setValue(Value);
                }
                setValidation()
            }
    }
    return ( 
        <>
            <Input className={props.inputClassName} placeholder='Email' style={props.inputStyle} value={props.value!==undefined?props.value:value} onChange={changeHandler}></Input>
            {validation?<ErrorText className={props.validationClassName} style={props.validationStyle}><p>{validation}</p></ErrorText>:''}
        </>
     );
}

export default EmailInput;
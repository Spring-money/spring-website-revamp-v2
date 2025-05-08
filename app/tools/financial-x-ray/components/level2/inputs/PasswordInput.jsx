import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
function PasswordInput(props) {
    const [value,setValue]=useState()

    const changeHandler=(e)=>{
            let Value=e.target.value;
            setValue(Value);
            if(props.setValue){
                props.setValue(Value);
            }
           
    }
    return ( 
        <>
            <Input className={props.inputClassName} placeholder='Password' style={props.inputStyle} value={props.value!==undefined?props.value:value} onChange={changeHandler} type='password'></Input>
        </>
     );
}

export default PasswordInput;
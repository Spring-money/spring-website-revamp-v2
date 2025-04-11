import { TextAreaInput } from "../../level1/inputs/Inputs";
import { useState } from "react";
function TextInput(props) {
    const [value,setValue]=useState()

    const changeHandler=(e)=>{
            let Value=e.target.value;
            setValue(Value)
            if(props.setValue){
                props.setValue(Value);
            }
    }
    return ( 
        <>
            <TextAreaInput className={props.inputClassName} placeholder='Text' style={props.inputStyle} value={props.value!==undefined?props.value:value} onChange={changeHandler}></TextAreaInput>
        </>
     );
}

export default TextInput;
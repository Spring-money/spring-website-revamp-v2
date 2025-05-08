import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
import { ErrorText } from "../../level1/texts/Texts";
function PercentInput(props) {
    const [value,setValue]=useState()
    const [validation,setValidation]=useState()

    const changeHandler=(e)=>{
        let re=/\d+(\.\d+)?%/;
        let Value=e.target.value || "0%";
        if(!re.test(e.target.value)){
            if(Value.length>1){
                Value=Value.substring(0,Value.length-1)+"%";
            }else{
                Value="0%"
            }
        }
        Value= Value.replace(/%/g,"")
        let intValue=parseInt(Value)
        
        Value=Value+'%';
        setValue(Value)
        if(!re.test(Value)){
            setValidation(`Enter Valid Percentage`)
        }else{
            if(props.setValue && intValue<=props.max && intValue>=props.min){
                props.setValue(parseInt(Value.replace(/%/g, '')));
            }
            setValidation()
        }
    }
    
    return ( 
        <>
            <Input className={props.inputClassName} placeholder='Percent' style={props.inputStyle} value={props.value!==undefined?props.value+'%':value} onChange={changeHandler}></Input>
            {validation?<ErrorText className={props.validationClassName} style={props.validationStyle}><p>{validation}</p></ErrorText>:''}
        </>
     );
}

export default PercentInput;
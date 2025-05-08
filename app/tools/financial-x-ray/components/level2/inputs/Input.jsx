import Input from "../../level1/inputs/Inputs";
import { useState } from "react";
function SimpleInput(props) {
    const [value, setValue] = useState()

    const changeHandler = (e) => {
        let Value = e.target.value;
        if (Value < 0) {
            Value = props.min
        }
        if (Value > props.max) {
            Value = props.max
        }
        setValue(Value)
        if (props.setValue) {
            props.setValue(Value);
        }
    }
    return (
        <>
            <Input className={props.inputClassName} style={props.inputStyle} value={props.value !== undefined ? props.value : value} placeholder={props.placeholder ? props.placeholder : ''} onChange={(event) => { changeHandler(event); props.onChange ? props.onChange() : '' }}></Input>
        </>
    );
}

export default SimpleInput;
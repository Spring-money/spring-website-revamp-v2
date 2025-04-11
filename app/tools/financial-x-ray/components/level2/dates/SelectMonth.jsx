import { SelectInput } from "../../level1/inputs/Inputs";
function SelectMonth(props) {
    let months = ['None','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return ( 
        <SelectInput name='months' className={props.className} style={props.style}>
            {months.map((month)=>{
                return (
                    <option key={'month'+month} value={month}>{month}</option>
                )
            })}
        </SelectInput>
     );
}

export default SelectMonth;
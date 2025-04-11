import { SelectInput } from "../../level1/inputs/Inputs";
function SelectDate(props) {
    return ( 
        <SelectInput name='date' className={props.className} style={props.style}>
            {[...Array(31).keys()].map((date)=>{
                return (
                    <option key={'date'+date} value={date+1}>{date+1}</option>
                )
            })}
        </SelectInput>
     );
}

export default SelectDate;
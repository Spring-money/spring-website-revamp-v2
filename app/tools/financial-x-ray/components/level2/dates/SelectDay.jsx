import { SelectInput } from "../../level1/inputs/Inputs";
function SelectDay(props) {
    let days = ['None',"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return ( 
        <SelectInput name='days' className={props.className} style={props.style}>
            {days.map((day)=>{
                return (
                    <option key={'Days'+day} value={day}>{day}</option>
                )
            })}
        </SelectInput>
    );
}

export default SelectDay;
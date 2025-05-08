import styles from "./Inputs.module.css"

export default function Input(props) {
    return (
        <div className={`${styles.Container} ${props.className}`} style={props.style}>
            {
                props.readonly?(
                     <input type={props.type} placeholder={props.type} {...props} className={styles.Input} style={{}} readonly></input>
                    ):(
                        <input type={props.type} placeholder={props.type} {...props} className={styles.Input} style={{}}></input>
                    )
            }
        </div>
     );
}

export function MobileInput(props) {
    return ( 
        <div className={`${styles.Container} ${props.className}`} style={props.style}>
            <div className={styles.IndianCodeMobileInput}>
                +91
            </div>
            <input type="mobile" placeholder="Mobile Number" {...props} className={styles.MobileInput} style={{}}></input>
        </div>
     );
}



export function DateInput(props) {
    return ( 
        <div className={`${styles.Container} ${styles.DatepickerToggle} ${props.className}`} style={props.style}>
            <input type="date"  {...props} className={styles.DateInput} style={{}}/>
            <span className={styles.DatepickerToggleButton}>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.6667 2.66675H3.33333C2.59695 2.66675 2 3.2637 2 4.00008V13.3334C2 14.0698 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0698 14 13.3334V4.00008C14 3.2637 13.403 2.66675 12.6667 2.66675Z" stroke="#272B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.6665 1.33325V3.99992" stroke="#272B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.3335 1.33325V3.99992" stroke="#272B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 6.66675H14" stroke="#272B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </span>
        </div>
     );
}

// this input has no div container and container class is not applied to it.
export function TextAreaInput(props) {
    return (  
        <textarea {...props} className={`${styles.TextAreaInput} ${props.className}`}  name="text-area">
        </textarea>
    );
}

export function SelectInput(props) {
    return ( 
        <div className={`${styles.Container} ${styles.DatepickerToggle} ${props.className}`} style={props.style}>
            <select defaultValue={props.defaultValue} name={props.name} {...props} className={styles.SelectInput} style={{}}>
                {props.children}
            </select>
        </div>
     );
}


export function CheckBox(props) {
    
    return ( 
        <div {...props} className={`${styles.CheckBoxContainer} ${props.className}`} >
            {props.value?<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="80%" height="80%" viewBox="0 0 48 48">
                <path fill="#43A047" d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"></path>
            </svg>:''}
        </div>
     );
}
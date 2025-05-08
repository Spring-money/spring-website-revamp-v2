import styles from './Buttons.module.css'

export default function Button(props) {
    return ( 
        <>
            {(props.custom)?(
                    <button  {...props} >{props.children}</button> 
                ):(
                    <button  {...props} className={`${styles.buttonType1} ${props.className}`} >{props.children}</button> 
                ) 
            }
        </>
     );
}

export function ToggleButton(props) {
    'use client'
    return ( 
        <div className={styles.ToggleButtonContainer}>
            <div {...props} className={`${styles.ToggleButtonTrack} ${props.className}`} onClick={(element)=>{element.target.classList.toggle(styles.ToggleButtonTrackClicked); element.target.children[0].classList.toggle(styles.ToggleButtonThumbClicked); props.onClick?props.onClick():''}}>
                <div className={styles.ToggleButtonThumb}></div>
            </div>
        </div>
     );
}


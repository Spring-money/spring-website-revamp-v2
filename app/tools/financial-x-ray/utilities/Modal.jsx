import styles from './Modal.module.css'
import {forwardRef, useRef} from 'react'

function Modal(props,ref) {
    return ( 
        <div ref={ref} className={`${styles.Container} ${props.className}`} onClick={(event)=>{event.target==event.currentTarget?event.target.style.display='none':''}}>
            <div className={styles.ContentContainer}>
                {props.children}
            </div>
        </div>
     );
}

export default forwardRef(Modal);
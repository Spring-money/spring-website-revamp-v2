import styles from './Bars.module.css'

function Bar(props) {
    return ( 
        <div className={`${styles.BarContainer} ${props.className}`} style={{['--BAR-PROGRESS-WIDTH']:props.value,...props.style}}>
            <div className={styles.BarTrack}>

            </div>
        </div>
     );
}

export default Bar;
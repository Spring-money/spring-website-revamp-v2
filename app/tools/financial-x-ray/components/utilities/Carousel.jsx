'use client'
import styles from './Carousel.module.css'
import {useState} from 'react'

function Carousel(props) {
    const [currentPageNumber,setCurrentPageNumber]=useState(0)
    let max=props.children.length;
    let translation=currentPageNumber*100;
    return ( 
        <div className={styles.Container} style={props.style} >
            <div className={styles.carouselContentWrapper} style={{['--TRANSLATION']:`-${translation}%`}}>
                <div className={styles.carouselContent}>
                    {props.children}
                </div>
            </div>
            <div className={styles.LeftBtn} onClick={()=>{currentPageNumber>0?setCurrentPageNumber(currentPageNumber-1):setCurrentPageNumber(max-1)}}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAk0lEQVR4nO3ZsQ3CQBQE0Wnin6D/SogQyCQ4oBwspAsQDbD/NK+CW40D+wySOhjAA7jQfMQOvIEbTRXwnCNewImGHJHCEikskcISKSyRwhIpLJGifBUPUSuU+NjmiH1+rra1rTKkfh6tM42VY0KVZUKVZUKVZUJZJpVlUlkmlWVSLVVmfP2evtPcmHcA138fRFrVAcl0dB8tu9fZAAAAAElFTkSuQmCC" />
            </div>
            <div className={styles.BtnContainer}>
                {[...Array(max).keys()].map((key)=>{
                    return (<div key={'carousel'+key} className={`${styles.Btn} ${currentPageNumber==key?styles.ActiveBtn:''}`} onClick={()=>{setCurrentPageNumber(key)}}></div>)
                })}
            </div>
            <div className={styles.RightBtn} onClick={()=>{currentPageNumber<max-1?setCurrentPageNumber(currentPageNumber+1):setCurrentPageNumber(0)}}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nO3asQ3CQBAF0WliLdN/JyRImAgCygEhXUSO9HeZ18HXOPDpDiT9yhm4ARvNXYEX8Og+poD7GvMETjRWjglVlglVlglVlgllmVSWSWWZVJZJNarMto7LnzEHjY0YUl+f1k5DjkhhiRSWSGGJFJZIYYkUlkhR/oqHqAklWMfSEdfTlykPBqR/8Abo/nQfGMTYTAAAAABJRU5ErkJggg==" />
            </div>
        </div>
     );
}

export default Carousel;
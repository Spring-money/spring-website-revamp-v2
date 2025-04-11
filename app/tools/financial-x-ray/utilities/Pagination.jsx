import styles from './Pagination.module.css'
import {useState} from 'react'

function Pagination(props) {
    const [currentPageNumber,setCurrentPageNumber]=useState(1)
    let max=props.children.length;

    return ( 
        <div className={styles.Container}>
            <div className={styles.ContentContainer}>
                {props.children.map((child,index)=>{
                    if(currentPageNumber==index+1){
                        return child;
                    }
                })}
            </div>
            <div className={styles.BtnContainer}>
                <div className={styles.Btn} onClick={()=>{currentPageNumber>1?setCurrentPageNumber(currentPageNumber-1):''}}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAk0lEQVR4nO3ZsQ3CQBQE0Wnin6D/SogQyCQ4oBwspAsQDbD/NK+CW40D+wySOhjAA7jQfMQOvIEbTRXwnCNewImGHJHCEikskcISKSyRwhIpLJGifBUPUSuU+NjmiH1+rra1rTKkfh6tM42VY0KVZUKVZUKVZUJZJpVlUlkmlWVSLVVmfP2evtPcmHcA138fRFrVAcl0dB8tu9fZAAAAAElFTkSuQmCC" />
                </div>
                {[...Array(max).keys()].map((key)=>{
                    return (<div key={'pagination'+key} className={`${styles.Btn} ${currentPageNumber==key+1?styles.ActiveBtn:''}`} onClick={()=>{setCurrentPageNumber(key+1)}}>{key+1}</div>)
                })}
                <div className={styles.Btn} onClick={()=>{currentPageNumber<max?setCurrentPageNumber(currentPageNumber+1):''}}>
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjklEQVR4nO3asQ3CQBAF0WliLdN/JyRImAgCygEhXUSO9HeZ18HXOPDpDiT9yhm4ARvNXYEX8Og+poD7GvMETjRWjglVlglVlglVlgllmVSWSWWZVJZJNarMto7LnzEHjY0YUl+f1k5DjkhhiRSWSGGJFJZIYYkUlkhR/oqHqAklWMfSEdfTlykPBqR/8Abo/nQfGMTYTAAAAABJRU5ErkJggg==" />
                </div>
            </div>
        </div>
     );
}

export default Pagination;
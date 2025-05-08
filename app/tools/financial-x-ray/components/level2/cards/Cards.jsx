import styles from './Cards.module.css'
import Image from 'next/image';
import Bar from '../../level1/bars/Bars';
import Button from '../../level1/buttons/Buttons';
import twotone from './Twotone.png'
import twotoneactive from './Twotoneactive.svg'
import { useRouter } from 'next/navigation'

function CategoryCard(props) {
    return ( 
        <div className={props.active?`${styles.ActiveContainer} ${props.className}`:`${styles.Container} ${props.className}`} onClick={props.onClick}>
            <div className={styles.Top}>
                <div className={styles.ImgContainer}>
                   <Image className={styles.CategoryImg} src={props.src}></Image>
                </div> 
                <div className={styles.MainText}>
                    {props.children}
                </div>
                <div className={styles.RightArrow}>
                    {/* right arrow btn */}
                    <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.25 5.74194C12.2457 5.2816 12.0603 4.84148 11.7337 4.51694L7.98 0.754444C7.81606 0.591474 7.59429 0.5 7.36312 0.5C7.13196 0.5 6.91019 0.591474 6.74625 0.754444C6.66424 0.835786 6.59914 0.932562 6.55472 1.03919C6.5103 1.14582 6.48743 1.26018 6.48743 1.37569C6.48743 1.4912 6.5103 1.60557 6.55472 1.7122C6.59914 1.81883 6.66424 1.9156 6.74625 1.99694L9.625 4.86694H0.875C0.642936 4.86694 0.420376 4.95913 0.256282 5.12323C0.0921874 5.28732 0 5.50988 0 5.74194C0 5.97401 0.0921874 6.19657 0.256282 6.36066C0.420376 6.52476 0.642936 6.61694 0.875 6.61694H9.625L6.74625 9.4957C6.58148 9.6593 6.48846 9.88166 6.48764 10.1139C6.48682 10.346 6.57827 10.5691 6.74187 10.7338C6.90548 10.8986 7.12784 10.9916 7.36003 10.9924C7.59223 10.9933 7.81523 10.9018 7.98 10.7382L11.7337 6.97569C12.0624 6.64901 12.248 6.20532 12.25 5.74194Z" fill="#2C733F"/>
                    </svg>

                </div>
            </div>
            <div className={styles.Middle}>
                <div className={styles.Score}>
                    {
                        (props.value==100)? (<><span>Score: </span> {props.scoreOfCategory[props.children]}/100</>):''
                    }
                </div>
                <div className={styles.ProgressBarText}>
                    {
                        (props.value>0)? ((props.value<100)?<span style={{color:'#FFB800'}}>In Progress</span>:<span style={{color:'#0ED647'}}>Completed</span>):<span style={{color:'#DD4F32'}}>Pending</span>
                    }
                </div>
            </div>
            <div className={styles.ProgressBarContainer}>
                <Bar style={{['--HEIGHT']:'6px'}} value={`${props.value}%`}></Bar>
            </div>
        </div>
     );
}

export default CategoryCard;

export function FinancialXrayCard(props) {

    return ( 
        <div className={`${styles.FinancialXrayCardContainer} ${props.className}`}>
            <div className={styles.Heading}>
                <div onClick={props.handleShowBox} className={styles.BackBtn} >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.3333 14.6667H12L16.3867 10.2801C16.5116 10.1561 16.6108 10.0087 16.6785 9.84618C16.7462 9.6837 16.7811 9.50943 16.7811 9.33341C16.7811 9.1574 16.7462 8.98312 16.6785 8.82064C16.6108 8.65817 16.5116 8.5107 16.3867 8.38675C16.1369 8.13841 15.7989 7.99902 15.4467 7.99902C15.0944 7.99902 14.7565 8.13841 14.5067 8.38675L8.78667 14.1201C8.28588 14.6179 8.00298 15.294 8 16.0001C8.00649 16.7016 8.28913 17.3722 8.78667 17.8667L14.5067 23.6001C14.631 23.7235 14.7784 23.8213 14.9405 23.8877C15.1026 23.9542 15.2762 23.9881 15.4514 23.9875C15.6266 23.9869 15.7999 23.9517 15.9616 23.8841C16.1232 23.8165 16.2699 23.7177 16.3933 23.5934C16.5168 23.4691 16.6145 23.3217 16.681 23.1596C16.7475 22.9975 16.7814 22.8239 16.7807 22.6487C16.7801 22.4735 16.745 22.3002 16.6774 22.1385C16.6098 21.9769 16.511 21.8302 16.3867 21.7067L12 17.3334H25.3333C25.687 17.3334 26.0261 17.1929 26.2761 16.9429C26.5262 16.6928 26.6667 16.3537 26.6667 16.0001C26.6667 15.6465 26.5262 15.3073 26.2761 15.0573C26.0261 14.8072 25.687 14.6667 25.3333 14.6667Z" fill="#272B2A"/>
                    </svg>
                </div> 
                <div className={styles.HeadingText}>
                Financial X-Ray
                </div>
            </div>
            <div  className={styles.ContentText}>
                {props.children}
            </div>
        </div>
     );
}

export function ViewReportCard(props) {
    function handler(event){
        if(props.showReport){
            window.open(props.reportLink+props.reportFormLink, '_blank');
        }else{
            props.modalRef.current.style.display='block';
        }
    }
    return ( 
        <div className={`${styles.Container} ${props.className}`}>
            <div className={styles.HeadingContainer}>
                {!props.endOfForm?<Image className={styles.TwotoneImg} src={twotone}></Image>:<Image className={styles.TwotoneImg} src={twotoneactive}></Image>}
                <div className={styles.ReportScoreText}>
                    <div>
                        Total Score
                    </div>
                        {props.endOfForm?<div className={styles.TotalScore} style={{color:'#272B2A'}}>
                        {props.totalScore}/100
                    </div>:<div className={styles.TotalScore}>
                        0/100
                    </div>}
                </div>
                <div className={styles.LockImage}>

                    {!props.endOfForm?<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25.3337 11.232V9.33333C25.3337 6.85798 24.3503 4.48401 22.6 2.73367C20.8496 0.983331 18.4757 0 16.0003 0C13.525 0 11.151 0.983331 9.40066 2.73367C7.65032 4.48401 6.66699 6.85798 6.66699 9.33333V11.232C5.47947 11.7503 4.46872 12.6034 3.75832 13.6869C3.04793 14.7705 2.6687 16.0376 2.66699 17.3333V25.3333C2.66911 27.1008 3.37217 28.7953 4.62195 30.045C5.87174 31.2948 7.5662 31.9979 9.33366 32H22.667C24.4345 31.9979 26.1289 31.2948 27.3787 30.045C28.6285 28.7953 29.3315 27.1008 29.3337 25.3333V17.3333C29.332 16.0376 28.9527 14.7705 28.2423 13.6869C27.5319 12.6034 26.5212 11.7503 25.3337 11.232ZM9.33366 9.33333C9.33366 7.56522 10.036 5.86953 11.2863 4.61929C12.5365 3.36905 14.2322 2.66667 16.0003 2.66667C17.7684 2.66667 19.4641 3.36905 20.7144 4.61929C21.9646 5.86953 22.667 7.56522 22.667 9.33333V10.6667H9.33366V9.33333ZM26.667 25.3333C26.667 26.3942 26.2456 27.4116 25.4954 28.1618C24.7453 28.9119 23.7279 29.3333 22.667 29.3333H9.33366C8.27279 29.3333 7.25538 28.9119 6.50523 28.1618C5.75509 27.4116 5.33366 26.3942 5.33366 25.3333V17.3333C5.33366 16.2725 5.75509 15.2551 6.50523 14.5049C7.25538 13.7548 8.27279 13.3333 9.33366 13.3333H22.667C23.7279 13.3333 24.7453 13.7548 25.4954 14.5049C26.2456 15.2551 26.667 16.2725 26.667 17.3333V25.3333Z" fill="#939393"/>
                        <path d="M16.0003 18.6667C15.6467 18.6667 15.3076 18.8072 15.0575 19.0573C14.8075 19.3073 14.667 19.6465 14.667 20.0001V22.6667C14.667 23.0204 14.8075 23.3595 15.0575 23.6096C15.3076 23.8596 15.6467 24.0001 16.0003 24.0001C16.3539 24.0001 16.6931 23.8596 16.9431 23.6096C17.1932 23.3595 17.3337 23.0204 17.3337 22.6667V20.0001C17.3337 19.6465 17.1932 19.3073 16.9431 19.0573C16.6931 18.8072 16.3539 18.6667 16.0003 18.6667Z" fill="#939393"/>
                    </svg>:
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_4133_4787)">
                            <path d="M13.3333 20V22.6667C13.3333 23.404 12.736 24 12 24C11.264 24 10.6667 23.404 10.6667 22.6667V20C10.6667 19.2627 11.264 18.6667 12 18.6667C12.736 18.6667 13.3333 19.2627 13.3333 20ZM30.8307 7.992C30.112 8.072 29.44 7.544 29.36 6.812C29.1053 4.48667 27.044 2.66667 24.6667 2.66667C22.0933 2.66667 20 4.76 20 7.33333V11.224C22.352 12.2547 24 14.6053 24 17.3333V25.3333C24 29.0093 21.0093 32 17.3333 32H6.66667C2.99067 32 0 29.0093 0 25.3333V17.3333C0 13.6573 2.99067 10.6667 6.66667 10.6667H17.3333V7.33333C17.3333 3.29067 20.6227 0 24.6667 0C28.4453 0 31.6027 2.804 32.0107 6.52133C32.0907 7.25333 31.5627 7.91067 30.8307 7.992ZM17.3333 13.3333H6.66667C4.46133 13.3333 2.66667 15.128 2.66667 17.3333V25.3333C2.66667 27.5387 4.46133 29.3333 6.66667 29.3333H17.3333C19.5387 29.3333 21.3333 27.5387 21.3333 25.3333V17.3333C21.3333 15.128 19.5387 13.3333 17.3333 13.3333Z" fill="#939393"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_4133_4787">
                                <rect width="32" height="32" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>}
                </div>
            </div>
            <div  className={styles.Text}>
                Complete all sections for full report access
            </div>
            <div className={styles.BtnContainer}>
                {props.endOfForm?
                    <Button className={styles.ViewBtn} onClick={handler} style={{color:'#525ECC'}}>
                        View Report
                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13.5L7 7.5L1 1.5" stroke="#B4B4B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>:
                    <Button className={styles.ViewBtn} style={{cursor:'notAllowed'}}>
                        View Report
                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13.5L7 7.5L1 1.5" stroke="#B4B4B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                </Button>
                }
            </div>
        </div>
     );
}
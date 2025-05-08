import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ToWords } from "to-words";
import styles from './Texts.module.css'


export function ErrorText(props) {
    // import ErrorIcon from '@mui/icons-material/Error';
    const ErrorIcon = dynamic(() => import("@mui/icons-material/Error"), {
        suspense: true,
      });
    return ( 
        <div className={`${styles.ErrorTextContainer} ${props.className}`} style={props.style}>
            <div style={{display:'flex', gap:'7px',flexDirection:'row', justifyContent:'flex-start', alignItems:'center',color:'inherit',fontFamily:'inherit',fontSize:"inherit"}}>
                <ErrorIcon sx={{ color: 'inherit', fontSize:'inherit',...props.iconstyle }} />
                {props.children}
            </div>
             
        </div>
     );
}
// { color: 'red', fontSize: 15, marginRight: '5px' }



export function NumberToWords(props) {
    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
            currency: true,
            ignoreDecimal: false,
            ignoreZeroCurrency: false,
            doNotAddOnly: false,
            currencyOptions: { // can be used to override defaults for the selected locale
                name: 'Rupee',
                plural: 'Rupees',
                symbol: '₹',
                fractionalUnit: {
                    name: 'Paisa',
                    plural: 'Paise',
                    symbol: '',
                },
            }
        }
    });
    return ( 
        <div className={`${styles.NumberToWordsContainer} ${props.className}`} style={props.style}>
            {toWords.convert(props.value)}
        </div>
     );
}


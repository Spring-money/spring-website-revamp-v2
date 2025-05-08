'use client'
import {useState,useEffect} from 'react';

import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

const IconTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: '#686D6C',
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#686D6C',
    },
}));

function ToolTip(props) {
    const [isClient, setIsClient] = useState(false);
    const [isTooltipOpen, setTooltipOpen] = useState(false);

    const handleTooltipToggle = () => {
        setTooltipOpen(!isTooltipOpen);
    };

    useEffect(() => {
        setIsClient(true);
      }, []);

    return ( 
        <>
            {isClient&&(window.innerWidth<props.mobileWidth?(
                // style={{ marginLeft: '5px', marginTop: '-4px', position: 'relative' }}
                // sx={{ fill: '#686D6C', width: '0.9375vw', height: '6.49vh', minWidth: '14px', minHeight: '14px' }}
                <IconTooltip onClick={handleTooltipToggle}  open={isTooltipOpen} title={props.children} placement={props.placement?props.placement:'right'} style={props.style}>
                  <InfoIcon sx={props.iconStyle} />
                </IconTooltip>)
                :(
                <IconTooltip title={props.children} placement={props.placement} style={{position: 'relative',...props.style}}>
                  <InfoIcon sx={{ fill: '#686D6C', width: '0.9375vw', height: '6.49vh', minWidth: '14px', minHeight: '14px' ,...props.iconStyle}} />
                </IconTooltip>))
            }
        </>
     );
}

// <h1 style={{ fontSize: '11px' }}>Choose the younger spouse&apos;s age, if applicable</h1>


export default ToolTip;

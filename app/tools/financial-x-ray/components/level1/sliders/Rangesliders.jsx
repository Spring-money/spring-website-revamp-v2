import {useState} from 'react';
import PropTypes from 'prop-types';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import styles from './Rangesliders.module.css'
function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
        <Tooltip enterTouchDelay={0} placement="top" title={value} >
            {children}
        </Tooltip>
    );
}

ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
};

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#30AB84' : '#30AB84',
  height: '0.8547008547008547vh',
  width:'100%',
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height:'24px',
    width:'24px',
    backgroundColor: '#E6EBEA',
    boxShadow: '0px 3.849311351776123px 8.340174674987793px rgba(0, 0, 0, 0.12)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 3.849311351776123px 8.340174674987793px rgba(0, 0, 0, 0.12)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
    '&:before': {
      boxShadow:
        '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
    },
  },
  '& .MuiSlider-valueLabel': {
    display:'none',
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#E6EBEA' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: ' 1.3675213675213675vh',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#E6EBEA',
    height: '1.3675213675213675vh'
  },
}));

export {IOSSlider};

function Rangeslider(props) {

    return ( 
        <div className={`${styles.Container} ${props.className}`} style={props.style}>
            <IOSSlider valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={0} min={0} max={props.max?props.max:100000000} value={props.value} sx={{ '& .MuiSlider-thumb': { left: `calc(${(props.value/ props.max) * 100}% - 12px)` } }} {...props} style={{}}/>
        </div>
     );
}

export default Rangeslider;
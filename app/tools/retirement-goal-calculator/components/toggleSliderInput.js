'use client'
import React, { useState ,useEffect} from 'react';
import { Text } from "../../../components/tools/Text/index";
import Slider from '@mui/material/Slider';
import plus_circle from "../../../../public/retirement-calculator/plus-circle.svg"
import Image from 'next/image';

const sliderStyle = {
  color: 'gray',
  width: '100%', // Added to match original width
};
const sliderThumbStyle = {
  color: 'white',
  border: '1px solid gray',
  height: '20px',
  width: '20px',
};

export default function SliderComponent({
  parameterName,
  SliderName = 'Goal Amount',
  SliderDesc = 'What is your goal amount worth today?',
  defaultValue = 50,
  minValue = 0,
  maxValue = 100,
  step = 10,
  onSliderChange,
  inputType,
  Add,
  AddText,
  updatedInputValue,
  showPlusCircle,
  onChangeCommited,
  ...props
}) {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleSliderChange = (event, newValue) => {
    let value = parseFloat(newValue);
    setInputValue(value);
    onSliderChange(parameterName, value);
  };

  const handleInputMouseLeave = () =>{
    if (inputValue < minValue) {
      setInputValue(minValue);
      onSliderChange(parameterName, minValue);
    }
    if(inputValue>maxValue){
      setInputValue(maxValue);
      onSliderChange(parameterName, maxValue);
    }
  }

  useEffect(() => {
    if (updatedInputValue) {
      setInputValue(updatedInputValue)
      // onSliderChange(parameterName, updatedInputValue);
    }
  }, [updatedInputValue])

  const handleInputChange = (e) => {
    let value = e.target.value;
    // Remove formatting from the input value
    value = value.replace(/[^\d.-]/g, ''); // Remove all non-numeric characters except dot (.)
    value = Number(value);
    if (!isNaN(value)) {
      setInputValue(value);
      onSliderChange(parameterName, value);
    }
  };


  const formatInputValue = (value) => {
    if (inputType === 'amount') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value;
  };

  return (
    <div className='flex  smd:flex-col w-[95%] h-[8.6rem] '>
      <div className='flex justify-between items-start w-full ml-auto m-4 '>
        <div className='flex flex-col'>
          <Text size='md' as='p' className='mt-px !text-gray-900'>
            {SliderName}
          </Text>
          <Text size='xs' as='p' className='!text-gray-900'>
            {SliderDesc}
          </Text>
        </div>
        <input
          className='focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm p-2 bg-white rounded border border-zinc-800 border-opacity-50'
          type='text'
          placeholder='Enter a value'
          value={formatInputValue(inputValue)}
          onChange={handleInputChange}
          style={{ width: '108px' }}
          onMouseLeave={handleInputMouseLeave}
        />
      </div>
      {Add && (
        <>
          <div onClick={showPlusCircle} className='flex justify-end cursor-pointer gap-1'>
            <Image src={plus_circle} />
            <span className='text-emerald-600 text-xs font-medium font-[Poppins]'>{AddText}</span>
          </div>
        </>
      )}
      <Slider
        value={inputValue}
        onChange={handleSliderChange}
        defaultValue={defaultValue}
        min={minValue}
        max={maxValue}
        aria-label='Small'
        valueLabelDisplay='auto'
        style={sliderStyle}
        step={step}
        onChangeCommitted={onChangeCommited}
        ThumbComponent={CustomThumbComponent} // You can define CustomThumbComponent to match the original slider design if needed
        sx={{
          '& .MuiSlider-thumb': sliderThumbStyle,
          '& .MuiSlider-track': {
            backgroundColor: 'green',
          },
        }}
        className='smd:m-0 smd:ml-2 m-5'
      />
    </div>
  );
}

// You can define CustomThumbComponent to match the original slider design if needed
const CustomThumbComponent = (props) => {
  return <SliderThumbComponent {...props} />;
};

const SliderThumbComponent = React.forwardRef(function SliderThumbComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  return (
    <span
      ref={ref}
      {...other}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'white',
        border: '1px solid gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      {children}
    </span>
  );
});

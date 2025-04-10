import React, { useEffect, useState } from 'react';
import { Text } from "..";
import Slider from '@mui/material/Slider';
import plus_circle from "../../../../public/retirement-calculator/plus-circle.svg"
import editButton from "../../../../public/retirement-calculator/edit-05.svg"
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
  editDetails,
  showPlusCircle,
  onChangeCommited,
  updatedInputValue,
  callRetirementApi,
  AddDetails,
  edit,
  ...props
}) {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleSliderChange = (event, newValue) => {
    let value = parseFloat(newValue);
    setInputValue(value);
    onSliderChange(parameterName, value);
  };

  // useEffect(() => {
  //   if (updatedInputValue) {
  //     setInputValue(updatedInputValue)
  //     onSliderChange(parameterName, updatedInputValue);
  //   }
  //   console.log("djfkgariufhrfheriugheriubgferugheruogheriugheriuhjeriu")
  // }, [updatedInputValue])

  const handleInputMouseLeave = () => {
    if (inputValue < minValue) {
      setInputValue(minValue);
      onSliderChange(parameterName, minValue);
    }
    if (inputValue > maxValue) {
      setInputValue(maxValue);
      onSliderChange(parameterName, maxValue);
    }
  }

  const handleInputChange = (e) => {
    let value = e.target.value;
    console.log("incoming value", value);
    value = value.replace(/[ ]/g, '');
    value = value.replace(/[year]/g, '');
    // Remove formatting from the input value
    console.log("formatted value", value);
    const wvalue = value.replace(/[^\d.-]/g, ''); // Remove all non-numeric characters except dot (.)
    console.log("removing all non numeric characters", wvalue);
    if (wvalue === value) {
      value = value.substring(0, value.length - 1);
      console.log("removing last character", value);
    }
    else {
      value = wvalue;
      console.log("value!=wvalue", value);
    }
    value = Number(value);

    if (!isNaN(value)) {
      if (value > maxValue) {
        value = maxValue;
      }
      if (value < minValue) {
        value = minValue;
      }
      console.log("settingValue", value);
      setInputValue(value);
      onSliderChange(parameterName, value);
      console.log("inputValue", inputValue);
    }
    callRetirementApi(prev => prev + 1);
  } ;

  const formatInputValue = (value) => {
    if (inputType === 'amount') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    } else if (inputType === 'years') {
      return `${value} years`;
    }
    else if (inputType === 'months') {
      return `${value} months`;
    }
    else if (inputType === 'percentage') {
      return `${value} %`;
    }
    return value;
  };

  return (
    <div className='flex flex-col w-[95%] '>
      <div className='flex justify-between items-start w-full ml-auto m-4 '>
        <div className='flex flex-col w-[60%]'>
          <Text size='md' as='p' className='mt-px !text-gray-900'>
            {SliderName}
          </Text>
          <Text size='xs' as='p' className='!text-gray-900'>
            {SliderDesc}
          </Text>
        </div>
        <div className='flex flex-col'>
          <input
            className='focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm p-2 bg-white rounded border border-zinc-800 border-opacity-50'
            type='text'
            placeholder='Enter a value'
            value={formatInputValue(inputValue)}
            onChange={handleInputChange}
            style={{ width: '108px' }}
            onMouseLeave={handleInputMouseLeave}
          />
          {Add && (
            <>
              {editDetails ? (
                <>
                  <div onClick={showPlusCircle} className='flex mt-1 justify-end cursor-pointer gap-1'>
                    <Image src={editButton} />
                    <span className='text-emerald-600 text-xs font-medium font-[Poppins]'>{edit}</span>
                  </div>
                </>
              ) : (
                <>
                  <div onClick={showPlusCircle} className='flex mt-1 justify-end cursor-pointer gap-1'>
                    <Image src={plus_circle} />
                    <span className='text-emerald-600 text-xs font-medium font-[Poppins]'>{AddDetails}</span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
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
        className='smd:ml-3'
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

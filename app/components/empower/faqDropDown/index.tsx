'use client';
import Image from 'next/image'
import React, { useState } from 'react'

interface FaqDropDownProps {
    title: string;
    description: string;
}

const FaqDropDown = ({ title, description }: FaqDropDownProps) => {
    const [isDropDown, setIsDropDown] = useState(false)
    return (
        <div className='flex flex-col gap-2 self-stretch items-start'>
            <button onClick={() => setIsDropDown(!isDropDown)} className='flex items-start gap-4 self-stretch cursor-pointer'>
                <span className='flex-1 text-gray-900 text-start  text-base font-medium'>
                    {title}
                </span>
                <Image src={isDropDown ? "/old-images/minus.svg" : "/old-images/plusIcon.svg"} width={24} height={24} alt='plus icon' />
            </button>
            {isDropDown && <div>
                <span className='self-stretch text-gray-900 text-sm'>
                    {description}
                </span>
            </div>}
        </div>
    )
}

export default FaqDropDown
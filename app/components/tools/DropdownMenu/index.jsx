import React, { useState, useEffect } from 'react';
import { Text } from "./..";
import arrow_down from "../../../public/images/img_arrow_down.svg";
import arrow_right from "../../../public/images/arrow-right.svg";
import Image from "next/image";
import Link from "next/link";

function Index() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  // Load selected link from local storage on initial render
  useEffect(() => {
    const storedLink = localStorage.getItem('selectedLink');
    if (storedLink) {
      setSelectedLink(storedLink);
    }
  }, []);

  const handleLinkClick = (link) => {
    setSelectedLink(link === selectedLink ? null : link);
    setIsOpen(false); // Close the dropdown after clicking a link
    // Store selected link in local storage
    localStorage.setItem('selectedLink', link === selectedLink ? null : link);
  };

  return (
    <div className="flex flex-col w-full justify-between text-sm bg-white-A700 items-stretch text-gray-900">
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <div className='text-left flex justify-between border-solid w-full pl-[11px] pr-[15px] py-[15px]'>
          Loan EMI Calculator <Image src={arrow_down} className="h-[18px] w-[18px]" />
        </div>
      </button>
      {isOpen && (
        <div className='border border-solid border-gray-900_3f text-xs'>

            <div
              className={`flex w-full justify-between down py-[15px] pl-[11px] pr-[15px]  ${selectedLink === 'personal' ? ' border-l-4 border-teal-600 ' : ''}`}
              onClick={() => handleLinkClick('personal')}
            >
              <Link href='/academy/tools/personal-loan-emi-calculator'>
                <h4 className={`${selectedLink === 'personal' ? '' : ''}`}>Personal Loan EMI Calculator</h4>
              </Link>
            </div>
            <div className='border border-solid border-gray-900_3f'></div>
            <div
              className={`flex w-full justify-between down py-[15px] pl-[11px] pr-[15px] ${selectedLink === 'twoWheeler' ? 'border-l-4 border-teal-600' : ''}`}
              onClick={() => handleLinkClick('twoWheeler')}
            >
              <Link href='/academy/tools/two-wheeler-emi-calculator'>
                <h4 className={`${selectedLink === 'twoWheeler' ? '' : ''}`}>Two Wheeler Loan EMI Calculator</h4>
              </Link>
            </div>
            <div className='border border-solid border-gray-900_3f'></div>
            <div
              className={`flex w-full justify-between down py-[15px] pl-[11px] pr-[15px] ${selectedLink === 'car' ? 'border-l-4 border-teal-600' : ''}`}
              onClick={() => handleLinkClick('car')}
            >
              <Link href='/academy/tools/car-loan-emi-calculator'>
                <h4 className={`${selectedLink === 'car' ? '' : ''}`}>Car Loan EMI Calculator</h4>
              </Link>
            </div>
            <div className='border border-solid border-gray-900_3f'></div>
            <div
              className={`flex w-full justify-between down py-[15px] pl-[11px] pr-[15px] ${selectedLink === 'Home' ? 'border-l-4 border-teal-600' : ''}`}
              onClick={() => handleLinkClick('Home')}
            >
              <Link href='/academy/tools/home-loan-emi-calculator'>
                <h4 className={`${selectedLink === 'Home' ? '' : ''}`}>Home Loan EMI Calculator</h4>
              </Link>
            </div>
            <div className='border border-solid border-gray-900_3f'></div>
            <div
              className={`flex w-full justify-between down py-[15px] pl-[11px] pr-[15px] ${selectedLink === 'Education' ? 'border-l-4 border-teal-600' : ''}`}
              onClick={() => handleLinkClick('Education')}
            >
              <Link href='/academy/tools/education-loan-calculator'>
                <h4 className={`${selectedLink === 'Education' ? '' : ''}`}>Education Loan EMI Calculator</h4>
              </Link>
             </div>

        </div>
      )}
    </div>
  );
}

export default Index;

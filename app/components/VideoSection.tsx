import React from 'react';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const VideoSection: React.FC = () => {
  return (
    <div className="mx-auto flex flex-col gap-4 items-center px-4 md:max-xl:px-[60px] py-8 md:py-16">
      <p className="text-[#108E66] text-[40px] font-semibold text-center">
        How it works ?
      </p>
      <div className="p-4 md:p-8 flex flex-col md:flex-row gap-8 w-full justify-center bg-[#FCFFFE] border rounded border-[#108E66] max-w-screen-xl">
        <div className="block md:w-[45%]">
          <Image
            src={"../../images/nikhil-51.svg"}
            width={1032}
            height={400}
            alt="Illustration of the financial planning process"
          />
        </div>
        <div className="flex flex-col justify-between w-full md:w-[55%]">
          <div className="flex flex-col gap-2">
            <p className="text-[#272A2B] text-[32px] font-bold">
              Financial Planning, Simplified: A Step-by-Step Guide
            </p>
            <p className="text-[#272a2bbf] text-2xl font-normal">
              Learn how Spring Money simplifies financial planning. This video
              guides you through the process, from goal setting to expert
              advisor support. Gain clarity and achieve your financial
              aspirations.
            </p>
          </div>
          <Link href={"https://youtu.be/0LTAmuIidsI?si=IsnPYX6k3iHd5rTn"} target="_blank" rel="noopener noreferrer">
            <button className="w-fit px-6 py-3 border border-[#108E66] rounded text-[#108E66] text-base font-semibold">
              Watch full video on Youtube
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;

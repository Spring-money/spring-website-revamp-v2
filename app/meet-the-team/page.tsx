"use client";
import Image from "next/image";
import { CoFounder, Squad } from "../components/MeetTheTeam";

export default function MeetTheTeam() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Page Title */}
        <section className="mb-8 mt-16">
          <div className="py-4 px-4 text-[#272B2A] text-4xl font-semibold text-center">
            Meet The Team
          </div>
        </section>

        {/* Co-founders */}
        <section className="flex flex-col mb-8 px-8 items-center">
          <h2 className="text-2xl text-center font-semibold mb-4">
            Co-founders
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-56 ">
            <CoFounder
              image="/meet-the-team/nikhil.svg"
              name="Nikhil Narkhedkar (CEO)"
              linkedinUrl="https://www.linkedin.com/in/nikhil-narkhedkar/"
            />
            <CoFounder
              image="/meet-the-team/Omkar.svg"
              name="Omkar Jadhav"
              linkedinUrl="https://www.linkedin.com/in/omkarjadhav1995/"
            />
          </div>
        </section>

        {/* Meet the Squad */}
        <section className="py-4 px-4 justify-center mb-8">
          <h2 className="text-2xl text-center font-semibold mb-4">
            Meet the Squad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6 justify-center">
            <Squad
              image="/meet-the-team/Arnav.svg"
              name="Arnav Limaye"
              linkedinUrl="https://www.linkedin.com/in/arnav-limaye/"
              title="Engineering"
            />
            <Squad
              image="/meet-the-team/Sheetal.svg"
              name="Sheetal Datir"
              linkedinUrl="https://www.linkedin.com/in/sheetal-datir-697b1520a/"
              title="Engineering"
            />
            <Squad
              image="/meet-the-team/Rishabh.svg"
              name="Rishabh Shetty"
              linkedinUrl="https://www.linkedin.com/in/rishabhshetty/"
              title="UI UX & Design"
            />
            <Squad
              image="/meet-the-team/Neeraj.svg"
              name="Neeraj Singh"
              linkedinUrl="https://www.linkedin.com/in/neeraj-singh-achara/"
              title="Engineering"
            />
            <Squad
              image="/meet-the-team/Ravinder.svg"
              name="Ravinder Singh"
              linkedinUrl="https://www.linkedin.com/in/ravindersingh36/"
              title="Engineering"
            />
            <Squad
              image="/meet-the-team/Khushi.svg"
              name="Khushi Pawar"
              linkedinUrl="https://www.linkedin.com/in/khushi-pawar-30042b200/"
              title="Product"
            />
            <Squad
              image="/meet-the-team/Sahil.svg"
              name="Sahil Panda"
              linkedinUrl="https://www.linkedin.com/in/sahil-panda-10360719b/"
              title="Product & Design"
            />
            <Squad
              image="/meet-the-team/Saurabh.svg"
              name="Saurabh Pharate"
              linkedinUrl="https://www.linkedin.com/in/saurabhpharate/"
              title="Engineering"
            />
            <Squad
              image="/meet-the-team/Nirmal.svg"
              name="Nirmal Nehra"
              linkedinUrl="https://www.linkedin.com/in/nirmal-nehra-637048226/"
              title="Engineering"
            />
            <Squad
              image="/meet-the-team/Akhilesh.svg"
              name="Akhilesh Patidar"
              linkedinUrl="https://www.linkedin.com/in/akhilesh-patidar-8113a2258/"
              title="Engineering"
            />
          </div>
        </section>
        <div className="flex flex-col items-center">
          <span className="text-[#272B2A] text-xl font-bold text-center">
            Recognised by
          </span>
          <div className="flex flex-col lg:flex-row gap-8 mt-4 items-center">
            <Image
              src={"/meet-the-team/infinity.svg"}
              width={233}
              height={63}
              alt="infinity logo"
            />
            <Image
              src={"/meet-the-team/appscale.svg"}
              width={395}
              height={85}
              alt="appscale logo"
            />
            <Image
              src={"/meet-the-team/gsf.svg"}
              width={331}
              height={70}
              alt="appscale logo"
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 mt-8 items-center">
            <Image
              src={"/meet-the-team/startup.svg"}
              width={244}
              height={50}
              alt="appscale logo"
            />
            <Image
              src={"/meet-the-team/garge-marathi.svg"}
              width={143}
              height={88}
              alt="appscale logo"
            />
          </div>
        </div>
      </main>
      <div className="flex flex-col py-8 md:py-16 items-center justify-center bg-[#108E66] w-full mt-8 md:mt-16 px-4">
        <Image
          src={"/logo2.svg"}
          width={300}
          height={100}
          alt="spring money logo"
        ></Image>
        <span className="text-[#FCFFFE] text-[28px] font-semibold mt-4 text-center">
          One platform for your journey towards financial freedom.
        </span>
      </div>
    </div>
  );
}

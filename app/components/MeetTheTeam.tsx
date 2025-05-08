import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const CoFounder = ({
  image,
  name,
  linkedinUrl,
}: {
  image: string;
  name: string;
  linkedinUrl: string;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col gap-4 items-center"
    >
      <div className="relative">
        <Image
          src={image}
          width={262}
          height={262}
          className="rounded-full"
          alt={name}
        />
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => {
              window.open(linkedinUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <Image
              src="/meet-the-team/linkedin.svg"
              width={65}
              height={65}
              alt="linkedin logo"
            />
          </motion.div>
        )}
      </div>
      <h3 className="text-xl text-center font-bold">{name}</h3>
    </button>
  );
};

const Squad = ({
  image,
  name,
  linkedinUrl,
  title,
}: {
  image: string;
  name: string;
  linkedinUrl: string;
  title: string;
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-[#272B2A] flex flex-col items-center"
    >
      <div className="relative">
        <Image
          src={image}
          width={122}
          height={122}
          className="rounded-full"
          alt={name}
        />
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => {
              window.open(linkedinUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <Image
              src="/meet-the-team/linkedin.svg"
              width={48}
              height={48}
              alt="linkedin logo"
            />
          </motion.div>
        )}
      </div>
      <span className="text-lg font-semibold mt-2">{name}</span>
      <span className="text-base font-medium">{title}</span>
    </button>
  );
};

export { CoFounder, Squad };

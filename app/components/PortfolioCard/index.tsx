import Image from "next/image";
import Link from "next/link";

interface PortfolioCardProps {
  image: string;
  title: string;
  link: string;
  linkText?: string;
  isImage?: boolean;
  secondayImage?: string;
}

const PortfolioCard = ({ image, title, link, linkText = "Watch On Youtube", isImage = false, secondayImage }: PortfolioCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {isImage ? (
        <Image src={image} width={364} height={200} alt="youtube video player" />
      ) : (
        <video
          className="w-full h-[200px] object-cover"
          src={image}
          width="364"
          height="200"
          autoPlay
          loop
          muted
        />
      )}
      <div className="flex flex-col gap-2 items-center justify-center">
        <span className="text-2xl font-semibold text-gray-900 text-center">
          {title}
        </span>
        <Link href={link} className="flex gap-2 items-center">
          <span className="text-xl font-semibold text-green-500">
            {linkText}
          </span>
          {secondayImage && (
            <Image src={secondayImage} alt="arrow" width={24} height={24} />
          )}
        </Link>
      </div>
    </div>
  );
};

export default PortfolioCard;

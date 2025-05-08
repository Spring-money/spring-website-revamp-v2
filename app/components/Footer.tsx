import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-[#272B2A] flex flex-col items-center">
      <div className="px-4 md:max-xl:px-[60px] w-full max-w-screen-xl">
        <div className="text-lg font-medium flex py-8 justify-center">
          <span className="text-[#fcfffe8a]">
            <span className="text-[#FCFFFE]">Our vision</span>{" "}
            is to help bring about a world that confidently makes smart
            financial decisions.
          </span>
        </div>
        <div className="flex flex-col lg:flex-row items-center text-center lg:text-start justify-between py-8 border border-y-[#fcfffe8a] border-x-0">
          <div>
            <span className="text-[#FCFFFE] text-sm font-medium mb-2">
              Download the app
            </span>
            <div className="flex gap-4 mb-4 mt-2 lg:mt-0">
              <Link
                href={
                  "https://play.google.com/store/apps/details?id=com.spring.money"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/footer/play-store.svg"}
                  width={160}
                  height={40}
                  alt="play store image"
                />
              </Link>
              <Link
                href={"https://apps.apple.com/in/app/spring-money/id1660751993"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/footer/app-store.svg"}
                  width={160}
                  height={40}
                  alt="app store image"
                />
              </Link>
            </div>
            <span className="text-[#FCFFFE] text-sm font-medium mb-2">
              Our Socials
            </span>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link
                href={"https://wa.me/+918668484607"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/footer/whatsapp.svg"}
                  width={32}
                  height={32}
                  alt="WhatsApp social media icon"
                />
              </Link>
              <Link
                href={"https://www.instagram.com/springmoneyapp/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/footer/instagram.svg"}
                  width={32}
                  height={32}
                  alt="Instagram social media icon"
                />
              </Link>
              <Link
                href={"https://www.linkedin.com/company/springmoney/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/footer/linkedin.svg"}
                  width={32}
                  height={32}
                  alt="LinkedIn social media icon"
                />
              </Link>
              <Link
                href={"https://www.youtube.com/@springmoney"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={"/footer/youtube.svg"}
                  width={32}
                  height={32}
                  alt="YouTube social media icon"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-8 lg:mt-0">
            <span className="text-[#fcfffe8a] text-base font font-medium">
              Quick Links
            </span>
            <Link
              href={"/services"}
              className="text-[#FCFFFE] text-sm font-normal"
            >
              Financial Planning
            </Link>
            <Link
              href={"/tools"}
              className="text-[#FCFFFE] text-sm font-normal"
            >
              Tools
            </Link>
            <Link
              href={"/for-ria"}
              className="text-[#FCFFFE] text-sm font-normal"
            >
              For Advisors
            </Link>
            <Link
              href={"/for-amc"}
              className="text-[#FCFFFE] text-sm font-normal"
            >
              For AMC
            </Link>
            <Link
              href={"/blog"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FCFFFE] text-sm font-normal"
            >
              Blogs
            </Link>
          </div>
          <div className="hidden lg:flex flex-col gap-2">
            <span className="text-[#fcfffe8a] text-base font font-medium">
              Read Blogs About
            </span>
            <Link
              href={
                "/blog/the-trusted-financial-advisory-that-changed-everything-harshal-patil-s-financial-transformation"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-[#FCFFFE] text-sm font-normal">
                Financial transformation led by advisory
              </span>
            </Link>
            <Link
              href={
                "/blog/why-trusting-the-right-investment-firm-is-key-to-smart-investments"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-[#FCFFFE] text-sm font-normal">
                Trusting the right investment advisor
              </span>
            </Link>
            <Link
              href={
                "/blog/how-to-verify-if-your-investment-advisor-is-sebi-registered"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-[#FCFFFE] text-sm font-normal">
                Guide to verify SEBI Registered Advisors
              </span>
            </Link>
            <Link
              href={
                "/blog/the-ultimate-checklist-for-managing-your-personal-finances"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-[#FCFFFE] text-sm font-normal">
                Personal finance management checklist
              </span>
            </Link>
          </div>
        </div>
        <div className="py-8 flex flex-col gap-4 items-center text-center">
          <span className="text-[#fcfffe8a] text-sm font-normal">
            Office Address: 5th Floor, MIT TBI, Kashyap Building, MIT WPU
            Campus, Rambaug Colony, Kothrud, Pune, Maharashtra 411038
          </span>
          <div className="flex flex-col-reverse lg:flex-row gap-2 lg:gap-4">
            <span className="text-[#fcfffe8a] text-xs font-medium">
              © 2023 by 2AN Technologies Private Limited
            </span>
            <Link
              className="text-[#FCFFFE] text-xs font-semibold"
              href={"/privacy-policy"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            <Link
              href={"/terms-of-service"}
              className="text-[#FCFFFE] text-xs font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// components/ClientHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const NavLink = ({ href, children, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const getActiveStyles = () => {
    if (!isActive) return "text-[#272B2A] font-normal border-none";
    return href === "/for-ria"
      ? "text-[#525ECC] font-bold border-[#525ECC]"
      : "text-[#108e66] font-bold border-[#108e66]";
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`transition-colors px-2 lg:py-6 ${getActiveStyles()} hover:text-[#108e66] border-b-2 lg:border-b-4`}
    >
      {children}
    </Link>
  );
};

const ClientHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#fcfffe] shadow-md border-b border-b-[#108e66]">
      <div className="mx-auto py-4 px-4 md:max-xl:px-[60px] w-full max-w-screen-xl">
        <div className="flex justify-between items-center">
          {/* Site Logo/Title */}
          <Link
            href={"/"}
            className="outline-none border-none no-underline decoration-0"
          >
            <Image
              src="/logo.svg"
              width={205}
              height={35}
              alt="spring money logo"
              className="outline-none border-none no-underline decoration-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <nav>
              <ul className="flex items-center gap-4">
                <li>
                  <NavLink href="/">Home</NavLink>
                </li>
                <li>
                  <NavLink href="/services">Financial Planning</NavLink>
                </li>
                <li>
                  <NavLink href="/tools">Tools</NavLink>
                </li>
                <li>
                  <NavLink href="/for-ria">For Advisors</NavLink>
                </li>
                <li>
                  <NavLink href="/for-amc">For AMC</NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="ml-4 hidden lg:flex">
            <a
              href="https://wa.me/+918668484607"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#108e66] text-[#fcfffe] px-6 py-2 rounded-md hover:bg-[#fcfffe] hover:text-[#108e66] border border-[#108e66] transition"
            >
              Get in touch
            </a>
          </div>
          {/* Hamburger Menu Button */}
          <button
            className="lg:hidden text-[#272B2A]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4">
            <nav>
              <ul className="flex flex-col gap-4">
                <li>
                  <NavLink href="/" onClick={toggleMenu}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/services" onClick={toggleMenu}>
                    Financial Planning
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/tools" onClick={toggleMenu}>
                    Tools
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/for-ria" onClick={toggleMenu}>
                    For RIA
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/for-amc" onClick={toggleMenu}>
                    For AMC
                  </NavLink>
                </li>
              </ul>
            </nav>
            <div className="mt-4">
              <a
                href="https://wa.me/+918668484607"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#108e66] text-[#fcfffe] px-6 py-2 rounded-md hover:bg-[#fcfffe] hover:text-[#108e66] border border-[#108e66] transition"
              >
                Get in touch
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ClientHeader;

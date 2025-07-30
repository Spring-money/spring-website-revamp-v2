import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Use Poppins instead of Inter
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Choose the weights you need
});

export const metadata: Metadata = {
  title: "Spring Money",
  description: "Partner with Spring Money to build lasting prosperity. We create personalized strategies to grow your personal assets and secure capital for your most important objectives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${poppins.variable} antialiased`}>
      {children}
    </div>
  );
}

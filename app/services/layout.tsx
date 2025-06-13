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
  description: "Discover comprehensive financial services from Spring Money. We offer personalized solutions for wealth management, investments, loans, and more to help you achieve your financial goals.",
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

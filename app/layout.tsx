// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import ClientHeader from "./components/ClientHeader"; // Directly import the client header
import FAQAccordion from "./components/FAQAccordion";
import Footer from "./components/Footer";
import { AppProvider } from "./RetirementReportContext";
import Script from "next/script";

export const metadata = {
  title: "Spring Money",
  description: "Elegant financial planning with modern, responsive design",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <html lang="en">
        <head>
          {/* Ensure proper scaling on mobile devices */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        {/* Global body styles: using our off‑white (#fcfffe) background and dark text (#272B2A) */}
        <body className="font-sans antialiased bg-[#fcfffe] text-[#272B2A]">
          <ClientHeader />
          <Script
            src="https://gateway.smallcase.com/scdk/2.0.0/scdk.js"
            strategy="beforeInteractive" // or "afterInteractive" depending on when you need it
          />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </AppProvider>
  );
}

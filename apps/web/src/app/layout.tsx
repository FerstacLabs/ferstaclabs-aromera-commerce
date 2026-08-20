import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aromera | Premium etriyyat",
  description: "Premium etriyyat ve sexsi stil ucun secilmis etirler.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="az">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

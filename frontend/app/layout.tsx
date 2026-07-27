import type { Metadata } from "next";

import { Roboto } from "next/font/google";
import "./globals.css";


const roboto = Roboto({
  weight: "400",
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop.co",
  description: "A curated marketplace. Every seller earns their place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={` ${roboto.className}`}>
      <body className="font-sans antialiased">
     
        {children}
       
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700'],
  variable: '--font-plex',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "Fuel Finder",
  description: "A website that does a multitude of things related to fuel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} font-plex antialiased bg-gradient-to-b from-[#f2f5f2] via-[#e0e8e0] to-[#d8e8d8] text-[#171717]`}
      >
        {children}
      </body>
    </html>
  );
}

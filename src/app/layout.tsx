import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AEON X | UNIBEN Pharmacy Mastery",
  description: "Intelligent study and testing engine for Pharmacy students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen pb-20 md:pt-20 md:pb-0`}>
        <Navbar />
        <main className="max-w-md mx-auto px-4 py-8 md:max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}

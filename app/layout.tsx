import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionRecorder from "@/components/SessionRecorder";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Session Intelligence",
  description: "Record and analyze user sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionRecorder />
        {children}
      </body>
    </html>
  );
}

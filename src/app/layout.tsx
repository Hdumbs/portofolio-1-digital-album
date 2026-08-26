import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Skye Digital Yearbook | SMP & SMK Skye Digitalpreneur",
    template: "%s | Skye Digital Yearbook",
  },
  description: "Platform Album Digital Buku Tahunan Resmi SMP & SMK Skye Digitalpreneur",
  icons: {
    icon: "/logo/Default.jpg",
    shortcut: "/logo/Default.jpg",
    apple: "/logo/Default.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

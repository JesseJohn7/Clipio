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
  title: "Clipio • Download videos instantly",
  description:
    "Download videos from TikTok, Instagram, X, Facebook, and more instantly in full quality.",

  icons: {
    icon: "/clipio.png",
    shortcut: "/clipio.png",
    apple: "/clipio.png",
  },

  openGraph: {
    title: "Clipio",
    description:
      "Fast and effortless video downloads in full quality.",
    images: ["/clipio.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "Clipio",
    description:
      "Download videos instantly in full quality.",
    images: ["/clipio.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        {children}
      </body>
    </html>
  );
}
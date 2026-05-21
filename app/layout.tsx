import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister"
import InstallPrompt from "@/components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clipio-tau.vercel.app"),
  title: "Clipio • Download videos instantly",
  description:
    "Download videos from TikTok, Instagram, X, Facebook, and more instantly in full quality.",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Clipio",
  },

  icons: {
    icon: "/clipiodark.png",
    shortcut: "/clipiodark.png",
    apple: "/clipiodark.png",
  },

  openGraph: {
    title: "Clipio",
    description: "Fast and effortless video downloads in full quality.",
    images: ["/clipiodark.png"],
  },

  twitter: {
    card: "summary_large_image",
    title: "Clipio",
    description: "Download videos instantly in full quality.",
    images: ["/clipiodark.png"],
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
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        <ServiceWorkerRegister />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
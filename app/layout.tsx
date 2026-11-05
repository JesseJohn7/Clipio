import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#09090d',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://clipio.online'),
  title: {
    default: 'Clipio — Free Video Downloader for TikTok, Instagram, Facebook, X & LinkedIn',
    template: '%s | Clipio',
  },
  description:
    'Download TikTok, Instagram, Facebook, X (Twitter) and LinkedIn videos for free in full HD quality. No watermark, no sign-up needed. Fast, easy, and free video downloader online.',
  keywords: [
    'video downloader',
    'tiktok downloader',
    'tiktok video downloader',
    'download tiktok without watermark',
    'instagram video downloader',
    'download instagram reels',
    'facebook video downloader',
    'x video downloader',
    'twitter video downloader',
    'linkedin video downloader',
    'free video downloader online',
    'download videos online',
    'social media video downloader',
    'clipio',
  ],
  authors: [{ name: 'Clipio', url: 'https://clipio.online' }],
  creator: 'Clipio',
  publisher: 'Clipio',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Clipio',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clipio.online',
    siteName: 'Clipio',
    title: 'Clipio — Free Video Downloader for TikTok, Instagram, Facebook, X & LinkedIn',
    description:
      'Download TikTok, Instagram, Facebook, X and LinkedIn videos for free in full HD quality. No watermark. No sign-up.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clipio — Free Video Downloader',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clipio — Free Video Downloader',
    description:
      'Download TikTok, Instagram, Facebook, X & LinkedIn videos for free in full HD. No watermark.',
    images: ['/og-image.png'],
    creator: '@Jesse_can_code',
    site: '@Jesse_can_code',
  },
  alternates: {
    canonical: 'https://clipio.online',
  },
  verification: {
    google: 'K5oc9P4LlT05gye2fzmEC5LY-bcawiQbAYGoA_WyvhE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Clipio',
              url: 'https://clipio.online',
              description:
                'Free online video downloader for TikTok, Instagram, Facebook, X (Twitter) and LinkedIn. Download videos in full HD quality with no watermark.',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Any',
              browserRequirements: 'Requires JavaScript',
              offers: [
                {
                  '@type': 'Offer',
                  name: 'Free Plan',
                  price: '0',
                  priceCurrency: 'NGN',
                  description: 'Unlimited video downloads, completely free',
                },
              ],
              featureList: [
                'Download TikTok videos without watermark',
                'Download Instagram Reels',
                'Download Facebook videos',
                'Download X (Twitter) videos',
                'Download LinkedIn videos',
                'Full HD quality downloads',
                'MP3 audio extraction',
                'No sign-up required',
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Catches the browser's install prompt early so the Install app button can use it */}
        <Script id="capture-install-prompt" strategy="beforeInteractive">
          {`window.addEventListener('beforeinstallprompt', function (e) {
            e.preventDefault();
            window.__clipioInstallPrompt = e;
          });`}
        </Script>

        {children}
      </body>
    </html>
  )
}
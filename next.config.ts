import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const isProd = process.env.NODE_ENV === "production";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: !isProd, // PWA only runs in production builds, never in `npm run dev`
  scope: "/",
  runtimeCaching: [
    {
      // cache pages and assets, but never API routes or video downloads
      urlPattern: /^https:\/\/(?!.*\/api\/).*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "https-calls",
        networkTimeoutSeconds: 15,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  turbopack: {},
};

export default withPWA(nextConfig as any);
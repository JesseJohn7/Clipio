import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  scope: "/",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*/,
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
};

export default withPWA(nextConfig as any);
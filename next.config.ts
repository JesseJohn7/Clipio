import type { NextConfig } from "next";
import withPWAInit from "next-pwa";
import path from "path";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
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
  turbopack: {},
  productionBrowserSourceMaps: false,
};

export default withPWA(nextConfig as any);
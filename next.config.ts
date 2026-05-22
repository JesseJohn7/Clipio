import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  scope: "/",
  sw: "/sw.js",
  disable: false, // Enable PWA in all environments
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig as any);
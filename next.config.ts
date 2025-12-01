import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000logos.net",
      },
    ],
  },
};

export default nextConfig;

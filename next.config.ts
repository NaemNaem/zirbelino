import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.zirbenprodukte.at",
      },
    ],
  },
};

export default nextConfig;

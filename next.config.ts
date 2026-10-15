import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bijou-cosmetics.s3.me-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bijou-sky-bucket.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "staging-front.bijou.ae",
      },
    ],
  },
};

export default nextConfig;

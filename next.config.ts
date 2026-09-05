import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok tunnels to connect for HMR WebSocket (dev only)
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],

  // Automatically bypass ngrok browser warning interstitial page
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "ngrok-skip-browser-warning",
            value: "1",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

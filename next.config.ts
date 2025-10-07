import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://ik.imagekit.io/NebulaDev/",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

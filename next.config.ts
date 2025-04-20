import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true, // enables "use cache"
  },
};

export default nextConfig;

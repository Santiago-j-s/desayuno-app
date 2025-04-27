import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true, // enables "use cache"
    clientSegmentCache: true,
    viewTransition: true,
  },
};

export default nextConfig;

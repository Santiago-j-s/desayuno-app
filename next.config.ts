import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true, // enables "use cache"
    viewTransition: true,
    reactCompiler: true,
  },
};

export default nextConfig;

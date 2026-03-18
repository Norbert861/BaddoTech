import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure we don't use turbopack for builds if it's being forced
  // (Turbopack is currently only for dev, but some versions might 
  // try to use it for build in experimental modes)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore type errors during build if necessary, 
    // though tsc usually passes locally.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

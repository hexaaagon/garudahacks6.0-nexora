import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable server components prerendering for middleware-dependent routes
    serverComponentsExternalPackages: ["better-auth"],
  },
  // Ensure proper handling of middleware during build
  output: undefined,
};

export default nextConfig;

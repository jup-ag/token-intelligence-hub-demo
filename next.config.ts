import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use empty turbopack config to silence warning
  turbopack: {},
  serverExternalPackages: ['ws'],
  // Disable static optimization for pages using wallet
  experimental: {
    optimizePackageImports: ['@solana/kit', '@wallet-standard/react'],
  },
};

export default nextConfig;

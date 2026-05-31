import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    '@livekit/components-react',
    '@livekit/components-core',
    '@livekit/components-styles',
    'livekit-client',
  ],
};

export default nextConfig;

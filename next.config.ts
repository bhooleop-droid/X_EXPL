import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/X_EXPL' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: process.env.NODE_ENV === "production" ? "/portafolio" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

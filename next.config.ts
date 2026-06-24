import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/global-brokers-demo-es",
  images: { unoptimized: true },
};

export default nextConfig;

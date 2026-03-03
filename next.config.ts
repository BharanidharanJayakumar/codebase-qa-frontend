import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0"],
  output: "standalone",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/shop/aromera-noir-essence", destination: "/shop/noir-essence", permanent: true }];
  },
};

export default nextConfig;

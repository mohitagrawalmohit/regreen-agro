import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Static export for GoDaddy/CPANEL
 

  // ✅ Disable Next.js server image optimization (required for static export)
  images: {
    unoptimized: true,
    domains: ["localhost", "regreenagro-backend.onrender.com"], // your backend API/domain
  },
};

export default nextConfig;

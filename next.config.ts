import type { NextConfig } from "next";

/**
 * Where `/api/*` requests are proxied (server-side). Same-origin browser calls → no CORS.
 * - Optional `API_PROXY_TARGET` (server-only) overrides only the rewrite destination.
 * - Else `NEXT_PUBLIC_API_BASE_URL` if set (e.g. https://…/api).
 * - Else production default.
 */
const apiRewriteTarget = (
  process.env.API_PROXY_TARGET ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://medplat.onrender.com/api"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard", destination: "/hospital/dashboard", permanent: true },
      { source: "/dashboard/:path*", destination: "/hospital/dashboard/:path*", permanent: true },
      { source: "/patients", destination: "/hospital/patients", permanent: true },
      { source: "/patients/:path*", destination: "/hospital/patients/:path*", permanent: true },
      { source: "/cases", destination: "/hospital/cases", permanent: true },
      { source: "/cases/:path*", destination: "/hospital/cases/:path*", permanent: true },
      { source: "/update", destination: "/hospital/update", permanent: true },
      { source: "/update/:path*", destination: "/hospital/update/:path*", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiRewriteTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;

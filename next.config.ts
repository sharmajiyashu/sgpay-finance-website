import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3qyrkd33l2bc9.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/admin/login", destination: "/login", permanent: false },
      { source: "/dashboard", destination: "/admin/dashboard", permanent: true },
      { source: "/enquiries", destination: "/admin/enquiries", permanent: true },
      { source: "/user-management", destination: "/admin/users", permanent: true },
      { source: "/user-management/:path*", destination: "/admin/users", permanent: true },
      { source: "/subscriptions", destination: "/admin/dashboard", permanent: true },
      { source: "/reports", destination: "/admin/dashboard", permanent: true },
      { source: "/notifications", destination: "/admin/dashboard", permanent: true },
      { source: "/account-deletions", destination: "/admin/dashboard", permanent: true },
      { source: "/manage-projects", destination: "/admin/dashboard", permanent: true },
      { source: "/administration/:path*", destination: "/admin/dashboard", permanent: true },
    ];
  },
};

export default nextConfig;

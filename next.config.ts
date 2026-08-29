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
      {
        source: "/admin/enquiries/:category",
        destination: "/admin/enquiries?type=:category",
        permanent: false,
      },
      {
        source: "/admin/agents/:status",
        destination: "/admin/agents?status=:status",
        permanent: false,
      },
      {
        source: "/admin/choice-connect/roar-referral-link",
        destination: "/admin/choice-connect/roar-bank-enquiry",
        permanent: false,
      },
      {
        source: "/agent/choice-connect/roar-referral-link",
        destination: "/agent/choice-connect/roar-bank-enquiry",
        permanent: false,
      },
      {
        source: "/admin/choice-connect/loans",
        destination: "/admin/choice-connect/credit-card",
        permanent: false,
      },
      {
        source: "/agent/choice-connect/loans",
        destination: "/agent/choice-connect/credit-card",
        permanent: false,
      },
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

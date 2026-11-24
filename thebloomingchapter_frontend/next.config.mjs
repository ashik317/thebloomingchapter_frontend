/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    // react-pdf / pdf.js: skip the optional node "canvas" dependency
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;

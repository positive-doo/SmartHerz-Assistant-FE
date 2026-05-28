const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: BASE,

  assetPrefix: BASE ? BASE : undefined,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cybercompany.ai",
      },
    ],
  },
};

module.exports = nextConfig;
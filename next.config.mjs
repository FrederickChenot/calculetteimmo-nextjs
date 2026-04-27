/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: ".",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "calculetteimmo.com" }],
        destination: "https://www.calculetteimmo.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure server-only packages don't leak into client bundles
  experimental: {
    serverComponentsExternalPackages: [
      "@google-cloud/storage",
      "@google-cloud/firestore",
      "@google-cloud/tasks",
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloud Run 배포용 경량 standalone 출력 (.next/standalone)
  output: "standalone",
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

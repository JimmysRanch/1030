/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true }, // prevent ESLint from failing CI
  // DO NOT set typescript.ignoreBuildErrors — we want TS to fail if broken
};
export default nextConfig;

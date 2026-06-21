import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Verhindert die "multiple lockfiles"-Warnung: Projektordner als Root festlegen.
  outputFileTracingRoot: path.resolve(import.meta.dirname),
  // Linting läuft separat; Builds sollen daran nicht scheitern.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Typfehler sollen den Build weiterhin stoppen (Qualitätssicherung).
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

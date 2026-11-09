import path from "node:path";
import type { NextConfig } from "next";

const monorepoRoot = path.resolve(process.cwd(), "..");

/**
 * STATIC_EXPORT=1 — статичний білд для GitHub Pages (папка out/).
 * NEXT_PUBLIC_BASE_PATH — підпапка сайту, напр. /landing-igor/jcb.
 * Без STATIC_EXPORT — звичайний Next.js з API-роутом заявок (Vercel / власний сервер).
 */
const isExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@landing/ui"],
  turbopack: { root: monorepoRoot },
  outputFileTracingRoot: monorepoRoot,
  poweredByHeader: false,
  basePath,
  // route.server.ts (API заявок) підключається лише в серверному режимі
  pageExtensions: isExport ? ["tsx", "ts"] : ["server.ts", "tsx", "ts"],
  ...(isExport
    ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } }
    : {
        images: { formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/(.*)", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;

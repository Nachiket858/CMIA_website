import type { NextConfig } from "next";

/**
 * Static export.
 *
 * The chamber's existing site runs on shared Apache/PHP hosting, so the build
 * target is plain static HTML that can be dropped anywhere. Redirects for the
 * old .php URLs therefore cannot live here (next.config `redirects` needs a
 * Node server) — they ship as host config instead:
 *
 *   public/.htaccess     Apache (the current host)
 *   public/_redirects    Netlify / Cloudflare Pages
 *   public/vercel.json   Vercel
 *
 * All three are generated from the single source of truth in lib/redirects.ts
 * by scripts/build-redirects.mjs. See README.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Images are pre-processed to AVIF/WebP by scripts/optimize.mjs, so the
    // built-in optimizer (unavailable in static export) is not used.
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;

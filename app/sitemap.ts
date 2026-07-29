import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/redirects";

const BASE = "https://www.cmia.co.in";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

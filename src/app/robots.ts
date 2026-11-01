import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const { origin, indexable } = getSiteSettings();
  return {
    rules: { userAgent: "*", ...(indexable ? { allow: "/" } : { disallow: "/" }) },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}

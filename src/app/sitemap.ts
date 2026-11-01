import type { MetadataRoute } from "next";
import { getArticles, getCaseStudies } from "@/lib/content";
import { getSiteSettings } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const { origin } = getSiteSettings();
  if (!origin) return [];
  return [
    ...["/", "/work", "/writing", "/about", "/resume"].map((path) => ({
      url: new URL(path, origin).href,
    })),
    ...getCaseStudies().map(({ metadata }) => ({
      url: `${origin}/work/${metadata.slug}`,
      lastModified: metadata.updatedAt,
    })),
    ...getArticles().map(({ metadata }) => ({ url: `${origin}/writing/${metadata.slug}` })),
  ];
}

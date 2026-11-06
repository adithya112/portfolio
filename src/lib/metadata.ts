import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { absoluteSiteUrl, getSiteSettings, type SiteSettings } from "./site";

export const siteDescription =
  "Full-stack engineering with Java and Spring Boot, backend architecture, distributed systems, database performance, and production delivery.";
export const siteTitle = `${profile.name ?? profile.brand} | ${profile.role} | Java & Spring Boot`;
export const socialImageAlt = `${profile.name ?? profile.brand} — ${profile.role}`;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  article?: { publishedAt?: string; updatedAt?: string };
};

export function createPageMetadata(
  input: PageMetadataInput,
  settings: SiteSettings = getSiteSettings(),
): Metadata {
  const url = absoluteSiteUrl(input.path, settings);
  const image = absoluteSiteUrl("/og", settings);
  const title =
    input.path === "/" ? input.title : `${input.title} | ${profile.name ?? profile.brand}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url ?? null },
    robots: { index: settings.indexable, follow: settings.indexable },
    openGraph: {
      title,
      description: input.description,
      siteName: profile.name ?? profile.brand,
      type: input.article ? "article" : "website",
      ...(url ? { url } : {}),
      ...(image
        ? {
            images: [
              { url: image, width: 1200, height: 630, alt: socialImageAlt, type: "image/png" },
            ],
          }
        : {}),
      ...(input.article?.publishedAt ? { publishedTime: input.article.publishedAt } : {}),
      ...(input.article?.updatedAt ? { modifiedTime: input.article.updatedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      ...(image ? { images: [{ url: image, alt: socialImageAlt }] } : {}),
    },
  };
}

export function getPersonSchema(settings = getSiteSettings()) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name ?? profile.brand,
    jobTitle: profile.role,
    ...(settings.origin ? { "@id": `${settings.origin}/#person`, url: settings.origin } : {}),
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
  };
}

export function getArticleSchema(
  article: { slug: string; title: string; description: string; publishedAt: string },
  settings = getSiteSettings(),
) {
  const url = absoluteSiteUrl(`/writing/${article.slug}`, settings);
  const image = absoluteSiteUrl("/og", settings);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: profile.name ?? profile.brand,
      ...(settings.origin ? { "@id": `${settings.origin}/#person` } : {}),
    },
    ...(url ? { url, mainEntityOfPage: url } : {}),
    ...(image ? { image } : {}),
  };
}

export function serializeStructuredData(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

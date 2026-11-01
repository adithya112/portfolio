// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteSiteUrl, resolveSiteSettings } from "@/lib/site";
import {
  createPageMetadata,
  getArticleSchema,
  getPersonSchema,
  serializeStructuredData,
} from "@/lib/metadata";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { profile } from "@/data/profile";

const origin = "https://portfolio.example";
const originalOrigin = profile.siteUrl;
afterEach(() => {
  profile.siteUrl = originalOrigin;
  vi.unstubAllEnvs();
});

describe("production origin and indexing", () => {
  it("never infers an origin or enables indexing when the URL is absent", () => {
    expect(resolveSiteSettings(null, "production")).toEqual({ origin: null, indexable: false });
    expect(resolveSiteSettings("", "preview")).toEqual({ origin: null, indexable: false });
  });
  it("only indexes a configured Vercel production environment", () => {
    expect(resolveSiteSettings(`${origin}/`, "production")).toEqual({ origin, indexable: true });
    for (const environment of ["preview", "development", "staging", undefined]) {
      expect(resolveSiteSettings(origin, environment)).toEqual({ origin, indexable: false });
    }
  });
  it.each([
    "portfolio.example",
    "http://portfolio.example",
    `${origin}/about`,
    `${origin}?x=1`,
    `${origin}#x`,
    "https://user:secret@portfolio.example",
  ])("rejects invalid configured origins: %s", (value) => {
    expect(() => resolveSiteSettings(value, "production")).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
  it("does not accept a URL in place of a root-relative site path", () => {
    expect(() => absoluteSiteUrl("//other.example", { origin, indexable: false })).toThrow();
  });
});
it("uses the same production origin for canonical, OG and social image metadata on previews", () => {
  const metadata = createPageMetadata(
    { title: "Writing", description: "Technical guides.", path: "/writing" },
    { origin, indexable: false },
  );
  expect(metadata.alternates?.canonical).toBe(`${origin}/writing`);
  expect(metadata.robots).toEqual({ index: false, follow: false });
  expect(metadata.openGraph).toMatchObject({
    url: `${origin}/writing`,
    images: [{ url: `${origin}/og`, width: 1200, height: 630 }],
  });
  expect(metadata.twitter).toMatchObject({ images: [{ url: `${origin}/og` }] });
});
it("omits canonical and social URLs until the actual production URL is configured", () => {
  const metadata = createPageMetadata(
    { title: "About", description: "Background.", path: "/about" },
    { origin: null, indexable: false },
  );
  expect(metadata.alternates?.canonical).toBeNull();
  expect(metadata.openGraph).not.toHaveProperty("url");
  expect(metadata.openGraph).not.toHaveProperty("images");
  expect(metadata.twitter).not.toHaveProperty("images");
});
it("sitemaps include only public pages and real editorial modification dates", () => {
  profile.siteUrl = origin;
  const entries = sitemap();
  expect(entries).toHaveLength(10);
  expect(entries.map((entry) => entry.url)).toContain(
    `${origin}/writing/java-completablefuture-executors`,
  );
  expect(entries.map((entry) => entry.url)).not.toContain(`${origin}/resume.pdf`);
  expect(
    entries.find((entry) => entry.url === `${origin}/work/analytics-performance`)?.lastModified,
  ).toBe("2026-11-01");
  expect(entries.find((entry) => entry.url === `${origin}/`)?.lastModified).toBeUndefined();
  profile.siteUrl = null;
  expect(sitemap()).toEqual([]);
});
it("robots blocks previews and allows the configured final production site", () => {
  profile.siteUrl = origin;
  vi.stubEnv("VERCEL_ENV", "preview");
  expect(robots()).toMatchObject({ rules: { disallow: "/" }, sitemap: `${origin}/sitemap.xml` });
  vi.stubEnv("VERCEL_ENV", "production");
  expect(robots()).toMatchObject({ rules: { allow: "/" } });
  profile.siteUrl = null;
  expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
});
it("structured data describes the supplied person and article without invented credentials", () => {
  expect(getPersonSchema({ origin, indexable: true })).toMatchObject({
    "@type": "Person",
    name: profile.name,
    sameAs: [profile.github, profile.linkedin],
  });
  const article = getArticleSchema(
    {
      slug: "test-guide",
      title: "Guide fixture",
      description: "Fixture.",
      publishedAt: "2026-11-01",
    },
    { origin, indexable: true },
  );
  expect(article).toMatchObject({
    "@type": "BlogPosting",
    url: `${origin}/writing/test-guide`,
    image: `${origin}/og`,
    author: { name: profile.name },
  });
  expect(getPersonSchema({ origin: null, indexable: false })).not.toHaveProperty("url");
});
it("JSON-LD serialization prevents script termination while preserving content", () => {
  const data = { name: "</script><script>fixture</script>" };
  const encoded = serializeStructuredData(data);
  expect(encoded).not.toContain("<");
  expect(JSON.parse(encoded)).toEqual(data);
});

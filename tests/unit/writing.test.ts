// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  getArticle,
  getArticles,
  getNextArticle,
  parseArticle,
  selectPublishedArticles,
  validateArticleMetadata,
} from "@/lib/content";
import { getResumeAsset } from "@/lib/resume";
import { profile } from "@/data/profile";

const fixture = {
  slug: "test-article",
  title: "Test article",
  description: "Fixture only.",
  tags: ["Test"],
  publishedAt: "2026-11-01",
  published: true,
};
it("loads two substantial guides with valid heading targets", () => {
  const articles = getArticles();
  expect(articles.map(({ metadata }) => metadata.slug)).toEqual([
    "java-completablefuture-executors",
    "reliable-background-jobs",
  ]);
  for (const article of articles) {
    expect(article.body.split(/\s+/).length).toBeGreaterThan(800);
    expect(article.toc.length).toBeGreaterThanOrEqual(8);
    expect(new Set(article.toc.map((entry) => entry.id)).size).toBe(article.toc.length);
    expect(article.body).not.toMatch(
      /publication clearance|withheld|unconfirmed|supplied evidence/,
    );
  }
});
describe("article metadata", () => {
  it.each([
    { published: "false" },
    { slug: "different-slug" },
    { tags: [] },
    { tags: [1] },
    { description: "" },
    { publishedAt: "2026-02-30" },
  ])("rejects malformed input %j", (invalid) => {
    expect(() => validateArticleMetadata({ ...fixture, ...invalid }, "test-article.mdx")).toThrow();
  });
});
it("excludes drafts, sorts by date and leaves inputs unchanged", () => {
  const items = [
    { ...fixture, publishedAt: "2026-10-01" },
    { ...fixture, slug: "newer", publishedAt: "2026-11-01" },
    { ...fixture, slug: "draft", published: false },
  ].map((metadata) =>
    parseArticle(`---\n${JSON.stringify(metadata)}\n---\n## Example\n`, `${metadata.slug}.mdx`),
  );
  expect(selectPublishedArticles(items).map(({ metadata }) => metadata.slug)).toEqual([
    "newer",
    "test-article",
  ]);
  expect(items).toHaveLength(3);
});
it("rejects missing metadata and empty article content", () => {
  expect(() => parseArticle("## Missing metadata", "test-article.mdx")).toThrow(/frontmatter/);
  expect(() => parseArticle(`---\n${JSON.stringify(fixture)}\n---\n`, "test-article.mdx")).toThrow(
    /empty/,
  );
});
it("resolves only known articles and links the next guide", () => {
  expect(getArticle("../profile")).toBeUndefined();
  expect(getArticle("unknown-article")).toBeUndefined();
  expect(getNextArticle("unknown-article")).toBeUndefined();
  expect(getNextArticle("java-completablefuture-executors")?.slug).toBe("reliable-background-jobs");
});
it("serves only an explicitly configured local PDF", () => {
  expect(getResumeAsset()).toBe("/resume.pdf");
  const saved = profile.resumePath;
  try {
    profile.resumePath = null;
    expect(getResumeAsset()).toBeNull();
    profile.resumePath = "https://example.test/resume.pdf";
    expect(() => getResumeAsset()).toThrow(/public\/resume.pdf/);
  } finally {
    profile.resumePath = saved;
  }
});

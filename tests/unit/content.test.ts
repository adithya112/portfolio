// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  extractToc,
  getCaseStudies,
  getCaseStudy,
  getNextCaseStudy,
  parseCaseStudy,
  selectPublishedCaseStudies,
  validateCaseStudyMetadata,
} from "@/lib/content";

const metadata = {
  slug: "test-study",
  title: "Test study fixture",
  summary: "Fixture only.",
  domain: "Testing",
  technologies: ["Test"],
  published: true,
  updatedAt: "2026-11-01",
};
it("loads all three complete studies in featured order with unique anchors", () => {
  const studies = getCaseStudies();
  expect(studies.map(({ metadata }) => metadata.slug)).toEqual([
    "analytics-performance",
    "reliable-background-processing",
    "concurrent-video-exports",
  ]);
  const required = [
    "TL;DR / Impact",
    "Context and requirements",
    "Before architecture",
    "Failure mode or bottleneck",
    "Constraints",
    "Options and tradeoffs",
    "After architecture",
    "Implementation",
    "Failure handling",
    "Results",
    "What I learned / next iteration",
  ];
  for (const study of studies) {
    expect(study.toc.filter((entry) => entry.depth === 2).map((entry) => entry.title)).toEqual(
      required,
    );
    expect(new Set(study.toc.map((entry) => entry.id)).size).toBe(study.toc.length);
    expect(study.body).toContain("<ArchitectureDiagram");
    expect(study.body).not.toMatch(/Yirla|Appizap|Motivision|12–40|10M|20,000|pgBackRest/);
  }
});

it("uses actual Markdown headings, excluding fenced code, with duplicate-safe slugs", () => {
  expect(
    extractToc(
      "## Retry policies\n\n## Retry policies\n\n```text\n## Not a heading\n```\n\n### `Java` executors\n",
    ),
  ).toEqual([
    { id: "retry-policies", title: "Retry policies", depth: 2 },
    { id: "retry-policies-1", title: "Retry policies", depth: 2 },
    { id: "java-executors", title: "Java executors", depth: 3 },
  ]);
});

it("rejects missing frontmatter, empty bodies and duplicate YAML keys", () => {
  expect(() => parseCaseStudy("## No metadata", "test-study.mdx")).toThrow(/frontmatter/);
  expect(() => parseCaseStudy(`---\n${JSON.stringify(metadata)}\n---\n`, "test-study.mdx")).toThrow(
    /empty/,
  );
  expect(() =>
    parseCaseStudy("---\nslug: test-study\nslug: duplicate\n---\n## Body", "test-study.mdx"),
  ).toThrow();
});

describe("metadata validation", () => {
  it.each([
    { title: "" },
    { slug: "../secret" },
    { published: "false" },
    { technologies: [] },
    { technologies: [12] },
    { updatedAt: "2026-02-30" },
    { updatedAt: "not-a-date" },
    { featuredOrder: -1 },
    { impact: false },
  ])("rejects malformed values %j", (invalid) => {
    expect(() =>
      validateCaseStudyMetadata({ ...metadata, ...invalid }, "test-study.mdx"),
    ).toThrow();
  });
});

it("excludes drafts from the data used by listings, static params and lookup", () => {
  const studies = [true, false].map((published) => {
    const slug = published ? "test-study" : "test-draft";
    return parseCaseStudy(
      `---\n${JSON.stringify({ ...metadata, slug, published })}\n---\n## Content fixture\n`,
      `${slug}.mdx`,
    );
  });
  const published = selectPublishedCaseStudies(studies);
  expect(published.map(({ metadata }) => metadata.slug)).toEqual(["test-study"]);
  expect(published.find(({ metadata }) => metadata.slug === "test-draft")).toBeUndefined();
  expect(studies).toHaveLength(2);
});

it("does not resolve invalid or unknown slugs", () => {
  expect(getCaseStudy("../profile")).toBeUndefined();
  expect(getCaseStudy("%2e%2e")).toBeUndefined();
  expect(getCaseStudy("unknown-study")).toBeUndefined();
});

it("offers a complete next-study cycle and no link for unknown content", () => {
  expect(getNextCaseStudy("analytics-performance")?.slug).toBe("reliable-background-processing");
  expect(getNextCaseStudy("concurrent-video-exports")?.slug).toBe("analytics-performance");
  expect(getNextCaseStudy("unknown-study")).toBeUndefined();
});

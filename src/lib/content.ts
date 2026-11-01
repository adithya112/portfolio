import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";
import type {
  Article,
  ArticleMetadata,
  CaseStudy,
  CaseStudyMetadata,
  TocEntry,
} from "@/types/content";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateCaseStudyMetadata(value: unknown, filename: string): CaseStudyMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${filename}: metadata must be an object`);
  const data = value as Record<string, unknown>;
  for (const key of ["slug", "title", "summary", "domain", "updatedAt"]) {
    if (typeof data[key] !== "string" || !(data[key] as string).trim())
      throw new Error(`${filename}: ${key} must be a nonempty string`);
  }
  if (!slugPattern.test(data.slug as string) || data.slug !== path.basename(filename, ".mdx"))
    throw new Error(`${filename}: slug must match its filename`);
  if (typeof data.published !== "boolean")
    throw new Error(`${filename}: published must be a boolean`);
  if (
    !Array.isArray(data.technologies) ||
    data.technologies.length === 0 ||
    data.technologies.some((item) => typeof item !== "string" || !item.trim())
  )
    throw new Error(`${filename}: technologies must be a nonempty string array`);
  const date = data.updatedAt as string;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw new Error(`${filename}: updatedAt must be a real ISO date`);
  if (
    data.featuredOrder !== undefined &&
    (typeof data.featuredOrder !== "number" ||
      !Number.isInteger(data.featuredOrder) ||
      data.featuredOrder < 0)
  )
    throw new Error(`${filename}: featuredOrder must be a nonnegative integer`);
  if (data.impact !== undefined && (typeof data.impact !== "string" || !data.impact.trim()))
    throw new Error(`${filename}: impact must be a nonempty string`);
  return data as CaseStudyMetadata;
}

export function extractToc(body: string): TocEntry[] {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(body);
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  visit(tree, "heading", (node) => {
    const title = toString(node);
    // rehype-slug uses the same slugger and includes every heading in its counter.
    const id = slugger.slug(title);
    if (node.depth === 2 || node.depth === 3) entries.push({ id, title, depth: node.depth });
  });
  return entries;
}

export function parseCaseStudy(source: string, filename: string): CaseStudy {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) throw new Error(`${filename}: YAML frontmatter is required`);
  const metadata = validateCaseStudyMetadata(parse(frontmatter[1]), filename);
  const body = source.slice(frontmatter[0].length);
  if (!body.trim()) throw new Error(`${filename}: content must not be empty`);
  return { metadata, body, toc: extractToc(body) };
}

export function selectPublishedCaseStudies(studies: readonly CaseStudy[]): CaseStudy[] {
  return studies
    .filter(({ metadata }) => metadata.published)
    .sort(
      (a, b) =>
        (a.metadata.featuredOrder ?? Infinity) - (b.metadata.featuredOrder ?? Infinity) ||
        a.metadata.slug.localeCompare(b.metadata.slug),
    );
}

export function getCaseStudies(): CaseStudy[] {
  const studies = readdirSync(path.join(process.cwd(), "src/content/case-studies"))
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) =>
      parseCaseStudy(
        readFileSync(path.join(process.cwd(), "src/content/case-studies", filename), "utf8"),
        filename,
      ),
    );
  return selectPublishedCaseStudies(studies);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  // Look up known published slugs before building any filesystem/import path.
  if (!slugPattern.test(slug)) return undefined;
  return getCaseStudies().find(({ metadata }) => metadata.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudyMetadata | undefined {
  const studies = getCaseStudies();
  const index = studies.findIndex(({ metadata }) => metadata.slug === slug);
  if (index === -1 || studies.length < 2) return undefined;
  return studies[(index + 1) % studies.length].metadata;
}

export function validateArticleMetadata(value: unknown, filename: string): ArticleMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${filename}: metadata must be an object`);
  const data = value as Record<string, unknown>;
  for (const key of ["slug", "title", "description", "publishedAt"]) {
    if (typeof data[key] !== "string" || !(data[key] as string).trim())
      throw new Error(`${filename}: ${key} must be a nonempty string`);
  }
  if (!slugPattern.test(data.slug as string) || data.slug !== path.basename(filename, ".mdx"))
    throw new Error(`${filename}: slug must match its filename`);
  if (typeof data.published !== "boolean")
    throw new Error(`${filename}: published must be a boolean`);
  if (
    !Array.isArray(data.tags) ||
    !data.tags.length ||
    data.tags.some((tag) => typeof tag !== "string" || !tag.trim())
  )
    throw new Error(`${filename}: tags must be a nonempty string array`);
  const date = data.publishedAt as string;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw new Error(`${filename}: publishedAt must be a real ISO date`);
  return data as ArticleMetadata;
}

export function parseArticle(source: string, filename: string): Article {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) throw new Error(`${filename}: YAML frontmatter is required`);
  const metadata = validateArticleMetadata(parse(frontmatter[1]), filename);
  const body = source.slice(frontmatter[0].length);
  if (!body.trim()) throw new Error(`${filename}: content must not be empty`);
  return { metadata, body, toc: extractToc(body) };
}

export function selectPublishedArticles(entries: readonly Article[]): Article[] {
  return entries
    .filter(({ metadata }) => metadata.published)
    .sort(
      (a, b) =>
        b.metadata.publishedAt.localeCompare(a.metadata.publishedAt) ||
        a.metadata.slug.localeCompare(b.metadata.slug),
    );
}

export function getArticles(): Article[] {
  return selectPublishedArticles(
    readdirSync(path.join(process.cwd(), "src/content/writing"))
      .filter((filename) => filename.endsWith(".mdx"))
      .map((filename) =>
        parseArticle(
          readFileSync(path.join(process.cwd(), "src/content/writing", filename), "utf8"),
          filename,
        ),
      ),
  );
}

export function getArticle(slug: string): Article | undefined {
  if (!slugPattern.test(slug)) return undefined;
  return getArticles().find(({ metadata }) => metadata.slug === slug);
}

export function getNextArticle(slug: string): ArticleMetadata | undefined {
  const articles = getArticles();
  const index = articles.findIndex(({ metadata }) => metadata.slug === slug);
  if (index < 0 || articles.length < 2) return undefined;
  return articles[(index + 1) % articles.length].metadata;
}

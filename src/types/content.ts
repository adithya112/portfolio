export type CaseStudyMetadata = {
  slug: string;
  title: string;
  summary: string;
  domain: string;
  technologies: string[];
  impact?: string;
  published: boolean;
  featuredOrder?: number;
  updatedAt: string;
};

export type TocEntry = { id: string; title: string; depth: 2 | 3 };
export type CaseStudy = { metadata: CaseStudyMetadata; toc: TocEntry[]; body: string };

export type ArticleMetadata = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  published: boolean;
};
export type Article = { metadata: ArticleMetadata; toc: TocEntry[]; body: string };

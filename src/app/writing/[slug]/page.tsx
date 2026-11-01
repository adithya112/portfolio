import { createPageMetadata, getArticleSchema } from "@/lib/metadata";
import { StructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/content/table-of-contents";
import { getArticles, getArticle, getNextArticle } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getArticles().map(({ metadata }) => ({ slug: metadata.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return createPageMetadata({
    title: article.metadata.title,
    description: article.metadata.description,
    path: `/writing/${article.metadata.slug}`,
    article: { publishedAt: article.metadata.publishedAt },
  });
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const { default: Content } = await import(`@/content/writing/${article.metadata.slug}.mdx`);
  const next = getNextArticle(slug);
  return (
    <Container className="case-study">
      <StructuredData data={getArticleSchema(article.metadata)} />
      <Link className="back-link" href="/writing">
        <ArrowLeft size={16} aria-hidden="true" />
        All writing
      </Link>
      <header className="case-header">
        <p className="eyebrow">Technical guide</p>
        <h1>{article.metadata.title}</h1>
        <p className="intro">{article.metadata.description}</p>
        <div className="tags">
          {article.metadata.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <p className="case-updated">
          Published{" "}
          <time dateTime={article.metadata.publishedAt}>{article.metadata.publishedAt}</time>
        </p>
      </header>
      <div className="case-layout">
        <TableOfContents entries={article.toc} />
        <article className="case-prose" aria-label="Technical article">
          <Content />
        </article>
      </div>
      {next && (
        <nav className="next-study" aria-label="Next article">
          <span className="eyebrow">Continue reading</span>
          <Link href={`/writing/${next.slug}`}>
            {next.title}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </nav>
      )}
    </Container>
  );
}

import { createPageMetadata } from "@/lib/metadata";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/content/table-of-contents";
import { getCaseStudies, getCaseStudy, getNextCaseStudy } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return getCaseStudies().map(({ metadata }) => ({ slug: metadata.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return createPageMetadata({
    title: study.metadata.title,
    description: study.metadata.summary,
    path: `/work/${study.metadata.slug}`,
    article: { updatedAt: study.metadata.updatedAt },
  });
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const { default: Content } = await import(`@/content/case-studies/${study.metadata.slug}.mdx`);
  const next = getNextCaseStudy(slug);
  return (
    <Container className="case-study">
      <Link className="back-link" href="/work">
        <ArrowLeft size={16} aria-hidden="true" />
        All engineering work
      </Link>
      <header className="case-header">
        <p className="eyebrow">{study.metadata.domain}</p>
        <h1>{study.metadata.title}</h1>
        <p className="intro">{study.metadata.summary}</p>
        <div className="tags">
          {study.metadata.technologies.map((technology) => (
            <Badge key={technology}>{technology}</Badge>
          ))}
        </div>
        <p className="case-updated">
          Updated <time dateTime={study.metadata.updatedAt}>{study.metadata.updatedAt}</time>
        </p>
      </header>
      <div className="case-layout">
        <TableOfContents entries={study.toc} />
        <article className="case-prose" aria-label="Case study">
          <Content />
        </article>
      </div>
      {next && (
        <nav className="next-study" aria-label="Next case study">
          <span className="eyebrow">Continue reading</span>
          <Link href={`/work/${next.slug}`}>
            <span>{next.title}</span>
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </nav>
      )}
    </Container>
  );
}

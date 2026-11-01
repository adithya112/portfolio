import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  title: "Writing",
  description: "Technical guides on Java concurrency and reliable asynchronous processing.",
  path: "/writing",
});
export default function WritingPage() {
  return (
    <Container className="work-index writing-index">
      <p className="eyebrow">Technical writing</p>
      <h1>
        Reasoning about
        <br />
        reliable backends.
      </h1>
      <p className="intro">
        Practical guides to concurrency, resource boundaries, and failure recovery. Each article
        develops a design through examples and its tradeoffs.
      </p>
      <div className="work-index-list">
        {getArticles().map(({ metadata }) => (
          <article className="article-card" key={metadata.slug}>
            <p className="eyebrow">
              <time dateTime={metadata.publishedAt}>{metadata.publishedAt}</time>
            </p>
            <h2>
              <Link href={`/writing/${metadata.slug}`}>
                {metadata.title}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </h2>
            <p className="muted">{metadata.description}</p>
            <div className="tags">
              {metadata.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}

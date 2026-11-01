import Link from "next/link";
import type { ArticleMetadata } from "@/types/content";
import { getArticles } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";

export function SelectedWriting({
  entries = getArticles().map(({ metadata }) => metadata),
}: {
  entries?: readonly ArticleMetadata[];
}) {
  const published = entries
    .filter((article) => article.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 2);
  if (published.length === 0) return null;
  return (
    <section className="home-section" aria-labelledby="writing-title">
      <SectionHeading id="writing-title" eyebrow="Writing">
        Notes from engineering practice.
      </SectionHeading>
      <div className="writing-grid">
        {published.map((article) => (
          <article key={article.slug}>
            <h3>
              <Link href={`/writing/${article.slug}`}>{article.title}</Link>
            </h3>
            <p className="muted">{article.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

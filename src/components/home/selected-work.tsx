import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { workHighlights } from "@/data/projects";
import { getCaseStudies } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

export function SelectedWork() {
  const published = new Set(getCaseStudies().map(({ metadata }) => metadata.slug));
  return (
    <section id="work" className="home-section" aria-labelledby="work-title">
      <SectionHeading id="work-title" eyebrow="01 / Selected engineering work">
        Production problems.
        <br />
        Deliberate solutions.
      </SectionHeading>
      <div className="work-list">
        {workHighlights.map((work, index) => (
          <article className="work-highlight" key={work.id}>
            <span className="work-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <p className="eyebrow">{work.domain}</p>
              <h3>
                {published.has(work.slug) ? (
                  <Link href={`/work/${work.slug}`}>
                    {work.title}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                ) : (
                  work.title
                )}
              </h3>
              <p className="muted">{work.problem}</p>
            </div>
            <div className="work-detail">
              <p>{work.contribution}</p>
              <div className="tags">
                {work.technologies.map((technology) => (
                  <Badge key={technology}>{technology}</Badge>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

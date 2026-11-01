import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudyMetadata } from "@/data/projects";
import { Badge } from "../ui/badge";

export function ProjectCard({ project }: { project: CaseStudyMetadata }) {
  if (!project.published) return null;
  return (
    <article className="project-card">
      <p className="eyebrow">{project.domain}</p>
      <h3>
        <Link href={`/work/${project.slug}`}>
          {project.title}
          <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </h3>
      <p className="muted">{project.summary}</p>
      {project.impact && <p>{project.impact}</p>}
      <div className="tags">
        {project.technologies.map((technology) => (
          <Badge key={technology}>{technology}</Badge>
        ))}
      </div>
    </article>
  );
}

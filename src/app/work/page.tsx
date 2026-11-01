import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/content/project-card";
import { getCaseStudies } from "@/lib/content";

export const metadata: Metadata = createPageMetadata({
  title: "Engineering work",
  description:
    "Three case studies on analytics performance, reliable background processing, and concurrent Java exports.",
  path: "/work",
});

export default function WorkPage() {
  const studies = getCaseStudies();
  return (
    <Container className="work-index">
      <p className="eyebrow">Engineering work</p>
      <h1>
        Decisions behind
        <br />
        dependable systems.
      </h1>
      <p className="intro">
        Production problems, implementation boundaries, and the tradeoffs behind the result. Explore
        analytics performance, reliable background processing, and concurrent Java exports.
      </p>
      <div className="work-index-list">
        {studies.map(({ metadata }) => (
          <ProjectCard key={metadata.slug} project={metadata} />
        ))}
      </div>
    </Container>
  );
}

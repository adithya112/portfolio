import { SiteLink } from "@/components/ui/site-link";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Download, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile, publicContacts } from "@/data/profile";
import { skills } from "@/data/skills";
import { workHighlights } from "@/data/projects";
import { home } from "@/data/home";
import { getResumeAsset } from "@/lib/resume";
import Link from "next/link";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Full-stack engineering experience, technical focus, and selected production contributions.",
  path: "/resume",
});
export default function ResumePage() {
  const pdf = getResumeAsset();
  return (
    <Container className="resume-page">
      <header className="supporting-header">
        <p className="eyebrow">Resume</p>
        <h1>{profile.name ?? profile.role}</h1>
        <p className="resume-position">
          {profile.name ? `${profile.role} · ` : ""}
          {profile.location}
        </p>
        <p className="intro">{home.description}</p>
        <div className="hero-actions">
          {pdf && (
            <>
              <SiteLink className="button button-primary" href={pdf} download>
                Download resume PDF
                <Download size={16} aria-hidden="true" />
              </SiteLink>
              <SiteLink className="button button-secondary" href={pdf} newTab>
                Open PDF
                <ArrowUpRight size={16} aria-hidden="true" />
              </SiteLink>
            </>
          )}
          {publicContacts.map((contact) => (
            <SiteLink className="button button-secondary" key={contact.label} href={contact.href}>
              {contact.label}
            </SiteLink>
          ))}
        </div>
      </header>
      <section className="resume-section" aria-labelledby="resume-experience">
        <SectionHeading id="resume-experience" eyebrow="Experience">
          Production SaaS engineering.
        </SectionHeading>
        <article className="resume-role" aria-labelledby="nighthack-role">
          <header>
            <h3 id="nighthack-role">Nighthack Labs</h3>
            <p className="muted resume-role-dates">June 2024–Present</p>
          </header>
          <p className="resume-role-title">Current designation: Lead Software Engineer</p>
          <p>
            Hands-on backend and full-stack engineering, architectural decisions, production
            troubleshooting, testing, code reviews, cloud delivery, and mentoring two engineers.
          </p>
          <p>
            Built semantic retrieval using embeddings and PostgreSQL/pgvector similarity search,
            grouping related content into themes and supplying representative context for LLM
            analysis.
          </p>
        </article>
        <article className="resume-role" aria-labelledby="incture-role">
          <header>
            <h3 id="incture-role">Incture Technologies</h3>
            <p className="muted resume-role-dates">August 2023–May 2024</p>
          </header>
          <p className="resume-role-title">Associate Software Engineer</p>
          <p>
            Developed enterprise Java/Spring Boot REST APIs, persistence, validations, exception
            handling, tests, and frontend integrations.
          </p>
        </article>
      </section>
      <section className="resume-section" aria-labelledby="resume-contributions">
        <SectionHeading id="resume-contributions" eyebrow="Selected contributions">
          Backend engineering impact.
        </SectionHeading>
        {workHighlights.map((work) => (
          <article className="resume-contribution" key={work.id}>
            <h3>
              <Link href={`/work/${work.slug}`}>{work.title}</Link>
            </h3>
            <p className="muted">{work.contribution}</p>
          </article>
        ))}
      </section>
      <section className="resume-section" aria-labelledby="resume-skills">
        <SectionHeading id="resume-skills" eyebrow="Technical focus">
          Core tools and systems.
        </SectionHeading>
        <dl className="resume-skills">
          {skills.map((skill) => (
            <div key={skill.title}>
              <dt>{skill.title}</dt>
              <dd>{skill.technologies.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}

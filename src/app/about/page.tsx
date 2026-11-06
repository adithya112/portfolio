import { SiteLink } from "@/components/ui/site-link";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { about } from "@/data/about";
import { profile, publicContacts } from "@/data/profile";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Full-stack engineering, production application ownership, and a practical approach to performance and reliability.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <Container className="about-page">
      <header className="supporting-header">
        <p className="eyebrow">About{profile.name ? ` ${profile.name}` : ""}</p>
        <h1>{about.heading}</h1>
        <p className="intro">{about.experience}</p>
      </header>
      <section className="about-page-body" aria-labelledby="ownership-title">
        <SectionHeading id="ownership-title" eyebrow="Working approach">
          From a production problem
          <br />
          to a maintainable system.
        </SectionHeading>
        <div className="about-copy">
          <p>{about.approach}</p>
          <p>{about.collaboration}</p>
        </div>
      </section>
      <section className="home-section" aria-labelledby="principles-title">
        <SectionHeading id="principles-title" eyebrow="Engineering principles">
          How I approach the work.
        </SectionHeading>
        <div className="principle-grid">
          {about.principles.map((principle) => (
            <div key={principle.title}>
              <h3>{principle.title}</h3>
              <p className="muted">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-interests" aria-labelledby="interests-title">
        <h2 id="interests-title">Beyond the keyboard</h2>
        <p className="muted">{about.interests}</p>
      </section>
      <div className="hero-actions">
        <ButtonLink href="/work">Explore engineering work</ButtonLink>
        <ButtonLink href="/resume" variant="secondary">
          View resume
        </ButtonLink>
        {publicContacts.map((contact) => (
          <SiteLink className="button button-secondary" key={contact.label} href={contact.href}>
            {contact.label}
          </SiteLink>
        ))}
      </div>
    </Container>
  );
}

import { home } from "@/data/home";
import { SectionHeading } from "@/components/ui/section-heading";

export function AboutSnapshot() {
  return (
    <section id="about" className="home-section about-snapshot" aria-labelledby="about-title">
      <SectionHeading id="about-title" eyebrow="02 / Approach">
        Hands-on engineering.
        <br />
        End-to-end ownership.
      </SectionHeading>
      <div className="about-copy">
        <p>{home.about}</p>
        <p className="muted">{home.collaboration}</p>
      </div>
    </section>
  );
}

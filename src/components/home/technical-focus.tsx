import { skills } from "@/data/skills";
import { SectionHeading } from "@/components/ui/section-heading";

export function TechnicalFocus() {
  return (
    <section id="focus" className="home-section" aria-labelledby="focus-title">
      <SectionHeading id="focus-title" eyebrow="03 / Technical focus">
        The tools behind the work.
      </SectionHeading>
      <div className="skill-grid">
        {skills.map((category) => (
          <div key={category.title}>
            <h3>{category.title}</h3>
            <ul>
              {category.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

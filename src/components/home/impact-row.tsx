import { home } from "@/data/home";

export function ImpactRow() {
  // The owner requested qualitative outcomes.
  return (
    <section className="impact-row" aria-label="Engineering outcomes">
      {home.outcomes.map((outcome) => (
        <div key={outcome.title}>
          <h2>{outcome.title}</h2>
          <p>{outcome.description}</p>
        </div>
      ))}
    </section>
  );
}

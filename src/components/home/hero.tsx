import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { home } from "@/data/home";
import { ButtonLink } from "@/components/ui/button-link";

export function Hero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div>
        <p className="eyebrow">{profile.role}</p>
        <h1 id="hero-title">
          {home.headline.primary} <span>{home.headline.accent}</span>
        </h1>
        <p className="intro">{home.description}</p>
        <div className="hero-actions">
          <ButtonLink href="#work">
            Explore my work <ArrowDown size={16} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/resume" variant="secondary">
            View resume <ArrowUpRight size={16} aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
      <aside className="hero-aside" aria-label="Engineering focus">
        <p className="eyebrow">From design to production</p>
        <p>
          Understand the bottleneck.
          <br />
          Make the tradeoff.
          <br />
          <span>Own the implementation.</span>
        </p>
        <div className="hero-location">
          {profile.location}
          <span>Java · Distributed systems · Cloud</span>
        </div>
      </aside>
    </section>
  );
}

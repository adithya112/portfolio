import { Container } from "@/components/layout/container";
import { Hero } from "@/components/home/hero";
import { ImpactRow } from "@/components/home/impact-row";
import { SelectedWork } from "@/components/home/selected-work";
import { AboutSnapshot } from "@/components/home/about-snapshot";
import { TechnicalFocus } from "@/components/home/technical-focus";
import { SelectedWriting } from "@/components/home/selected-writing";
import { ContactCta } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <ImpactRow />
      <SelectedWork />
      <AboutSnapshot />
      <TechnicalFocus />
      <SelectedWriting />
      <ContactCta />
    </Container>
  );
}
